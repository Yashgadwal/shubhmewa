"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DEFAULT_SETTINGS, PRODUCTS, CATEGORIES } from "./static-data";
import { prisma, isDbActive } from "./db";
import {
  getAllStoredOrders,
  saveOrderToStore,
  updateOrderStatusInStore,
  updateOrderNotesInStore,
  getAllStoredEnquiries,
  saveEnquiryToStore,
  updateEnquiryStatusInStore,
  updateEnquiryNotesInStore,
  StoredOrder,
  StoredEnquiry,
} from "./order-storage";

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
// ADMIN DASHBOARD STATS & ORDERS RETRIEVAL
// ==========================================

export async function getAdminOrders(): Promise<any[]> {
  let dbOrders: any[] = [];
  if (isDbActive()) {
    try {
      const list = await prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        include: { items: true },
      });
      dbOrders = list.map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        customerName: o.customerName,
        phone: o.phone,
        whatsapp: o.whatsapp,
        shippingAddress: o.shippingAddress,
        deliveryType: o.deliveryType,
        orderNotes: o.orderNotes,
        totalAmount: o.totalAmount,
        orderStatus: o.orderStatus,
        paymentStatus: o.paymentStatus,
        paymentMethod: o.paymentMethod,
        checkoutMethod: o.checkoutMethod,
        internalNotes: o.internalNotes,
        createdAt: o.createdAt.toISOString(),
        items: o.items.map((i) => ({
          id: i.id,
          productId: i.productId,
          productName: i.productName,
          weight: i.weight,
          quantity: i.quantity,
          price: i.price,
        })),
      }));
    } catch (e) {
      console.error("Prisma getAdminOrders failed:", e);
    }
  }

  const storedOrders = getAllStoredOrders();

  // Combine & deduplicate by orderNumber or id
  const map = new Map<string, any>();
  [...storedOrders, ...dbOrders].forEach((o) => {
    if (o && (o.orderNumber || o.id)) {
      map.set(o.orderNumber || o.id, o);
    }
  });

  const all = Array.from(map.values());
  all.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  return all;
}

export async function getAdminEnquiries(): Promise<any[]> {
  let dbEnquiries: any[] = [];
  if (isDbActive()) {
    try {
      const list = await prisma.enquiry.findMany({
        orderBy: { createdAt: "desc" },
      });
      dbEnquiries = list.map((e) => ({
        id: e.id,
        customerName: e.customerName,
        phone: e.phone,
        whatsapp: e.whatsapp,
        email: e.email,
        occasion: e.occasion,
        quantity: e.quantity,
        budgetPerHamper: e.budgetPerHamper,
        requiredDeliveryDate: e.requiredDeliveryDate ? e.requiredDeliveryDate.toISOString() : null,
        customizationDetails: e.customizationDetails,
        message: e.message,
        status: e.status,
        notes: e.notes,
        createdAt: e.createdAt.toISOString(),
      }));
    } catch (e) {
      console.error("Prisma getAdminEnquiries failed:", e);
    }
  }

  const stored = getAllStoredEnquiries();
  const map = new Map<string, any>();
  [...stored, ...dbEnquiries].forEach((e) => {
    if (e && e.id) map.set(e.id, e);
  });

  const all = Array.from(map.values());
  all.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  return all;
}

export async function getDashboardStats() {
  const orders = await getAdminOrders();
  const enquiries = await getAdminEnquiries();

  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);

  return {
    totalRevenue,
    whatsappClicks: 0,
    enquiriesCount: enquiries.length,
    productsCount: PRODUCTS.length,
    recentOrders: orders.slice(0, 5),
    recentEnquiries: enquiries.slice(0, 5),
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
  totalAmount?: number;
  paymentMethod?: string;
  paymentStatus?: string;
  checkoutMethod?: string;
  paymentId?: string;
  razorpayOrderId?: string;
}): Promise<{ success: boolean; orderNumber?: string; order?: any; error?: string; whatsAppUrl?: string }> {
  try {
    const orderNumber = `SM-${Math.floor(100000 + Math.random() * 900000)}`;
    const calculatedAmount = data.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const finalTotal = data.totalAmount !== undefined ? data.totalAmount : calculatedAmount;
    
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
      totalAmount: finalTotal,
      birthday: data.birthday,
      anniversaryDate: data.anniversaryDate,
    });

    const orderRecord: StoredOrder = {
      id: `ord-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      orderNumber,
      customerName: data.customerName,
      phone: data.phone,
      whatsapp: data.whatsapp || data.phone,
      email: data.email || null,
      shippingAddress: data.shippingAddress || null,
      deliveryType: data.deliveryType,
      orderNotes: notes || null,
      totalAmount: finalTotal,
      orderStatus: "NEW",
      paymentStatus: data.paymentStatus || "PAID",
      paymentMethod: data.paymentMethod || "ONLINE",
      checkoutMethod: data.checkoutMethod || "RAZORPAY_LIVE",
      paymentId: data.paymentId || null,
      razorpayOrderId: data.razorpayOrderId || null,
      internalNotes: null,
      birthday: data.birthday || null,
      anniversaryDate: data.anniversaryDate || null,
      createdAt: new Date().toISOString(),
      items: data.items.map((item, idx) => ({
        id: `itm-${Date.now()}-${idx}`,
        productId: item.productId,
        variantId: item.variantId || null,
        productName: item.productName,
        weight: item.weight,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    // ALWAYS persist order to store (file and memory)
    saveOrderToStore(orderRecord);

    if (isDbActive()) {
      try {
        await prisma.order.create({
          data: {
            orderNumber,
            customerName: data.customerName,
            phone: data.phone,
            whatsapp: data.whatsapp,
            email: data.email || null,
            shippingAddress: data.shippingAddress || null,
            deliveryType: data.deliveryType,
            orderNotes: notes || null,
            totalAmount: finalTotal,
            discountAmount: 0,
            paymentStatus: data.paymentStatus || "PAID",
            paymentMethod: data.paymentMethod || "ONLINE",
            checkoutMethod: data.checkoutMethod || "RAZORPAY_LIVE",
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
      } catch (dbErr) {
        console.error("Prisma order.create failed, order preserved in storage:", dbErr);
      }
    }

    return { success: true, orderNumber, order: orderRecord, whatsAppUrl };
  } catch (error: any) {
    console.error("createOrder error:", error);
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
    const enquiryRecord: StoredEnquiry = {
      id: `enq-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      customerName: data.customerName,
      phone: data.phone,
      whatsapp: data.whatsapp || null,
      email: data.email || null,
      occasion: data.occasion || null,
      quantity: data.quantity || null,
      budgetPerHamper: data.budgetPerHamper || null,
      requiredDeliveryDate: data.requiredDeliveryDate || null,
      customizationDetails: data.customizationDetails || null,
      message: data.message || null,
      status: "NEW",
      notes: null,
      createdAt: new Date().toISOString(),
    };

    // ALWAYS persist enquiry to store
    saveEnquiryToStore(enquiryRecord);

    if (isDbActive()) {
      try {
        await prisma.enquiry.create({
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
      } catch (dbErr) {
        console.error("Prisma enquiry.create failed, enquiry preserved in storage:", dbErr);
      }
    }

    return { success: true, enquiry: enquiryRecord };
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
  updateOrderStatusInStore(orderId, status);
  if (isDbActive()) {
    try {
      const order = await prisma.order.update({
        where: { id: orderId },
        data: { orderStatus: status },
      });
      return { success: true, order };
    } catch (e: any) {
      console.error("Prisma updateOrderStatus error:", e);
    }
  }
  return { success: true, order: { id: orderId, orderStatus: status } };
}

export async function updateOrderInternalNotes(orderId: string, notes: string): Promise<{ success: boolean; order?: any; error?: string }> {
  updateOrderNotesInStore(orderId, notes);
  if (isDbActive()) {
    try {
      const order = await prisma.order.update({
        where: { id: orderId },
        data: { internalNotes: notes },
      });
      return { success: true, order };
    } catch (e: any) {
      console.error("Prisma updateOrderInternalNotes error:", e);
    }
  }
  return { success: true, order: { id: orderId, internalNotes: notes } };
}

export async function updateEnquiryStatus(enquiryId: string, status: string): Promise<{ success: boolean; enquiry?: any; error?: string }> {
  updateEnquiryStatusInStore(enquiryId, status);
  if (isDbActive()) {
    try {
      const enquiry = await prisma.enquiry.update({
        where: { id: enquiryId },
        data: { status },
      });
      return { success: true, enquiry };
    } catch (e: any) {
      console.error("Prisma updateEnquiryStatus error:", e);
    }
  }
  return { success: true, enquiry: { id: enquiryId, status } };
}

export async function updateEnquiryNotes(enquiryId: string, notes: string): Promise<{ success: boolean; enquiry?: any; error?: string }> {
  updateEnquiryNotesInStore(enquiryId, notes);
  if (isDbActive()) {
    try {
      const enquiry = await prisma.enquiry.update({
        where: { id: enquiryId },
        data: { notes },
      });
      return { success: true, enquiry };
    } catch (e: any) {
      console.error("Prisma updateEnquiryNotes error:", e);
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

  // Look in stored orders (local disk, /tmp, or memory)
  const storedOrders = getAllStoredOrders();
  const digitsOnly = cleanQuery.replace(/\D/g, "");
  const matched = storedOrders.find((o) => {
    if (!o) return false;
    if (o.orderNumber && o.orderNumber.toUpperCase() === cleanQuery) return true;
    if (o.id && o.id.toUpperCase() === cleanQuery) return true;
    if (digitsOnly.length >= 6) {
      const orderPhoneDigits = (o.phone || "").replace(/\D/g, "");
      const orderWaDigits = (o.whatsapp || "").replace(/\D/g, "");
      if (orderPhoneDigits.includes(digitsOnly) || digitsOnly.includes(orderPhoneDigits)) return true;
      if (orderWaDigits.includes(digitsOnly) || digitsOnly.includes(orderWaDigits)) return true;
    }
    return false;
  });

  if (matched) {
    const timeline = [
      {
        status: "NEW",
        title: "Order Placed",
        date: matched.createdAt,
        description: "Your order has been received and confirmed.",
      },
    ];

    if (matched.orderStatus === "PACKED") {
      timeline.push({
        status: "PACKED",
        title: "Packed & Sealed",
        date: matched.createdAt,
        description: "Items have been hand-sorted and sealed in fresh food-grade packaging.",
      });
    } else if (matched.orderStatus === "OUT_FOR_DELIVERY") {
      timeline.push(
        {
          status: "PACKED",
          title: "Packed & Sealed",
          date: matched.createdAt,
          description: "Items have been hand-sorted and sealed in fresh food-grade packaging.",
        },
        {
          status: "OUT_FOR_DELIVERY",
          title: "Out for Delivery",
          date: matched.createdAt,
          description: "Our delivery partner is out for delivery to your address.",
        }
      );
    } else if (matched.orderStatus === "DELIVERED") {
      timeline.push(
        {
          status: "PACKED",
          title: "Packed & Sealed",
          date: matched.createdAt,
          description: "Items have been hand-sorted and sealed in fresh food-grade packaging.",
        },
        {
          status: "DELIVERED",
          title: "Delivered",
          date: matched.createdAt,
          description: "Package successfully delivered to customer.",
        }
      );
    }

    return {
      success: true,
      type: "ORDER",
      details: {
        orderNumber: matched.orderNumber,
        customerName: matched.customerName,
        totalAmount: matched.totalAmount,
        orderStatus: matched.orderStatus,
        deliveryType: matched.deliveryType || "DELIVERY",
        shippingAddress: matched.shippingAddress || "Shop No. 5, Fawara Chowk, Daulat Ganj, Ujjain",
        createdAt: matched.createdAt,
        items: (matched.items || []).map((item) => ({
          productName: item.productName,
          weight: item.weight,
          quantity: item.quantity,
          price: item.price,
        })),
        timeline,
      },
    };
  }

  return {
    error: `No active order found with tracking number or phone: ${query}`,
  };
}

// ==========================================
// RAZORPAY SERVER ACTIONS
// ==========================================

const RAZORPAY_CONFIG = {
  keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || "rzp_live_U0MVQTSw8kIXiY",
  keySecret: process.env.RAZORPAY_KEY_SECRET || "boHcyWxmrlUTYn8PDnOBpltC",
};

export async function createRazorpayOrderAction(amount: number) {
  try {
    const { keyId, keySecret } = RAZORPAY_CONFIG;

    if (!keyId || !keySecret) {
      throw new Error("Razorpay credentials are not configured.");
    }

    const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
    // Ensure amount is in integer paise and at least ₹1 (100 paise)
    const amountInPaise = Math.max(100, Math.round(amount * 100));

    const res = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency: "INR",
        receipt: `rcpt_${Date.now()}`,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Razorpay API error (${res.status}): ${errText}`);
    }

    const orderData = await res.json();
    return { 
      success: true, 
      orderId: orderData.id, 
      amount: orderData.amount, 
      currency: orderData.currency 
    };
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
    const { keySecret } = RAZORPAY_CONFIG;
    if (keySecret) {
      const crypto = await import("crypto");
      const expected = crypto
        .createHmac("sha256", keySecret)
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
