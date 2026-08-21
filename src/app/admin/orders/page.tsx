import React from "react";
import OrdersManager from "@/components/OrdersManager";

export const revalidate = 0; // Dynamic server-side rendering

export default async function AdminOrdersPage() {
  const orders = [
    {
      id: "ord-1",
      orderNumber: "ORD-2026-1001",
      customerName: "Aman Agrawal",
      phone: "919876543210",
      whatsapp: "919876543210",
      shippingAddress: "12, Freeganj Main Road, Ujjain",
      deliveryType: "DELIVERY",
      orderNotes: "Deliver after 5 PM",
      totalAmount: 1240,
      orderStatus: "NEW",
      paymentStatus: "PENDING",
      checkoutMethod: "ONLINE",
      internalNotes: "",
      createdAt: new Date().toISOString(),
      items: [
        { id: "itm-1", productName: "California Jumbo Almonds (Badam)", weight: "500g", quantity: 2, price: 500 },
        { id: "itm-2", productName: "Organic Raw Chia Seeds", weight: "200g", quantity: 2, price: 120 }
      ]
    },
    {
      id: "ord-2",
      orderNumber: "ORD-2026-1002",
      customerName: "Megha Vyas",
      phone: "919988776655",
      whatsapp: "919988776655",
      shippingAddress: "Near Mahakal Temple, Ujjain",
      deliveryType: "DELIVERY",
      orderNotes: "",
      totalAmount: 780,
      orderStatus: "PACKED",
      paymentStatus: "PAID",
      checkoutMethod: "WHATSAPP",
      internalNotes: "Customer paid via UPI on WhatsApp delivery confirmation.",
      createdAt: new Date().toISOString(),
      items: [
        { id: "itm-3", productName: "King Size Cashews (Kaju) W240", weight: "500g", quantity: 1, price: 580 },
        { id: "itm-4", productName: "Medjool Premium King Dates (Khajoor)", weight: "250g", quantity: 1, price: 390 }
      ]
    }
  ];

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className="font-serif-editorial text-3xl text-brand-green font-bold">
          Orders Manager
        </h1>
        <p className="text-xs text-brand-muted mt-1 leading-relaxed">
          Manage local Ujjain deliveries, store pickups, status progression, and export order lists to CSV.
        </p>
      </div>

      <OrdersManager initialOrders={orders as any} />
    </div>
  );
}
