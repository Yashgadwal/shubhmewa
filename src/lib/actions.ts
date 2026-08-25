"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DEFAULT_SETTINGS, PRODUCTS, CATEGORIES } from "./static-data";

// In-session mutable settings configuration
let GLOBAL_CONFIG: Record<string, string> = {
  ...DEFAULT_SETTINGS,
  razorpay_active: "true",
  shiprocket_active: "true",
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

  const demoPassword = "harshiladmin";

  if ((email === "admin@harshildryfruits.com" || email === "admin@shubhmewa.com") && password === demoPassword) {
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
    const orderNumber = `SM-${Math.floor(100000 + Math.random() * 900000)}`;
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

    console.log("ShubhMewa Checkout - Generated Order:", mockOrder);
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
    console.log("ShubhMewa Proposal - Saved Enquiry:", mockEnquiry);
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
  isUrgentAvailable: boolean;
}> {
  const cleanPin = pincode.trim();
  const threshold = Number(GLOBAL_CONFIG.free_shipping_threshold || "399");
  const chargeUj = Number(GLOBAL_CONFIG.uj_delivery_charge || "40");
  const chargeMp = Number(GLOBAL_CONFIG.mp_delivery_charge || "60");
  const chargeIndia = Number(GLOBAL_CONFIG.india_delivery_charge || "90");

  if (!/^\d{6}$/.test(cleanPin)) {
    // Default to Pan-India
    return {
      shippingCharge: orderTotal >= threshold ? 0 : chargeIndia,
      deliveryType: "Pan-India Shipping",
      expectedDelivery: "4-6 days",
      isUrgentAvailable: false,
    };
  }

  if (cleanPin.startsWith("456")) {
    // Ujjain local district
    return {
      shippingCharge: orderTotal >= threshold ? 0 : chargeUj,
      deliveryType: "Ujjain Local Delivery",
      expectedDelivery: "Same-Day / Next-Day (Cutoff 5:00 PM)",
      isUrgentAvailable: true,
    };
  } else if (cleanPin.startsWith("45") || cleanPin.startsWith("46") || cleanPin.startsWith("47") || cleanPin.startsWith("48")) {
    // Madhya Pradesh state
    return {
      shippingCharge: orderTotal >= threshold ? 0 : chargeMp,
      deliveryType: "Madhya Pradesh Shipping",
      expectedDelivery: "24-48 Hours",
      isUrgentAvailable: false,
    };
  } else {
    // Other states in India
    return {
      shippingCharge: orderTotal >= threshold ? 0 : chargeIndia,
      deliveryType: "Pan-India Shipping",
      expectedDelivery: "4-6 days",
      isUrgentAvailable: false,
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
  // Demowise, any phone ending in "210" (ShubhMewa number) is eligible.
  const cleanPhone = phone.trim();
  const qualifies = cleanPhone.endsWith("8982010210") || cleanPhone.endsWith("210");
  
  return {
    success: true,
    orderCount: qualifies ? 3 : 1,
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
  console.log(`Syncing order ${orderId} with Shiprocket API`);
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
  return GLOBAL_CONFIG;
}

export async function updateWebsiteSetting(key: string, value: string) {
  GLOBAL_CONFIG[key] = value;
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
