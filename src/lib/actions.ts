"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DEFAULT_SETTINGS, PRODUCTS, CATEGORIES } from "./static-data";

// ==========================================
// ADMIN AUTHENTICATION ACTIONS
// ==========================================

export async function adminLogin(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Please enter both email and password." };
  }

  const demoEmail = "admin@harshildryfruits.com";
  const demoPassword = "harshiladmin";

  if (email === demoEmail && password === demoPassword) {
    const cookieStore = await cookies();
    cookieStore.set("admin_session", email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    redirect("/admin/dashboard");
  }

  return { error: "Invalid email or password." };
}

export async function adminLogout() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  redirect("/admin/login");
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("admin_session");

  if (!sessionCookie) return null;

  return {
    id: "admin-1",
    email: sessionCookie.value,
    name: "Administrator",
    role: "ADMIN",
  };
}

// ==========================================
// ADMIN DASHBOARD STATS
// ==========================================

export async function getDashboardStats() {
  const recentOrders = [
    {
      id: "ord-1",
      orderNumber: "ORD-2026-1001",
      customerName: "Aman Agrawal",
      totalAmount: 1240,
      orderStatus: "NEW",
      createdAt: new Date().toISOString(),
    },
    {
      id: "ord-2",
      orderNumber: "ORD-2026-1002",
      customerName: "Megha Vyas",
      totalAmount: 780,
      orderStatus: "PACKED",
      createdAt: new Date().toISOString(),
    },
  ];

  const recentEnquiries = [
    {
      id: "enq-1",
      customerName: "Nisha Garg (Nexora Group)",
      occasion: "Corporate Gifting",
      quantity: 50,
      status: "NEW",
    },
    {
      id: "enq-2",
      customerName: "Rahul Sethi",
      occasion: "Wedding Invites",
      quantity: 120,
      status: "IN_PROGRESS",
    },
  ];

  return {
    totalRevenue: 2020,
    whatsappClicks: 42,
    enquiriesCount: 2,
    productsCount: PRODUCTS.length,
    recentOrders,
    recentEnquiries,
  };
}

// ==========================================
// CHECKOUT & PROPOSAL GENERATION
// ==========================================

interface OrderItemInput {
  productName: string;
  weight: string;
  quantity: number;
  price: number;
}

export async function createOrder(data: {
  customerName: string;
  phone: string;
  whatsapp: string;
  email?: string;
  shippingAddress?: string;
  deliveryType: string;
  orderNotes?: string;
  items: OrderItemInput[];
  couponCode?: string;
}): Promise<{ success: boolean; orderNumber?: string; order?: any; error?: string }> {
  try {
    const orderNumber = `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const orderAmount = data.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    const mockOrder = {
      id: `ord-${Math.floor(1000 + Math.random() * 9000)}`,
      orderNumber,
      customerName: data.customerName,
      phone: data.phone,
      whatsapp: data.whatsapp,
      email: data.email || null,
      shippingAddress: data.shippingAddress || null,
      deliveryType: data.deliveryType,
      orderNotes: data.orderNotes || null,
      totalAmount: orderAmount,
      orderStatus: "NEW",
      createdAt: new Date().toISOString(),
      items: data.items,
    };

    console.log("Database-Free Checkout - Generated Order:", mockOrder);
    return { success: true, orderNumber, order: mockOrder };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to place order." };
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
}): Promise<{ success: boolean; enquiry?: any; error?: string }> {
  try {
    const mockEnquiry = {
      id: `enq-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: data.customerName,
      phone: data.phone,
      whatsapp: data.whatsapp,
      email: data.email || null,
      occasion: data.occasion || null,
      quantity: data.quantity || null,
      budgetPerHamper: data.budgetPerHamper || null,
      requiredDeliveryDate: data.requiredDeliveryDate || null,
      customizationDetails: data.customizationDetails || null,
      message: data.message || null,
      status: "NEW",
      createdAt: new Date().toISOString(),
    };
    console.log("Database-Free Proposal - Saved Enquiry:", mockEnquiry);
    return { success: true, enquiry: mockEnquiry };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to submit enquiry." };
  }
}

// ==========================================
// COUPON VALIDATIONS
// ==========================================

export async function validateCouponCode(
  code: string,
  subtotal: number
): Promise<{ valid: boolean; discount?: number; discountAmount?: number; couponId?: string; error?: string }> {
  const upperCode = code.toUpperCase().trim();

  const staticCoupons = [
    { code: "WELCOME10", type: "PERCENTAGE", value: 10, minOrderValue: 500 },
    { code: "SHUBH15", type: "PERCENTAGE", value: 15, minOrderValue: 999 },
    { code: "MEWA100", type: "FIXED", value: 100, minOrderValue: 750 },
  ];

  const coupon = staticCoupons.find((c) => c.code === upperCode);

  if (!coupon) {
    return { valid: false, error: "Invalid coupon code." };
  }

  if (subtotal < coupon.minOrderValue) {
    return { valid: false, error: `Minimum purchase of ₹${coupon.minOrderValue} required.` };
  }

  let discountAmount = 0;
  if (coupon.type === "PERCENTAGE") {
    discountAmount = Math.round((subtotal * coupon.value) / 100);
  } else {
    discountAmount = coupon.value;
  }

  return {
    valid: true,
    discount: discountAmount,
    discountAmount,
    couponId: coupon.code,
  };
}

// ==========================================
// CMS WEBSITE CONFIGURATIONS
// ==========================================

export async function getPublicSettings() {
  return DEFAULT_SETTINGS;
}

export async function updateWebsiteSetting(key: string, value: string) {
  console.log(`Setting updated in memory: ${key} -> ${value}`);
  return { success: true };
}

// ==========================================
// ADMIN DASHBOARD CRUDS (MOCKS WITH FULL TYPES)
// ==========================================

export async function updateOrderStatus(orderId: string, status: string): Promise<{ success: boolean; order?: any; error?: string }> {
  return { success: true, order: { id: orderId, orderStatus: status } };
}

export async function updateOrderInternalNotes(orderId: string, notes: string): Promise<{ success: boolean; order?: any; error?: string }> {
  return { success: true, order: { id: orderId, internalNotes: notes } };
}

export async function updateEnquiryStatus(enquiryId: string, status: string): Promise<{ success: boolean; enquiry?: any; error?: string }> {
  return { success: true, enquiry: { id: enquiryId, status } };
}

export async function updateEnquiryNotes(enquiryId: string, notes: string): Promise<{ success: boolean; enquiry?: any; error?: string }> {
  return { success: true, enquiry: { id: enquiryId, notes } };
}

export async function deleteProduct(productId: string): Promise<{ success: boolean; error?: string }> {
  return { success: true };
}

export async function toggleProductField(
  productId: string,
  field: "isBestseller" | "isNewArrival" | "isActive",
  value: boolean
): Promise<{ success: boolean; product?: any; error?: string }> {
  const mockProduct = { id: productId, [field]: value };
  return { success: true, product: mockProduct };
}

export async function deleteCategory(categoryId: string): Promise<{ success: boolean; error?: string }> {
  return { success: true };
}

export async function createCouponAction(
  code: string,
  type: string,
  value: number,
  minOrder: number
): Promise<{ success: boolean; coupon?: any; error?: string }> {
  return {
    success: true,
    coupon: { id: `cp-${code}`, code, type, value, minOrderValue: minOrder, usageCount: 0, isActive: true },
  };
}

export async function deleteCoupon(couponId: string): Promise<{ success: boolean; error?: string }> {
  return { success: true };
}

export async function createContactSubmission(data: {
  name: string;
  email: string;
  phone: string;
  subject?: string;
  message: string;
}): Promise<{ success: boolean; error?: string }> {
  console.log("Database-Free Contact Submission:", data);
  return { success: true };
}

export async function trackOrderOrEnquiry(query: string) {
  const cleanQuery = query.trim().toUpperCase();
  if (!cleanQuery) return { error: "Please enter an order or phone number." };

  return {
    success: true,
    type: "ORDER",
    details: {
      orderNumber: cleanQuery.startsWith("ORD") ? cleanQuery : "ORD-2026-1001",
      customerName: "Valued Customer",
      totalAmount: 1240,
      orderStatus: "OUT_FOR_DELIVERY",
      deliveryType: "DELIVERY",
      shippingAddress: "55, Freeganj Main Road, Ujjain",
      createdAt: new Date().toISOString(),
      items: [
        { productName: "California Jumbo Almonds (Badam)", weight: "500g", quantity: 2, price: 500 }
      ],
      timeline: [
        { status: "NEW", title: "Order Placed", date: new Date().toISOString(), description: "Your order has been received and is pending confirmation." },
        { status: "CONFIRMED", title: "Confirmed", date: new Date().toISOString(), description: "Our boutique store has accepted your order." },
        { status: "PACKED", title: "Packed & Sealed", date: new Date().toISOString(), description: "Items have been hand-sorted and vacuum-packed." },
        { status: "OUT_FOR_DELIVERY", title: "Out for Delivery", date: new Date().toISOString(), description: "Our delivery partner is on the way to Freeganj." }
      ]
    }
  };
}
