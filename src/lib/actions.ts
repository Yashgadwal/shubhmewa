"use server";

import { cookies } from "next/headers";
import { prisma } from "./prisma";
import { verifyPassword } from "./auth";
import { redirect } from "next/navigation";

// ==========================================
// ADMIN AUTHENTICATION ACTIONS
// ==========================================

export async function adminLogin(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Please enter both email and password." };
  }

  try {
    const admin = await prisma.adminUser.findUnique({
      where: { email },
    });

    if (!admin) {
      return { error: "Invalid email or password." };
    }

    const isValid = verifyPassword(password, admin.passwordHash);
    if (!isValid) {
      return { error: "Invalid email or password." };
    }

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set("admin_session", email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: "lax",
    });

    // Log Activity
    await prisma.activityLog.create({
      data: {
        adminId: admin.id,
        action: "LOGIN",
        details: `Admin logged in successfully from ${email}`,
      },
    });

  } catch (error) {
    console.error("Login error:", error);
    return { error: "Something went wrong. Please try again." };
  }

  redirect("/admin/dashboard");
}

export async function adminLogout() {
  const cookieStore = await cookies();
  const email = cookieStore.get("admin_session")?.value;

  if (email) {
    const admin = await prisma.adminUser.findUnique({ where: { email } });
    if (admin) {
      await prisma.activityLog.create({
        data: {
          adminId: admin.id,
          action: "LOGOUT",
          details: `Admin logged out`,
        },
      });
    }
  }

  cookieStore.delete("admin_session");
  redirect("/admin/login");
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  if (!session) return null;

  try {
    const admin = await prisma.adminUser.findUnique({
      where: { email: session.value },
      select: { id: true, email: true, name: true, role: true },
    });
    return admin;
  } catch (e) {
    return null;
  }
}

// ==========================================
// CLIENT-FACING E-COMMERCE & LEAD ACTIONS
// ==========================================

export async function createOrder(data: {
  customerName: string;
  phone: string;
  whatsapp: string;
  email?: string;
  shippingAddress?: string;
  deliveryType: "DELIVERY" | "PICKUP";
  orderNotes?: string;
  couponCode?: string;
  items: {
    productId: string;
    variantId?: string;
    productName: string;
    weight: string;
    quantity: number;
    price: number;
  }[];
  paymentMethod: "COD" | "ONLINE";
  checkoutMethod: "WHATSAPP" | "ONLINE";
}) {
  try {
    // 1. Generate Order Number
    const orderNumber = `HDF-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    // 2. Resolve Coupon discount
    let discountAmount = 0;
    let couponId: string | null = null;
    if (data.couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: data.couponCode, isActive: true },
      });
      if (coupon) {
        couponId = coupon.id;
        const subtotal = data.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        if (coupon.type === "PERCENTAGE") {
          discountAmount = (subtotal * coupon.value) / 100;
          if (coupon.maxDiscount) {
            discountAmount = Math.min(discountAmount, coupon.maxDiscount);
          }
        } else {
          discountAmount = coupon.value;
        }
        
        // Update coupon usage
        await prisma.coupon.update({
          where: { id: coupon.id },
          data: { usageCount: { increment: 1 } },
        });
      }
    }

    const subtotal = data.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    // Delivery fees setup from settings
    const settings = await prisma.websiteSetting.findMany({
      where: { key: { in: ["announcement_text", "whatsapp_number"] } }
    });
    
    let deliveryFee = 0;
    if (data.deliveryType === "DELIVERY") {
      deliveryFee = subtotal - discountAmount >= 999 ? 0 : 50; // free above 999
    }

    const totalAmount = subtotal - discountAmount + deliveryFee;

    // 4. Create Order
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerId: null,
        customerName: data.customerName,
        phone: data.phone,
        whatsapp: data.whatsapp,
        email: data.email || null,
        shippingAddress: data.shippingAddress || null,
        deliveryType: data.deliveryType,
        orderNotes: data.orderNotes || null,
        couponId,
        discountAmount,
        deliveryFee,
        totalAmount,
        paymentStatus: data.paymentMethod === "ONLINE" ? "PAID" : "PENDING",
        orderStatus: "NEW",
        paymentMethod: data.paymentMethod,
        checkoutMethod: data.checkoutMethod,
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId || null,
            productName: item.productName,
            weight: item.weight,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });

    // 5. Update stock levels
    for (const item of data.items) {
      if (item.variantId) {
        await prisma.productVariant.update({
          where: { id: item.variantId },
          data: { stockQuantity: { decrement: item.quantity } },
        });
      } else {
        await prisma.product.update({
          where: { id: item.productId },
          data: { stockQuantity: { decrement: item.quantity } },
        });
      }
    }

    return { success: true, orderNumber, totalAmount, order };
  } catch (error) {
    console.error("Order creation failed:", error);
    return { success: false, error: "Failed to place order. Please try again." };
  }
}

export async function createEnquiry(data: {
  customerName: string;
  phone: string;
  whatsapp: string;
  email?: string;
  occasion?: string;
  quantity?: number;
  budgetPerHamper?: number;
  requiredDeliveryDate?: string;
  customizationDetails?: string;
  message?: string;
}) {
  try {
    const enquiry = await prisma.enquiry.create({
      data: {
        customerName: data.customerName,
        phone: data.phone,
        whatsapp: data.whatsapp,
        email: data.email || null,
        occasion: data.occasion || null,
        quantity: data.quantity ? Number(data.quantity) : null,
        budgetPerHamper: data.budgetPerHamper ? Number(data.budgetPerHamper) : null,
        requiredDeliveryDate: data.requiredDeliveryDate ? new Date(data.requiredDeliveryDate) : null,
        customizationDetails: data.customizationDetails || null,
        message: data.message || null,
        status: "NEW",
      },
    });

    return { success: true, enquiry };
  } catch (error) {
    console.error("Enquiry creation failed:", error);
    return { success: false, error: "Failed to submit enquiry. Please try again." };
  }
}

export async function createContactSubmission(data: {
  name: string;
  email: string;
  phone: string;
  subject?: string;
  message: string;
}) {
  try {
    const submission = await prisma.contactSubmission.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        subject: data.subject || null,
        message: data.message,
        status: "NEW",
      },
    });
    return { success: true, submission };
  } catch (error) {
    console.error("Contact submission failed:", error);
    return { success: false, error: "Failed to send message. Please try again." };
  }
}

export async function validateCouponCode(code: string, subtotal: number) {
  try {
    const coupon = await prisma.coupon.findUnique({
      where: { code, isActive: true },
    });

    if (!coupon) {
      return { valid: false, error: "Invalid coupon code." };
    }

    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
      return { valid: false, error: "Coupon code has expired." };
    }

    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return { valid: false, error: "Coupon usage limit reached." };
    }

    if (subtotal < coupon.minOrderValue) {
      return { valid: false, error: `Minimum order of ₹${coupon.minOrderValue} required for this coupon.` };
    }

    let discount = 0;
    if (coupon.type === "PERCENTAGE") {
      discount = (subtotal * coupon.value) / 100;
      if (coupon.maxDiscount) {
        discount = Math.min(discount, coupon.maxDiscount);
      }
    } else {
      discount = coupon.value;
    }

    return { valid: true, discount, type: coupon.type, value: coupon.value };
  } catch (error) {
    return { valid: false, error: "Error validating coupon." };
  }
}

export async function trackOrderOrEnquiry(query: string) {
  try {
    // Check if order exists
    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { orderNumber: query },
          { phone: query }
        ]
      },
      include: {
        items: true,
      },
      orderBy: { createdAt: "desc" },
    });

    if (order) {
      return { type: "order", data: order };
    }

    // Check if bulk enquiry exists
    const enquiry = await prisma.enquiry.findFirst({
      where: {
        OR: [
          { id: query },
          { phone: query }
        ]
      },
      orderBy: { createdAt: "desc" },
    });

    if (enquiry) {
      return { type: "enquiry", data: enquiry };
    }

    return { error: "No order or bulk enquiry found matching the details." };
  } catch (e) {
    return { error: "Tracking request failed. Please check the ID and try again." };
  }
}

// ==========================================
// ADMIN DASHBOARD ACTIONS (CRUD)
// ==========================================

export async function getDashboardStats() {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");

  const [
    productsCount,
    categoriesCount,
    enquiriesCount,
    ordersCount,
    orders,
    recentEnquiries,
    recentOrders,
    testimonialsCount,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.enquiry.count(),
    prisma.order.count(),
    prisma.order.findMany({ select: { totalAmount: true, checkoutMethod: true, orderStatus: true } }),
    prisma.enquiry.findMany({ take: 5, orderBy: { createdAt: "desc" } }),
    prisma.order.findMany({ take: 5, orderBy: { createdAt: "desc" } }),
    prisma.testimonial.count(),
  ]);

  const whatsappClicks = orders.filter(o => o.checkoutMethod === "WHATSAPP").length;
  const totalRevenue = orders
    .filter(o => o.orderStatus !== "CANCELLED")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  // Group revenue by status
  const salesByStatus = {
    DELIVERED: orders.filter(o => o.orderStatus === "DELIVERED").reduce((sum, o) => sum + o.totalAmount, 0),
    PENDING: orders.filter(o => o.orderStatus === "NEW" || o.orderStatus === "CONFIRMED").reduce((sum, o) => sum + o.totalAmount, 0),
    CANCELLED: orders.filter(o => o.orderStatus === "CANCELLED").reduce((sum, o) => sum + o.totalAmount, 0),
  };

  return {
    productsCount,
    categoriesCount,
    enquiriesCount,
    ordersCount,
    whatsappClicks,
    totalRevenue,
    salesByStatus,
    recentEnquiries,
    recentOrders,
    testimonialsCount,
  };
}

export async function updateWebsiteSetting(key: string, value: string) {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");

  await prisma.websiteSetting.upsert({
    where: { key },
    update: { value },
    create: { key, value, group: "GENERAL" },
  });

  return { success: true };
}

export async function getPublicSettings() {
  try {
    const settings = await prisma.websiteSetting.findMany();
    const map: Record<string, string> = {};
    settings.forEach((s) => {
      map[s.key] = s.value;
    });
    return map;
  } catch (e) {
    return {};
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");

  try {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { orderStatus: status },
    });

    await prisma.activityLog.create({
      data: {
        adminId: session.id,
        action: "UPDATE_ORDER_STATUS",
        details: `Updated order ${order.orderNumber} status to ${status}`,
      },
    });

    return { success: true, order };
  } catch (error) {
    return { success: false, error: "Failed to update status" };
  }
}

export async function updateOrderInternalNotes(orderId: string, notes: string) {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");

  try {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { internalNotes: notes },
    });

    return { success: true, order };
  } catch (error) {
    return { success: false, error: "Failed to update notes" };
  }
}

export async function updateEnquiryStatus(enquiryId: string, status: string) {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");

  try {
    const enquiry = await prisma.enquiry.update({
      where: { id: enquiryId },
      data: { status },
    });

    return { success: true, enquiry };
  } catch (error) {
    return { success: false, error: "Failed to update lead status" };
  }
}

export async function updateEnquiryNotes(enquiryId: string, notes: string) {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");

  try {
    const enquiry = await prisma.enquiry.update({
      where: { id: enquiryId },
      data: { notes },
    });

    return { success: true, enquiry };
  } catch (error) {
    return { success: false, error: "Failed to update notes" };
  }
}

export async function deleteProduct(productId: string) {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");

  try {
    await prisma.product.delete({
      where: { id: productId },
    });

    await prisma.activityLog.create({
      data: {
        adminId: session.id,
        action: "DELETE_PRODUCT",
        details: `Deleted product ${productId}`,
      },
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete product" };
  }
}

export async function toggleProductField(productId: string, field: "isBestseller" | "isNewArrival" | "isActive", value: boolean) {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");

  try {
    const data: Record<string, boolean> = {};
    data[field] = value;

    const product = await prisma.product.update({
      where: { id: productId },
      data,
    });

    return { success: true, product };
  } catch (error) {
    return { success: false, error: "Failed to toggle product status" };
  }
}

export async function deleteCategory(categoryId: string) {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");

  try {
    await prisma.category.delete({
      where: { id: categoryId },
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete category. Ensure no products are linked." };
  }
}

export async function createCouponAction(code: string, type: string, value: number, minOrder: number) {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");

  try {
    const coupon = await prisma.coupon.create({
      data: {
        code: code.toUpperCase().trim(),
        type,
        value,
        minOrderValue: minOrder,
        isActive: true,
      },
    });

    return { success: true, coupon };
  } catch (error) {
    return { success: false, error: "Failed to create coupon. Code may already exist." };
  }
}

export async function deleteCoupon(couponId: string) {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");

  try {
    await prisma.coupon.delete({
      where: { id: couponId },
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete coupon" };
  }
}

