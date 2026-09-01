"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DEFAULT_SETTINGS, PRODUCTS, CATEGORIES } from "./static-data";
import { prisma, isDbActive } from "./db";

// In-session mutable settings configuration
let GLOBAL_CONFIG: Record<string, string> = {
  ...DEFAULT_SETTINGS,
  razorpay_active: "true",
  shiprocket_active: "true",
  shiprocket_channel_id: "1196285411962854",
  free_shipping_threshold: "399",
  uj_delivery_charge: "40",
  mp_delivery_charge: "60",
  india_delivery_charge: "90"
};

// ==========================================
// ADMIN AUTHENTICATION ACTIONS
// ==========================================

export async function adminLogin(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Please enter both email and password." };
  }

  const demoPassword = "admindryfruit";

  if (
    (email === "admin" ||
      email === "admin@harshildryfruits.com" ||
      email === "admin@shubhmewa.com") &&
    password === demoPassword
  ) {
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
  let recentOrders = [
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

  let recentEnquiries = [
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

  let totalRevenue = 2020;
  let enquiriesCount = 2;

  if (isDbActive()) {
    try {
      const dbOrders = await prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
      });
      const dbEnquiries = await prisma.enquiry.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
      });
      const dbStats = await prisma.order.aggregate({
        _sum: { totalAmount: true },
      });
      const dbEnquiriesCount = await prisma.enquiry.count();

      if (dbOrders.length > 0) {
        recentOrders = dbOrders.map((o) => ({
          id: o.id,
          orderNumber: o.orderNumber,
          customerName: o.customerName,
          totalAmount: o.totalAmount,
          orderStatus: o.orderStatus,
          createdAt: o.createdAt.toISOString(),
        }));
      }

      if (dbEnquiries.length > 0) {
        recentEnquiries = dbEnquiries.map((e) => ({
          id: e.id,
          customerName: e.customerName,
          occasion: e.occasion || "Celebration",
          quantity: e.quantity || 1,
          status: e.status,
        }));
      }

      totalRevenue = dbStats._sum.totalAmount || 0;
      enquiriesCount = dbEnquiriesCount;
    } catch (e) {
      console.error("Postgres dashboard stats fetch failed:", e);
    }
  }

  return {
    totalRevenue,
    whatsappClicks: 42,
    enquiriesCount,
    productsCount: PRODUCTS.length,
    recentOrders,
    recentEnquiries,
  };
}

// ==========================================
// CHECKOUT & PROPOSAL GENERATION
// ==========================================

interface OrderItemInput {
  productId: string;
  variantId?: string | null;
  productName: string;
  weight: string;
  quantity: number;
  price: number;
}

export async function generateWhatsAppOrderText(order: {
  orderNumber: string;
  customerName: string;
  phone: string;
  shippingAddress: string;
  deliveryLocation?: string;
  items: OrderItemInput[];
  totalAmount: number;
  birthday?: string;
  anniversaryDate?: string;
}) {
  const itemsText = order.items
    .map((item) => `• ${item.productName} (${item.weight}) x ${item.quantity} = ₹${item.price * item.quantity}`)
    .join("\n");

  let text = `🛍️ *NEW SHUBHMEWA WEBSITE ORDER*\n`;
  text += `━━━━━━━━━━━━━━━━━━━━━━\n`;
  text += `📦 *Order Number:* ${order.orderNumber}\n`;
  text += `👤 *Customer Name:* ${order.customerName}\n`;
  text += `📱 *Phone Number:* ${order.phone}\n`;
  text += `🏙️ *Delivery Location:* ${order.deliveryLocation || "Ujjain (Local)"}\n`;
  text += `📍 *Delivery Address:* ${order.shippingAddress || "Ujjain"}\n\n`;
  text += `🛒 *Items Ordered:*\n${itemsText}\n\n`;
  text += `💰 *Grand Total:* ₹${order.totalAmount}\n`;
  text += `🚚 *Delivery Status:* Free Delivery (Ujjain)\n`;
  if (order.birthday) {
    text += `🎂 *Birthday Date:* ${order.birthday} (Surprise Gift Eligible 🎁)\n`;
  }
  if (order.anniversaryDate) {
    text += `💍 *Anniversary Date:* ${order.anniversaryDate} (Celebration Gift Eligible 🎁)\n`;
  }
  text += `━━━━━━━━━━━━━━━━━━━━━━\n`;
  text += `⚡ *Website Order Placed Successfully.*`;

  return text;
}

export async function getAdminWhatsAppUrl(order: {
  orderNumber: string;
  customerName: string;
  phone: string;
  shippingAddress: string;
  deliveryLocation?: string;
  items: OrderItemInput[];
  totalAmount: number;
  birthday?: string;
  anniversaryDate?: string;
}, adminPhone: string = "8982010210") {
  const cleanAdmin = adminPhone.replace(/\D/g, "");
  const text = await generateWhatsAppOrderText(order);
  return `https://wa.me/91${cleanAdmin}?text=${encodeURIComponent(text)}`;
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
  birthday?: string;
  anniversaryDate?: string;
}): Promise<{ success: boolean; orderNumber?: string; order?: any; error?: string; whatsAppUrl?: string }> {
  try {
    const orderNumber = `SM-${Math.floor(100000 + Math.random() * 900000)}`;
    const orderAmount = data.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    // Append birthday & anniversary into order notes for persistence
    let notes = data.orderNotes || "";
    if (data.birthday) {
      notes += ` [Birthday: ${data.birthday}]`;
    }
    if (data.anniversaryDate) {
      notes += ` [Anniversary: ${data.anniversaryDate}]`;
    }

    const whatsAppUrl = await getAdminWhatsAppUrl({
      orderNumber,
      customerName: data.customerName,
      phone: data.phone,
      shippingAddress: data.shippingAddress || "Ujjain",
      deliveryLocation: "Ujjain District",
      items: data.items,
      totalAmount: orderAmount,
      birthday: data.birthday,
      anniversaryDate: data.anniversaryDate,
    });

    if (isDbActive()) {
      const dbOrder = await prisma.order.create({
        data: {
          orderNumber,
          customerName: data.customerName,
          phone: data.phone,
          whatsapp: data.whatsapp,
          email: data.email || null,
          shippingAddress: data.shippingAddress || null,
          deliveryType: data.deliveryType,
          orderNotes: notes || null,
          totalAmount: orderAmount,
          discountAmount: 0,
          paymentMethod: "ONLINE",
          checkoutMethod: "WEBSITE_ONLINE",
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
      return { success: true, orderNumber, order: dbOrder, whatsAppUrl };
    }

    const mockOrder = {
      id: `ord-${Math.floor(1000 + Math.random() * 9000)}`,
      orderNumber,
      customerName: data.customerName,
      phone: data.phone,
      whatsapp: data.whatsapp,
      email: data.email || null,
      shippingAddress: data.shippingAddress || null,
      deliveryType: data.deliveryType,
      orderNotes: notes || null,
      birthday: data.birthday || null,
      anniversaryDate: data.anniversaryDate || null,
      totalAmount: orderAmount,
      orderStatus: "NEW",
      createdAt: new Date().toISOString(),
      items: data.items,
    };

    console.log("ShubhMewa Checkout - Generated Order (Memory):", mockOrder);
    return { success: true, orderNumber, order: mockOrder, whatsAppUrl };
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
    if (isDbActive()) {
      const dbEnquiry = await prisma.enquiry.create({
        data: {
          customerName: data.customerName,
          phone: data.phone,
          whatsapp: data.whatsapp || null,
          email: data.email || null,
          occasion: data.occasion || null,
          quantity: data.quantity || null,
          budgetPerHamper: data.budgetPerHamper || null,
          requiredDeliveryDate: data.requiredDeliveryDate ? new Date(data.requiredDeliveryDate) : null,
          customizationDetails: data.customizationDetails || null,
          message: data.message || null,
          status: "NEW",
        },
      });
      return { success: true, enquiry: dbEnquiry };
    }

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
    console.log("ShubhMewa Proposal - Saved Enquiry (Memory):", mockEnquiry);
    return { success: true, enquiry: mockEnquiry };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to submit enquiry." };
  }
}

// ==========================================
// LOCATION BASED SHIPPING CALCULATOR
// ==========================================

export async function calculateShippingCharge(pincode: string, orderTotal: number): Promise<{
  shippingCharge: number;
  deliveryType: string;
  expectedDelivery: string;
  isDeliverable: boolean;
  isUrgentAvailable: boolean;
  message: string;
  futureNotice?: string;
}> {
  const cleanPin = pincode.trim().replace(/\D/g, "");
  const thresholdUj = 399; // Ujjain Free delivery threshold
  const chargeUj = 40; // Ujjain standard delivery charge
  const thresholdOutside = 599; // Outside Ujjain free shipping threshold
  const chargeOutside = 90; // Outside Ujjain standard shipping

  if (!cleanPin || cleanPin.length !== 6) {
    return {
      shippingCharge: orderTotal >= thresholdUj ? 0 : chargeUj,
      deliveryType: "Ujjain Local Delivery",
      expectedDelivery: "Same-Day / 24 Hours",
      isDeliverable: true,
      isUrgentAvailable: true,
      message: "Enter 6-digit Ujjain Pincode (Free Delivery over ₹399)",
    };
  }

  // Month 1 rule: Ujjain District Only (starts with 456)
  if (cleanPin.startsWith("456")) {
    return {
      shippingCharge: orderTotal >= thresholdUj ? 0 : chargeUj,
      deliveryType: "Ujjain Local Delivery",
      expectedDelivery: "Same-Day / Next-Day (Within 24 Hours)",
      isDeliverable: true,
      isUrgentAvailable: true,
      message: orderTotal >= thresholdUj 
        ? "✅ Free Delivery available in Ujjain!" 
        : `✅ Delivery available in Ujjain (Add ₹${Math.max(0, thresholdUj - orderTotal)} more for FREE Delivery).`,
    };
  } else {
    // Outside Ujjain: Not deliverable during Month 1
    return {
      shippingCharge: orderTotal >= thresholdOutside ? 0 : chargeOutside,
      deliveryType: "Outside Ujjain (Coming Soon)",
      expectedDelivery: "48–72 Hours (Starting within 2 months)",
      isDeliverable: false,
      isUrgentAvailable: false,
      message: "Currently, we are delivering only in Ujjain. We will start accepting orders from your location next month.",
      futureNotice: "Outside Ujjain District delivery will start within 2 months with ₹599 Free Shipping & 48–72 hours delivery.",
    };
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

  // Custom static coupons supporting WELCOME5 and loyalty lifetime LIFETIME5
  const staticCoupons = [
    { code: "WELCOME5", type: "PERCENTAGE", value: 5, minOrderValue: 0 },
    { code: "WELCOME10", type: "PERCENTAGE", value: 10, minOrderValue: 500 },
    { code: "SHUBH15", type: "PERCENTAGE", value: 15, minOrderValue: 999 },
    { code: "LIFETIME5", type: "PERCENTAGE", value: 5, minOrderValue: 0 }
  ];

  const coupon = staticCoupons.find((c) => c.code === upperCode);

  if (!coupon) {
    return { valid: false, error: "Invalid coupon code." };
  }

  if (subtotal < coupon.minOrderValue) {
    return { valid: false, error: `Minimum purchase of ₹${coupon.minOrderValue} required.` };
  }

  const discountAmount = Math.round((subtotal * coupon.value) / 100);

  return {
    valid: true,
    discount: discountAmount,
    discountAmount,
    couponId: coupon.code,
  };
}

// ==========================================
// LOYALTY REWARDS SYSTEM
// ==========================================

export async function getLoyaltyStatus(phone: string) {
  // Checks if customer qualifying: 3 orders within 1 month.
  const cleanPhone = phone.trim();
  let orderCount = cleanPhone.endsWith("8982010210") || cleanPhone.endsWith("210") ? 3 : 1;

  if (isDbActive()) {
    try {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      orderCount = await prisma.order.count({
        where: {
          phone: cleanPhone,
          createdAt: { gte: oneMonthAgo },
        },
      });
    } catch (e) {
      console.error("Postgres order count failed for loyalty status:", e);
    }
  }

  const qualifies = orderCount >= 3;
  
  return {
    success: true,
    orderCount,
    eligible: qualifies,
    couponCode: qualifies ? "LIFETIME5" : null,
    discountPercent: 5,
    message: qualifies 
      ? "Lifetime 5% coupon active! (Subject to active monthly use review)"
      : "Place 3 orders in 1 month to earn lifetime 5% off."
  };
}

// ==========================================
// SHIPROCKET INTEGRATION SIMULATION
// ==========================================

export async function syncOrderToShiprocket(orderId: string) {
  console.log(`Syncing order ${orderId} with Shiprocket API (Account ID: ${GLOBAL_CONFIG.shiprocket_channel_id || "1196285411962854"})`);
  return {
    success: true,
    shipmentId: `sr-${Math.floor(100000 + Math.random() * 900000)}`,
    trackingId: `SRT${Math.floor(100000000 + Math.random() * 900000000)}`,
    courierName: "Delhivery (Express)",
    status: "DISPATCHED",
    eta: "4 Days"
  };
}

// ==========================================
// CMS WEBSITE CONFIGURATIONS
// ==========================================

export async function getPublicSettings() {
  if (isDbActive()) {
    try {
      const dbSettings = await prisma.websiteSetting.findMany();
      const settingsMap = { ...GLOBAL_CONFIG };
      dbSettings.forEach((s) => {
        settingsMap[s.key] = s.value;
      });
      return settingsMap;
    } catch (e) {
      console.error("Postgres settings fetch error, fallback to in-memory:", e);
      return GLOBAL_CONFIG;
    }
  }
  return GLOBAL_CONFIG;
}

export async function updateWebsiteSetting(key: string, value: string) {
  GLOBAL_CONFIG[key] = value;
  if (isDbActive()) {
    try {
      await prisma.websiteSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      });
    } catch (e) {
      console.error("Postgres settings update error:", e);
    }
  }
  console.log(`Setting updated: ${key} -> ${value}`);
  return { success: true };
}

// ==========================================
// ADMIN DASHBOARD CRUDS (MOCKS & PERSISTENCE)
// ==========================================

export async function updateOrderStatus(orderId: string, status: string): Promise<{ success: boolean; order?: any; error?: string }> {
  if (isDbActive()) {
    try {
      const order = await prisma.order.update({
        where: { id: orderId },
        data: { orderStatus: status },
      });
      return { success: true, order };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }
  return { success: true, order: { id: orderId, orderStatus: status } };
}

export async function updateOrderInternalNotes(orderId: string, notes: string): Promise<{ success: boolean; order?: any; error?: string }> {
  if (isDbActive()) {
    try {
      const order = await prisma.order.update({
        where: { id: orderId },
        data: { internalNotes: notes },
      });
      return { success: true, order };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }
  return { success: true, order: { id: orderId, internalNotes: notes } };
}

export async function updateEnquiryStatus(enquiryId: string, status: string): Promise<{ success: boolean; enquiry?: any; error?: string }> {
  if (isDbActive()) {
    try {
      const enquiry = await prisma.enquiry.update({
        where: { id: enquiryId },
        data: { status },
      });
      return { success: true, enquiry };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }
  return { success: true, enquiry: { id: enquiryId, status } };
}

export async function updateEnquiryNotes(enquiryId: string, notes: string): Promise<{ success: boolean; enquiry?: any; error?: string }> {
  if (isDbActive()) {
    try {
      const enquiry = await prisma.enquiry.update({
        where: { id: enquiryId },
        data: { notes },
      });
      return { success: true, enquiry };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }
  return { success: true, enquiry: { id: enquiryId, notes } };
}

export async function deleteProduct(productId: string): Promise<{ success: boolean; error?: string }> {
  if (isDbActive()) {
    try {
      await prisma.product.delete({
        where: { id: productId },
      });
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }
  return { success: true };
}

export async function toggleProductField(
  productId: string,
  field: "isBestseller" | "isNewArrival" | "isActive",
  value: boolean
): Promise<{ success: boolean; product?: any; error?: string }> {
  if (isDbActive()) {
    try {
      const product = await prisma.product.update({
        where: { id: productId },
        data: { [field]: value },
      });
      return { success: true, product };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }
  const mockProduct = { id: productId, [field]: value };
  return { success: true, product: mockProduct };
}

export async function deleteCategory(categoryId: string): Promise<{ success: boolean; error?: string }> {
  if (isDbActive()) {
    try {
      await prisma.category.delete({
        where: { id: categoryId },
      });
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }
  return { success: true };
}

export async function createCouponAction(
  code: string,
  type: string,
  value: number,
  minOrder: number
): Promise<{ success: boolean; coupon?: any; error?: string }> {
  if (isDbActive()) {
    try {
      const coupon = await prisma.coupon.create({
        data: {
          code: code.toUpperCase().trim(),
          type,
          value,
          minOrderValue: minOrder,
        },
      });
      return { success: true, coupon };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }
  return {
    success: true,
    coupon: { id: `cp-${code}`, code, type, value, minOrderValue: minOrder, usageCount: 0, isActive: true },
  };
}

export async function deleteCoupon(couponId: string): Promise<{ success: boolean; error?: string }> {
  if (isDbActive()) {
    try {
      await prisma.coupon.delete({
        where: { id: couponId },
      });
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }
  return { success: true };
}

export async function createContactSubmission(data: {
  name: string;
  email: string;
  phone: string;
  subject?: string;
  message: string;
}): Promise<{ success: boolean; error?: string }> {
  console.log("Database Contact Submission:", data);
  if (isDbActive()) {
    try {
      await prisma.contactSubmission.create({
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          subject: data.subject || null,
          message: data.message,
        },
      });
    } catch (e: any) {
      console.error("Postgres contact submission fail:", e);
      return { success: false, error: e.message };
    }
  }
  return { success: true };
}

export async function trackOrderOrEnquiry(query: string) {
  const cleanQuery = query.trim().toUpperCase();
  if (!cleanQuery) return { error: "Please enter an order or phone number." };

  if (isDbActive()) {
    try {
      const order = await prisma.order.findFirst({
        where: {
          OR: [
            { orderNumber: cleanQuery },
            { phone: cleanQuery },
            { whatsapp: cleanQuery }
          ]
        },
        include: {
          items: true
        }
      });
      if (order) {
        return {
          success: true,
          type: "ORDER",
          details: {
            orderNumber: order.orderNumber,
            customerName: order.customerName,
            totalAmount: order.totalAmount,
            orderStatus: order.orderStatus,
            deliveryType: order.deliveryType,
            shippingAddress: order.shippingAddress,
            createdAt: order.createdAt.toISOString(),
            items: order.items.map((item) => ({
              productName: item.productName,
              weight: item.weight,
              quantity: item.quantity,
              price: item.price
            })),
            timeline: [
              { status: "NEW", title: "Order Placed", date: order.createdAt.toISOString(), description: "Your order has been received and is pending confirmation." },
              { status: "CONFIRMED", title: "Confirmed", date: order.updatedAt.toISOString(), description: "Our boutique store has accepted your order." }
            ]
          }
        };
      }
    } catch (e) {
      console.error("Postgres tracking fetch error:", e);
    }
  }

  return {
    success: true,
    type: "ORDER",
    details: {
      orderNumber: cleanQuery.startsWith("ORD") ? cleanQuery : "SM-2026-1001",
      customerName: "Valued Customer",
      totalAmount: 1240,
      orderStatus: "OUT_FOR_DELIVERY",
      deliveryType: "DELIVERY",
      shippingAddress: "Shop No. 5, Fawara Chowk, Daulat Ganj, Ujjain",
      createdAt: new Date().toISOString(),
      items: [
        { productName: "California Jumbo Almonds (Badam)", weight: "500g", quantity: 2, price: 500 }
      ],
      timeline: [
        { status: "NEW", title: "Order Placed", date: new Date().toISOString(), description: "Your order has been received and is pending confirmation." },
        { status: "CONFIRMED", title: "Confirmed", date: new Date().toISOString(), description: "Our boutique store has accepted your order." },
        { status: "PACKED", title: "Packed & Sealed", date: new Date().toISOString(), description: "Items have been hand-sorted and vacuum-packed." },
        { status: "OUT_FOR_DELIVERY", title: "Out for Delivery", date: new Date().toISOString(), description: "Our delivery partner is on the way to Fawara Chowk." }
      ]
    }
  };
}

// ==========================================
// RAZORPAY SERVER ACTIONS
// ==========================================

export async function createRazorpayOrderAction(amount: number) {
  try {
    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (keyId && keySecret) {
      const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
      const res = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${auth}`,
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // in paise
          currency: "INR",
          receipt: `rcpt_${Date.now()}`,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Razorpay API error: ${errText}`);
      }

      const orderData = await res.json();
      return { success: true, orderId: orderData.id };
    }

    const orderId = `order_${Math.random().toString(36).substring(2, 16)}`;
    return { success: true, orderId };
  } catch (e: any) {
    console.error("createRazorpayOrderAction error:", e);
    return { success: false, error: e.message };
  }
}

export async function verifyRazorpayPaymentAction(
  paymentId: string,
  orderId: string,
  signature: string
) {
  try {
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (secret) {
      const crypto = await import("crypto");
      const expected = crypto
        .createHmac("sha256", secret)
        .update(`${orderId}|${paymentId}`)
        .digest("hex");
      if (expected !== signature) {
        return { success: false, error: "Payment verification failed: Signature mismatch." };
      }
    }
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}
