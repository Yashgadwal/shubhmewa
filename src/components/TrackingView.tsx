"use client";

import React, { useState } from "react";
import { Search, Loader2, Check, Package, Compass, Truck, Home } from "lucide-react";
import { trackOrderOrEnquiry } from "@/lib/actions";

export default function TrackingView() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setErrorMsg("");
    setResult(null);

    try {
      const res = await trackOrderOrEnquiry(query.trim());
      if (res.error) {
        setErrorMsg(res.error);
      } else {
        setResult(res);
      }
    } catch (e) {
      setErrorMsg("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const statuses = [
    { label: "Ordered", status: "NEW", icon: Package },
    { label: "Confirmed", status: "CONFIRMED", icon: Check },
    { label: "Packed", status: "PACKED", icon: Compass },
    { label: "Dispatched", status: "OUT_FOR_DELIVERY", icon: Truck },
    { label: "Delivered", status: "DELIVERED", icon: Home },
  ];

  const getStatusIndex = (currentStatus: string) => {
    if (currentStatus === "CANCELLED") return -1;
    if (currentStatus === "FOLLOW_UP") return 1;
    return statuses.findIndex((s) => s.status === currentStatus);
  };

  const activeIndex = result?.type === "order" ? getStatusIndex(result.data.orderStatus) : -1;

  return (
    <div className="space-y-6 font-sans">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Order HDF-... or Phone Number"
            required
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full border border-brand-cream-dark/50 px-3.5 py-3 rounded-xl text-xs focus:outline-none focus:border-brand-gold text-brand-green bg-white pl-9 uppercase"
          />
          <Search className="w-4 h-4 text-brand-muted absolute left-3 top-3.5" />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-brand-green hover:bg-brand-green/95 text-brand-cream-light px-6 rounded-xl text-xs font-semibold uppercase tracking-wider disabled:opacity-50 flex items-center gap-1.5 shadow-md shrink-0"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Search</span>}
        </button>
      </form>

      {errorMsg && (
        <p className="text-red-500 text-xs text-center font-semibold bg-red-50 py-3 rounded-xl border border-red-200">
          {errorMsg}
        </p>
      )}

      {result && (
        <div className="bg-white border border-brand-cream-dark/30 p-6 rounded-2xl space-y-6 shadow-xs animate-fade-in">
          {result.type === "order" ? (
            <>
              {/* Order Info */}
              <div className="flex justify-between items-baseline border-b border-brand-cream-dark/20 pb-4">
                <div>
                  <span className="text-[10px] text-brand-muted font-bold block uppercase tracking-wider">
                    Order Number
                  </span>
                  <p className="text-sm font-bold text-brand-green">{result.data.orderNumber}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-brand-muted font-bold block uppercase tracking-wider">
                    Date Placed
                  </span>
                  <p className="text-xs text-brand-muted">
                    {new Date(result.data.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              {/* Status Timeline */}
              {result.data.orderStatus === "CANCELLED" ? (
                <p className="text-center text-red-500 font-semibold bg-red-50 py-3 rounded-lg text-sm">
                  This order was Cancelled.
                </p>
              ) : (
                <div className="space-y-6 py-4">
                  <span className="text-[10px] text-brand-muted font-bold block uppercase tracking-wider">
                    Order Progress
                  </span>
                  
                  <div className="relative flex items-center justify-between">
                    {/* Background line */}
                    <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-0.5 bg-brand-cream-light z-0" />
                    {/* Active line */}
                    <div
                      className="absolute left-4 top-1/2 -translate-y-1/2 h-0.5 bg-brand-gold z-0 transition-all duration-500"
                      style={{
                        width: activeIndex >= 0 ? `${(activeIndex / (statuses.length - 1)) * 95}%` : "0%",
                      }}
                    />

                    {statuses.map((step, idx) => {
                      const Icon = step.icon;
                      const isCompleted = idx <= activeIndex;
                      const isCurrent = idx === activeIndex;

                      return (
                        <div key={idx} className="relative z-10 flex flex-col items-center">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all ${
                              isCompleted
                                ? "bg-brand-gold border-brand-gold text-white"
                                : "bg-white border-brand-cream-dark text-brand-cream-dark"
                            } ${isCurrent ? "scale-110 ring-4 ring-brand-gold/20" : ""}`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <span
                            className={`text-[9px] tracking-wider font-semibold uppercase mt-2 text-center absolute -bottom-5 w-20 ${
                              isCurrent
                                ? "text-brand-gold font-bold"
                                : isCompleted
                                ? "text-brand-green"
                                : "text-brand-muted"
                            }`}
                          >
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="h-6" /> {/* Spacer for labels */}
                </div>
              )}

              {/* Items Summary */}
              <div className="border-t border-brand-cream-dark/20 pt-4 space-y-3">
                <span className="text-[10px] text-brand-muted font-bold block uppercase tracking-wider">
                  Itemized Summary
                </span>
                <div className="space-y-2">
                  {result.data.items.map((item: any) => (
                    <div key={item.id} className="flex justify-between text-xs text-brand-green font-medium">
                      <span>
                        {item.productName} ({item.weight}) x {item.quantity}
                      </span>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-xs font-bold text-brand-green border-t border-brand-cream-dark/15 pt-2">
                    <span>Grand Total</span>
                    <span>₹{result.data.totalAmount}</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Enquiry Info */}
              <div className="flex justify-between items-baseline border-b border-brand-cream-dark/20 pb-4">
                <div>
                  <span className="text-[10px] text-brand-muted font-bold block uppercase tracking-wider">
                    Enquiry ID
                  </span>
                  <p className="text-xs font-bold text-brand-green uppercase">{result.data.id.slice(0, 8)}...</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-brand-muted font-bold block uppercase tracking-wider">
                    Category/Occasion
                  </span>
                  <p className="text-xs font-bold text-brand-gold uppercase">{result.data.occasion || "Bulk Dry Fruits"}</p>
                </div>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <span className="text-[10px] text-brand-muted font-bold block uppercase tracking-wider">
                  Requirement Status
                </span>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 text-[10px] tracking-wider uppercase font-bold rounded-md ${
                      result.data.status === "NEW"
                        ? "bg-blue-100 text-blue-800"
                        : result.data.status === "IN_PROGRESS"
                        ? "bg-brand-gold/20 text-brand-gold"
                        : result.data.status === "CLOSED"
                        ? "bg-brand-green/20 text-brand-green"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {result.data.status === "CLOSED" ? "Completed / Approved" : result.data.status}
                  </span>
                  <p className="text-xs text-brand-muted">
                    {result.data.status === "NEW"
                      ? "Received. An advisor will contact you shortly."
                      : result.data.status === "IN_PROGRESS"
                      ? "Under review. Our advisor will reach out shortly."
                      : "Requirement closed."}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-brand-cream-dark/20 pt-4 text-xs text-brand-green leading-relaxed">
                <div>
                  <span className="font-semibold text-brand-green">Requested Quantity:</span>
                  <p>{result.data.quantity || "Custom"} Units</p>
                </div>
                <div>
                  <span className="font-semibold text-brand-green">Estimated Budget:</span>
                  <p>₹{result.data.budgetPerHamper || "Custom"} / unit</p>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
