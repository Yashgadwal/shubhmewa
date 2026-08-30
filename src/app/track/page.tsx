"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, MapPin, ShieldCheck, ShoppingBag } from "lucide-react";
import { trackOrderOrEnquiry } from "@/lib/actions";

function TrackContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("query") || "";
  const isSuccess = searchParams.get("success") === "true";

  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<any>(null);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await trackOrderOrEnquiry(query.trim());
      if (res.error) {
        setError(res.error);
      } else {
        setResult(res.details);
      }
    } catch (err) {
      setError("Failed to fetch order status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      handleSearch();
    }
  }, [initialQuery]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 font-sans text-xs text-brand-muted space-y-8">
      
      {/* Success Notification */}
      {isSuccess && (
        <div className="bg-brand-green/10 border border-brand-green/30 p-6 rounded-3xl space-y-2 text-center">
          <div className="w-12 h-12 bg-brand-green/20 text-brand-green rounded-full flex items-center justify-center mx-auto">
            <ShieldCheck className="w-6 h-6 text-brand-gold" />
          </div>
          <h2 className="font-serif-editorial text-lg text-brand-green font-bold">Payment Verified Securely!</h2>
          <p className="text-brand-muted max-w-sm mx-auto">Your order has been recorded successfully and dispatched to Shiprocket for fulfillment.</p>
        </div>
      )}

      {/* Main Card */}
      <div className="bg-white border border-brand-cream-dark/30 p-6 md:p-10 rounded-3xl space-y-6 shadow-xs">
        <h1 className="font-serif-editorial text-2xl text-brand-green font-bold border-b border-brand-cream-dark/20 pb-4">
          Track Your Shipment
        </h1>

        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="Enter Order ID (e.g. SM-123456) or Mobile Number"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 border border-brand-cream-dark/50 px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-brand-gold text-brand-green bg-white"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-brand-green hover:bg-brand-green/95 text-brand-cream-light px-6 py-2.5 rounded-xl font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all disabled:opacity-50"
          >
            <Search className="w-4 h-4 text-brand-gold" />
            <span>{loading ? "Tracking..." : "Track"}</span>
          </button>
        </form>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl font-semibold">
            {error}
          </div>
        )}

        {result ? (
          <div className="space-y-8 pt-4">
            
            {/* Brief summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-brand-cream-light/30 p-4 rounded-xl border border-brand-cream-dark/25">
              <div className="space-y-0.5">
                <span className="text-[10px] text-brand-muted font-bold block uppercase tracking-wider">Order Reference</span>
                <p className="text-brand-green font-bold">{result.orderNumber}</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-brand-muted font-bold block uppercase tracking-wider">Est Delivery</span>
                <p className="text-brand-green font-bold">4-6 Days</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-brand-muted font-bold block uppercase tracking-wider">Total Value</span>
                <p className="text-brand-green font-bold">₹{result.totalAmount}</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-brand-muted font-bold block uppercase tracking-wider">Logistics status</span>
                <p className="text-brand-gold font-bold uppercase tracking-wide">{result.orderStatus}</p>
              </div>
            </div>

            {/* Tracking Progress timeline */}
            <div className="space-y-4">
              <h3 className="font-serif-editorial text-base text-brand-green font-bold border-b border-brand-cream-dark/10 pb-2">
                Logistics Dispatch Status
              </h3>
              <div className="space-y-6 pl-4 border-l border-brand-cream-dark/40 relative">
                {result.timeline.map((step: any, idx: number) => {
                  const isActive = result.orderStatus === step.status || idx === 0;
                  return (
                    <div key={idx} className="relative space-y-1.5 pl-6">
                      <span className={`absolute -left-7 top-1 w-3.5 h-3.5 rounded-full border-2 bg-white ${
                        isActive ? "border-brand-gold ring-4 ring-brand-gold/20" : "border-brand-cream-dark/50"
                      }`} />
                      <span className="font-bold text-brand-green block leading-none">{step.title}</span>
                      <span className="text-[10px] text-brand-muted block">{step.date ? new Date(step.date).toLocaleDateString() : ""}</span>
                      <p className="text-brand-muted leading-relaxed">{step.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-3">
              <h3 className="font-serif-editorial text-base text-brand-green font-bold border-b border-brand-cream-dark/10 pb-2">
                Shipped Items
              </h3>
              <div className="divide-y divide-brand-cream-dark/20">
                {result.items.map((item: any, idx: number) => (
                  <div key={idx} className="py-2.5 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-brand-green">{item.productName}</p>
                      <span className="text-[10px] text-brand-muted">{item.weight} x {item.quantity}</span>
                    </div>
                    <span className="font-semibold text-brand-green">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Address */}
            <div className="bg-brand-cream-light/35 border border-brand-cream-dark/20 p-4 rounded-xl space-y-2">
              <span className="text-[10px] font-bold tracking-wider text-brand-green uppercase block">Destination coordinates</span>
              <div className="flex gap-2 text-brand-muted leading-relaxed">
                <MapPin className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                <p>{result.shippingAddress || "Ujjain, Madhya Pradesh"}</p>
              </div>
            </div>
            
            {/* Policy Reminder */}
            <div className="bg-red-50/50 border border-red-200/50 p-4 rounded-xl text-[10px] text-red-700 leading-relaxed">
              <span className="font-bold block uppercase tracking-wider mb-1">⚠️ Return & Replacement Policy Notice</span>
              <p>Please inspect your products immediately upon receipt. Any replacement requests must be reported within **12 hours** of delivery. To qualify, items must be unused, in their original packaging, and accompanied by a receipt or clear proof of defect (photo/unboxing video). No cash/digital refunds once payment is verified.</p>
              <p className="font-semibold mt-1">Support Phone/WhatsApp: 8982010210</p>
            </div>

          </div>
        ) : null}
      </div>

    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={
      <div className="max-w-4xl mx-auto px-4 py-24 text-center font-sans">
        <span className="w-10 h-10 border-4 border-brand-green border-t-transparent rounded-full animate-spin inline-block" />
        <p className="text-xs text-brand-muted mt-2">Loading tracking dashboard...</p>
      </div>
    }>
      <TrackContent />
    </Suspense>
  );
}
