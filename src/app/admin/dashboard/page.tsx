import React from "react";
import { getDashboardStats } from "@/lib/actions";
import { ShoppingBag, TrendingUp, HelpCircle, Eye, ArrowRight, UserCheck } from "lucide-react";
import Link from "next/link";

export const revalidate = 0; // Dynamic server-side rendering

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  const kpis = [
    { label: "Total Revenue", value: `₹${stats.totalRevenue}`, icon: TrendingUp, color: "text-green-600 bg-green-50" },
    { label: "WhatsApp order clicks", value: stats.whatsappClicks, icon: ShoppingBag, color: "text-blue-600 bg-blue-50" },
    { label: "Bulk Hamper Leads", value: stats.enquiriesCount, icon: HelpCircle, color: "text-brand-gold bg-amber-50" },
    { label: "Total Products", value: stats.productsCount, icon: UserCheck, color: "text-brand-green bg-emerald-50" },
  ];

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div>
        <h1 className="font-serif-editorial text-3xl text-brand-green font-bold">
          Operations Overview
        </h1>
        <p className="text-xs text-brand-muted mt-1 leading-relaxed">
          Real-time summary of sales, click-through rates, custom enquiries, and inventory levels.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="bg-white border border-brand-cream-dark/30 p-6 rounded-2xl flex items-center gap-4 shadow-xs">
              <div className={`p-4 rounded-xl shrink-0 ${kpi.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] text-brand-muted font-bold block uppercase tracking-wider">
                  {kpi.label}
                </span>
                <p className="text-xl font-bold text-brand-green mt-0.5">{kpi.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders & Enquiries Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Orders */}
        <div className="bg-white border border-brand-cream-dark/30 rounded-3xl p-6 space-y-4 shadow-xs">
          <div className="flex justify-between items-center border-b border-brand-cream-dark/20 pb-3">
            <h3 className="font-serif-editorial text-lg text-brand-green font-bold">
              Recent Orders
            </h3>
            <Link
              href="/admin/orders"
              className="text-[10px] text-brand-gold hover:underline font-bold uppercase tracking-wider flex items-center gap-1"
            >
              <span>Manage Orders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {stats.recentOrders.length === 0 ? (
            <p className="text-center text-xs text-brand-muted py-6">No orders placed yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="text-brand-green font-semibold border-b border-brand-cream-light pb-2">
                    <th className="py-2">Order No.</th>
                    <th className="py-2">Customer</th>
                    <th className="py-2">Amount</th>
                    <th className="py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-brand-cream-light/35 hover:bg-brand-cream-light/10">
                      <td className="py-2.5 font-bold text-brand-green">{order.orderNumber}</td>
                      <td className="py-2.5 text-brand-muted">{order.customerName}</td>
                      <td className="py-2.5 text-brand-green font-semibold">₹{order.totalAmount}</td>
                      <td className="py-2.5">
                        <span className="px-2 py-0.5 rounded-md text-[9px] uppercase font-bold bg-brand-cream-light text-brand-green border border-brand-cream-dark/30">
                          {order.orderStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Hampers Enquiries */}
        <div className="bg-white border border-brand-cream-dark/30 rounded-3xl p-6 space-y-4 shadow-xs">
          <div className="flex justify-between items-center border-b border-brand-cream-dark/20 pb-3">
            <h3 className="font-serif-editorial text-lg text-brand-green font-bold">
              Recent Gifting Leads
            </h3>
            <Link
              href="/admin/enquiries"
              className="text-[10px] text-brand-gold hover:underline font-bold uppercase tracking-wider flex items-center gap-1"
            >
              <span>Manage Leads</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {stats.recentEnquiries.length === 0 ? (
            <p className="text-center text-xs text-brand-muted py-6">No custom enquiries received.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="text-brand-green font-semibold border-b border-brand-cream-light pb-2">
                    <th className="py-2">Contact</th>
                    <th className="py-2">Occasion</th>
                    <th className="py-2">Quantity</th>
                    <th className="py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentEnquiries.map((enquiry) => (
                    <tr key={enquiry.id} className="border-b border-brand-cream-light/35 hover:bg-brand-cream-light/10">
                      <td className="py-2.5 font-bold text-brand-green">{enquiry.customerName}</td>
                      <td className="py-2.5 text-brand-gold font-semibold">{enquiry.occasion || "Hamper"}</td>
                      <td className="py-2.5 text-brand-muted">{enquiry.quantity || "Custom"} units</td>
                      <td className="py-2.5">
                        <span className="px-2 py-0.5 rounded-md text-[9px] uppercase font-bold bg-amber-50 text-brand-gold border border-brand-gold/20">
                          {enquiry.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
