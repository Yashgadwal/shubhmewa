"use client";

import React, { useState } from "react";
import { Search, FileDown, Eye, MessageSquare, Save, X, PhoneCall } from "lucide-react";
import { updateOrderStatus, updateOrderInternalNotes } from "@/lib/actions";

interface OrderItem {
  id: string;
  productName: string;
  weight: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  whatsapp: string;
  shippingAddress: string | null;
  deliveryType: string;
  orderNotes: string | null;
  totalAmount: number;
  orderStatus: string;
  paymentStatus: string;
  checkoutMethod: string;
  internalNotes: string | null;
  createdAt: string;
  items: OrderItem[];
}

interface OrdersManagerProps {
  initialOrders: Order[];
}

export default function OrdersManager({ initialOrders }: OrdersManagerProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  // Drawer update states
  const [tempStatus, setTempStatus] = useState("");
  const [tempNotes, setTempNotes] = useState("");
  const [updating, setUpdating] = useState(false);

  // Filter orders
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.phone.includes(search);

    const matchesStatus = statusFilter === "ALL" ? true : o.orderStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Handle Status Update
  const handleStatusChange = async (status: string) => {
    if (!selectedOrder) return;
    setUpdating(true);
    const res = await updateOrderStatus(selectedOrder.id, status);
    setUpdating(false);

    if (res.success && res.order) {
      setOrders((prev) =>
        prev.map((o) => (o.id === selectedOrder.id ? { ...o, orderStatus: status } : o))
      );
      setSelectedOrder((prev) => (prev ? { ...prev, orderStatus: status } : null));
    }
  };

  // Handle Notes Save
  const handleSaveNotes = async () => {
    if (!selectedOrder) return;
    setUpdating(true);
    const res = await updateOrderInternalNotes(selectedOrder.id, tempNotes);
    setUpdating(false);

    if (res.success && res.order) {
      setOrders((prev) =>
        prev.map((o) => (o.id === selectedOrder.id ? { ...o, internalNotes: tempNotes } : o))
      );
      setSelectedOrder((prev) => (prev ? { ...prev, internalNotes: tempNotes } : null));
    }
  };

  // Handle CSV Export
  const handleExportCSV = () => {
    const headers = [
      "Order Number",
      "Customer Name",
      "Phone",
      "Delivery Type",
      "Address",
      "Total Amount",
      "Order Status",
      "Payment Status",
      "Checkout Method",
      "Date",
    ];

    const rows = filteredOrders.map((o) => [
      o.orderNumber,
      `"${o.customerName}"`,
      o.phone,
      o.deliveryType,
      `"${o.shippingAddress || "Store Pickup"}"`,
      o.totalAmount,
      o.orderStatus,
      o.paymentStatus,
      o.checkoutMethod,
      new Date(o.createdAt).toLocaleDateString(),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Orders_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openDrawer = (order: Order) => {
    setSelectedOrder(order);
    setTempStatus(order.orderStatus);
    setTempNotes(order.internalNotes || "");
  };

  const closeDrawer = () => {
    setSelectedOrder(null);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Controls Header */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white border border-brand-cream-dark/30 p-4 rounded-xl shadow-xs">
        
        {/* Search */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Search order number, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-brand-cream-dark/50 px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-brand-gold text-brand-green pl-9"
          />
          <Search className="w-4 h-4 text-brand-muted absolute left-3 top-2.5" />
        </div>

        {/* Status filters */}
        <div className="flex flex-wrap gap-2 text-xs">
          {["ALL", "NEW", "CONFIRMED", "PACKED", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg border font-semibold tracking-wide uppercase transition-all ${
                statusFilter === status
                  ? "bg-brand-green border-brand-green text-brand-cream-light shadow-sm"
                  : "bg-white border-brand-cream-dark/50 text-brand-green hover:border-brand-gold"
              }`}
            >
              {status === "ALL" ? "All Statuses" : status.replace(/_/g, " ")}
            </button>
          ))}
        </div>

        {/* Export Action */}
        <button
          onClick={handleExportCSV}
          disabled={filteredOrders.length === 0}
          className="bg-brand-green hover:bg-brand-green/95 text-brand-cream-light py-2 px-4 rounded-xl text-xs font-bold uppercase tracking-wider disabled:opacity-50 flex items-center gap-1.5 shadow-sm w-full md:w-auto justify-center"
        >
          <FileDown className="w-4 h-4 text-brand-gold" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Orders Grid/Table */}
      <div className="bg-white border border-brand-cream-dark/30 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-brand-cream-light/40 text-brand-green font-bold uppercase tracking-wider border-b border-brand-cream-dark/20">
                <th className="p-4">Order Number</th>
                <th className="p-4">Customer Name</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Grand Total</th>
                <th className="p-4">Checkout Method</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-brand-muted">
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => (
                  <tr key={o.id} className="border-b border-brand-cream-light/35 hover:bg-brand-cream-light/10">
                    <td className="p-4 font-bold text-brand-green">{o.orderNumber}</td>
                    <td className="p-4 text-brand-green font-semibold">{o.customerName}</td>
                    <td className="p-4 text-brand-muted">{o.phone}</td>
                    <td className="p-4 text-brand-green font-bold">₹{o.totalAmount}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-md text-[9px] uppercase font-bold bg-brand-cream-light border border-brand-cream-dark/30 text-brand-green">
                        {o.checkoutMethod}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[9px] uppercase font-bold border ${
                          o.orderStatus === "DELIVERED"
                            ? "bg-green-50 border-green-200 text-green-700"
                            : o.orderStatus === "CANCELLED"
                            ? "bg-red-50 border-red-200 text-red-700"
                            : "bg-amber-50 border-amber-200 text-amber-700"
                        }`}
                      >
                        {o.orderStatus.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => openDrawer(o)}
                        className="p-1.5 border border-brand-cream-dark/60 text-brand-green hover:border-brand-gold hover:text-brand-gold rounded-lg bg-white/50 transition-colors inline-flex items-center gap-1 font-semibold"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-out details Drawer */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-hidden font-sans">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" onClick={closeDrawer} />
          
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-brand-cream-light border-l border-brand-cream-dark flex flex-col shadow-2xl transition-transform duration-300">
              
              {/* Header */}
              <div className="px-6 py-5 bg-brand-green text-brand-cream-light flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-serif-editorial font-bold">Order Details</h2>
                  <p className="text-[10px] text-brand-gold tracking-widest uppercase font-semibold mt-0.5">
                    {selectedOrder.orderNumber}
                  </p>
                </div>
                <button
                  onClick={closeDrawer}
                  className="p-1 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-brand-cream-light" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* Customer Details */}
                <div className="bg-white border border-brand-cream-dark/30 p-4 rounded-xl space-y-2">
                  <h4 className="text-[10px] text-brand-muted font-bold block uppercase tracking-wider">
                    Customer Contact
                  </h4>
                  <p className="text-sm font-bold text-brand-green">{selectedOrder.customerName}</p>
                  <p className="text-xs text-brand-muted">Phone/WhatsApp: {selectedOrder.phone}</p>
                  <p className="text-xs text-brand-muted">
                    Preference: {selectedOrder.deliveryType}
                  </p>
                  {selectedOrder.shippingAddress && (
                    <p className="text-xs text-brand-muted">Address: {selectedOrder.shippingAddress}</p>
                  )}
                  {selectedOrder.orderNotes && (
                    <p className="text-xs text-red-500 italic">Notes: {selectedOrder.orderNotes}</p>
                  )}

                  {/* WhatsApp contact redirect */}
                  <a
                    href={`https://wa.me/${selectedOrder.phone}?text=Hello%20${selectedOrder.customerName},%20this%20is%20ShubhMewa%20regarding%20your%20order%20${selectedOrder.orderNumber}.`}
                    target="_blank"
                    className="mt-4 flex items-center justify-center gap-1 bg-[#25D366] text-white py-2 rounded-xl text-xs font-semibold tracking-wide"
                  >
                    <MessageSquare className="w-4 h-4 fill-current" />
                    <span>Chat on WhatsApp</span>
                  </a>
                </div>

                {/* Status modifier dropdown */}
                <div className="bg-white border border-brand-cream-dark/30 p-4 rounded-xl space-y-3">
                  <label className="text-[10px] text-brand-muted font-bold block uppercase tracking-wider">
                    Order Dispatch Stage
                  </label>
                  <select
                    value={tempStatus}
                    disabled={updating}
                    onChange={(e) => {
                      setTempStatus(e.target.value);
                      handleStatusChange(e.target.value);
                    }}
                    className="w-full border border-brand-cream-dark/50 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand-gold text-brand-green font-semibold bg-brand-cream-light/20"
                  >
                    <option value="NEW">New Order (Pending)</option>
                    <option value="CONFIRMED">Order Confirmed</option>
                    <option value="PACKED">Packed & Sealed</option>
                    <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                    <option value="DELIVERED">Delivered successfully</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>

                {/* Internal notes textbox */}
                <div className="bg-white border border-brand-cream-dark/30 p-4 rounded-xl space-y-3">
                  <label className="text-[10px] text-brand-muted font-bold block uppercase tracking-wider">
                    Store Internal Notes
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Paid via UPI, client requested extra Saffron strands..."
                    value={tempNotes}
                    onChange={(e) => setTempNotes(e.target.value)}
                    className="w-full border border-brand-cream-dark/50 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand-gold text-brand-green"
                  />
                  <button
                    type="button"
                    onClick={handleSaveNotes}
                    disabled={updating}
                    className="bg-brand-green text-brand-cream-light px-4 py-2 rounded-lg text-xs font-semibold hover:bg-brand-green/90 transition-colors flex items-center gap-1"
                  >
                    <Save className="w-3.5 h-3.5 text-brand-gold" />
                    <span>Save Notes</span>
                  </button>
                </div>

                {/* Items detail list */}
                <div className="space-y-3">
                  <span className="text-[10px] text-brand-muted font-bold block uppercase tracking-wider">
                    Ordered items
                  </span>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center p-3 bg-white rounded-xl border border-brand-cream-dark/30 text-xs text-brand-green font-medium"
                      >
                        <div>
                          <p className="font-bold">{item.productName}</p>
                          <span className="text-[10px] text-brand-muted">{item.weight} x {item.quantity}</span>
                        </div>
                        <span className="font-bold">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center px-3 py-2 border-t border-brand-cream-dark/15 text-sm font-bold text-brand-green">
                      <span>Total Amount</span>
                      <span className="text-brand-gold">₹{selectedOrder.totalAmount}</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
