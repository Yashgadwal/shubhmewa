import fs from "fs";
import path from "path";
import os from "os";

export interface StoredOrderItem {
  id: string;
  productId: string;
  variantId?: string | null;
  productName: string;
  weight: string;
  quantity: number;
  price: number;
}

export interface StoredOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  whatsapp: string;
  email?: string | null;
  shippingAddress: string | null;
  deliveryType: string;
  orderNotes?: string | null;
  totalAmount: number;
  orderStatus: string; // NEW, CONFIRMED, PACKED, OUT_FOR_DELIVERY, DELIVERED, CANCELLED
  paymentStatus: string; // PENDING, PAID, REFUNDED
  paymentMethod: string; // ONLINE, COD, TEST
  checkoutMethod: string; // RAZORPAY_LIVE, WEBSITE_ONLINE, WHATSAPP, SANDBOX_TEST
  paymentId?: string | null;
  razorpayOrderId?: string | null;
  internalNotes?: string | null;
  birthday?: string | null;
  anniversaryDate?: string | null;
  createdAt: string;
  updatedAt?: string;
  items: StoredOrderItem[];
}

export interface StoredEnquiry {
  id: string;
  customerName: string;
  phone: string;
  whatsapp?: string | null;
  email?: string | null;
  occasion?: string | null;
  quantity?: number | null;
  budgetPerHamper?: number | null;
  requiredDeliveryDate?: string | null;
  customizationDetails?: string | null;
  message?: string | null;
  status: string; // NEW, IN_PROGRESS, CLOSED, CANCELLED
  notes?: string | null;
  createdAt: string;
  updatedAt?: string;
}

declare global {
  var __SHUBHMEWA_ORDERS__: StoredOrder[] | undefined;
  var __SHUBHMEWA_ENQUIRIES__: StoredEnquiry[] | undefined;
}

// File paths for persistence across serverless & local environments
const TMP_ORDERS_PATH = path.join(os.tmpdir(), "shubhmewa_orders.json");
const TMP_ENQUIRIES_PATH = path.join(os.tmpdir(), "shubhmewa_enquiries.json");
const LOCAL_ORDERS_PATH = path.join(process.cwd(), "data", "orders.json");
const LOCAL_ENQUIRIES_PATH = path.join(process.cwd(), "data", "enquiries.json");

function safeReadJson<T>(filePath: string): T[] {
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      if (raw && raw.trim().length > 0) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    }
  } catch (e) {
    console.warn(`[Storage] Could not read ${filePath}:`, e);
  }
  return [];
}

function safeWriteJson<T>(filePath: string, data: T[]): void {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (e) {
    console.warn(`[Storage] Could not write ${filePath}:`, e);
  }
}

// ==========================================
// ORDERS PERSISTENCE
// ==========================================

export function getAllStoredOrders(): StoredOrder[] {
  const memOrders = globalThis.__SHUBHMEWA_ORDERS__ || [];
  const tmpOrders = safeReadJson<StoredOrder>(TMP_ORDERS_PATH);
  const localOrders = safeReadJson<StoredOrder>(LOCAL_ORDERS_PATH);

  const map = new Map<string, StoredOrder>();

  // Merge: local -> tmp -> memory (memory newest)
  [...localOrders, ...tmpOrders, ...memOrders].forEach((order) => {
    if (order && (order.orderNumber || order.id)) {
      const key = order.orderNumber || order.id;
      map.set(key, { ...map.get(key), ...order });
    }
  });

  const merged = Array.from(map.values());
  // Sort descending by date
  merged.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

  globalThis.__SHUBHMEWA_ORDERS__ = merged;
  return merged;
}

export function saveOrderToStore(order: StoredOrder): void {
  const list = getAllStoredOrders();
  const existingIdx = list.findIndex(
    (o) => o.id === order.id || o.orderNumber === order.orderNumber
  );

  if (existingIdx >= 0) {
    list[existingIdx] = { ...list[existingIdx], ...order, updatedAt: new Date().toISOString() };
  } else {
    list.unshift(order);
  }

  globalThis.__SHUBHMEWA_ORDERS__ = list;
  safeWriteJson(TMP_ORDERS_PATH, list);
  safeWriteJson(LOCAL_ORDERS_PATH, list);
}

export function updateOrderStatusInStore(orderId: string, status: string): boolean {
  const list = getAllStoredOrders();
  const order = list.find((o) => o.id === orderId || o.orderNumber === orderId);
  if (!order) return false;

  order.orderStatus = status;
  order.updatedAt = new Date().toISOString();
  saveOrderToStore(order);
  return true;
}

export function updateOrderNotesInStore(orderId: string, notes: string): boolean {
  const list = getAllStoredOrders();
  const order = list.find((o) => o.id === orderId || o.orderNumber === orderId);
  if (!order) return false;

  order.internalNotes = notes;
  order.updatedAt = new Date().toISOString();
  saveOrderToStore(order);
  return true;
}

// ==========================================
// ENQUIRIES PERSISTENCE
// ==========================================

export function getAllStoredEnquiries(): StoredEnquiry[] {
  const memEnquiries = globalThis.__SHUBHMEWA_ENQUIRIES__ || [];
  const tmpEnquiries = safeReadJson<StoredEnquiry>(TMP_ENQUIRIES_PATH);
  const localEnquiries = safeReadJson<StoredEnquiry>(LOCAL_ENQUIRIES_PATH);

  const map = new Map<string, StoredEnquiry>();

  [...localEnquiries, ...tmpEnquiries, ...memEnquiries].forEach((enq) => {
    if (enq && enq.id) {
      map.set(enq.id, { ...map.get(enq.id), ...enq });
    }
  });

  const merged = Array.from(map.values());
  merged.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

  globalThis.__SHUBHMEWA_ENQUIRIES__ = merged;
  return merged;
}

export function saveEnquiryToStore(enquiry: StoredEnquiry): void {
  const list = getAllStoredEnquiries();
  const existingIdx = list.findIndex((e) => e.id === enquiry.id);

  if (existingIdx >= 0) {
    list[existingIdx] = { ...list[existingIdx], ...enquiry, updatedAt: new Date().toISOString() };
  } else {
    list.unshift(enquiry);
  }

  globalThis.__SHUBHMEWA_ENQUIRIES__ = list;
  safeWriteJson(TMP_ENQUIRIES_PATH, list);
  safeWriteJson(LOCAL_ENQUIRIES_PATH, list);
}

export function updateEnquiryStatusInStore(enquiryId: string, status: string): boolean {
  const list = getAllStoredEnquiries();
  const enq = list.find((e) => e.id === enquiryId);
  if (!enq) return false;

  enq.status = status;
  enq.updatedAt = new Date().toISOString();
  saveEnquiryToStore(enq);
  return true;
}

export function updateEnquiryNotesInStore(enquiryId: string, notes: string): boolean {
  const list = getAllStoredEnquiries();
  const enq = list.find((e) => e.id === enquiryId);
  if (!enq) return false;

  enq.notes = notes;
  enq.updatedAt = new Date().toISOString();
  saveEnquiryToStore(enq);
  return true;
}
