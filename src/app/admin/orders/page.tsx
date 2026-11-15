import React from "react";
import OrdersManager from "@/components/OrdersManager";
import { getAdminOrders } from "@/lib/actions";

export const revalidate = 0; // Dynamic server-side rendering

export default async function AdminOrdersPage() {
  const orders = await getAdminOrders();

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
