"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { User, ShoppingBag, ShieldCheck, Award, MapPin, Tag } from "lucide-react";
import { getLoyaltyStatus, getAdminSession } from "@/lib/actions";

export default function AccountPage() {
  const [phoneInput, setPhoneInput] = useState("");
  const [activeTab, setActiveTab] = useState<"orders" | "loyalty" | "profile">("orders");
  
  // Simulated customer profile
  const [profile, setProfile] = useState<{
    name: string;
    phone: string;
    email: string;
    address: string;
    qualifiesLoyalty: boolean;
    loyaltyCoupon: string | null;
    ordersCount: number;
  } | null>(null);

  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(phoneInput)) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }
    setLoading(true);
    try {
      const res = await getLoyaltyStatus(phoneInput);
      setProfile({
        name: phoneInput.endsWith("210") ? "Aman Agrawal" : "Valued Customer",
        phone: phoneInput,
        email: phoneInput.endsWith("210") ? "aman@gmail.com" : "customer@shubhmewa.com",
        address: "Shop No. 5, Fawara Chowk, Daulat Ganj, Ujjain",
        qualifiesLoyalty: res.eligible,
        loyaltyCoupon: res.couponCode,
        ordersCount: res.orderCount,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Mock previous orders
  const mockOrders = [
    { id: "SM-104928", date: "2026-08-10", total: 840, status: "DELIVERED" },
    { id: "SM-294029", date: "2026-08-20", total: 1120, status: "SHIPPED" },
    { id: "SM-902030", date: "2026-08-24", total: 540, status: "CONFIRMED" },
  ];

  if (!profile) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-xs text-brand-muted space-y-6 font-sans">
        <div className="bg-white border border-brand-cream-dark/30 p-6 md:p-8 rounded-3xl space-y-4 shadow-xs text-center">
          <div className="w-12 h-12 bg-brand-green/10 text-brand-green rounded-full flex items-center justify-center mx-auto mb-2">
            <User className="w-6 h-6 text-brand-gold" />
          </div>
          <h2 className="font-serif-editorial text-xl text-brand-green font-bold">Access Your Account</h2>
          <p className="text-brand-muted">Enter your registered 10-digit mobile number to view order history, track shipments, and check loyalty discounts.</p>
          
          <form onSubmit={handleLogin} className="space-y-3 pt-2 text-left">
            <input
              type="tel"
              placeholder="e.g. 8982010210"
              required
              maxLength={10}
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value.replace(/\D/g, ""))}
              className="w-full border border-brand-cream-dark/50 px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-brand-gold text-brand-green bg-white"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-green hover:bg-brand-green/95 text-brand-cream-light py-3 rounded-xl font-bold uppercase tracking-wider transition-all disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Sign In / Register"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 font-sans text-xs text-brand-muted grid grid-cols-1 md:grid-cols-4 gap-8">
      
      {/* Left Column Navigation Card */}
      <div className="md:col-span-1 bg-white border border-brand-cream-dark/30 p-6 rounded-3xl space-y-6 h-fit">
        <div className="space-y-2 text-center border-b border-brand-cream-dark/20 pb-4">
          <div className="w-16 h-16 bg-brand-green/10 text-brand-green rounded-full flex items-center justify-center mx-auto">
            <User className="w-8 h-8 text-brand-gold" />
          </div>
          <h2 className="font-serif-editorial text-base text-brand-green font-bold leading-none">{profile.name}</h2>
          <span className="text-[10px] text-brand-muted block">{profile.phone}</span>
        </div>

        <nav className="flex flex-col gap-2">
          <button
            onClick={() => setActiveTab("orders")}
            className={`w-full py-2.5 px-3 rounded-xl text-left font-semibold transition-all ${
              activeTab === "orders" ? "bg-brand-green text-brand-cream-light" : "hover:bg-brand-cream-light/50"
            }`}
          >
            Order History
          </button>
          <button
            onClick={() => setActiveTab("loyalty")}
            className={`w-full py-2.5 px-3 rounded-xl text-left font-semibold transition-all ${
              activeTab === "loyalty" ? "bg-brand-green text-brand-cream-light" : "hover:bg-brand-cream-light/50"
            }`}
          >
            Loyalty Rewards
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`w-full py-2.5 px-3 rounded-xl text-left font-semibold transition-all ${
              activeTab === "profile" ? "bg-brand-green text-brand-cream-light" : "hover:bg-brand-cream-light/50"
            }`}
          >
            My Details
          </button>
          <button
            onClick={() => setProfile(null)}
            className="w-full py-2.5 px-3 rounded-xl text-left font-semibold text-red-500 hover:bg-red-50/50 mt-4 border-t border-brand-cream-dark/10 pt-4"
          >
            Log Out
          </button>
        </nav>
      </div>

      {/* Right Column Content Card */}
      <div className="md:col-span-3 bg-white border border-brand-cream-dark/30 p-6 md:p-10 rounded-3xl shadow-xs space-y-6">
        
        {/* Tab 1: Orders History */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            <h1 className="font-serif-editorial text-xl text-brand-green font-bold border-b border-brand-cream-dark/20 pb-3 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-brand-gold" />
              Your Order History
            </h1>
            <div className="divide-y divide-brand-cream-dark/20">
              {mockOrders.map((o) => (
                <div key={o.id} className="py-4 flex flex-wrap justify-between items-center gap-4">
                  <div className="space-y-1">
                    <p className="text-brand-green font-bold">{o.id}</p>
                    <span className="text-[10px] text-brand-muted block">Placed: {o.date}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-brand-muted font-bold block uppercase tracking-wider">Amount</span>
                    <p className="text-brand-green font-semibold">₹{o.total}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-brand-muted font-bold block uppercase tracking-wider">Status</span>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide ${
                      o.status === "DELIVERED" ? "bg-green-100 text-green-700" : "bg-brand-gold/15 text-brand-gold"
                    }`}>{o.status}</span>
                  </div>
                  <Link
                    href={`/track?query=${o.id}`}
                    className="border border-brand-green hover:border-brand-gold text-brand-green hover:text-brand-gold px-4 py-2 rounded-xl font-bold uppercase tracking-wider transition-colors"
                  >
                    Track Status
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Loyalty Rewards */}
        {activeTab === "loyalty" && (
          <div className="space-y-6">
            <h1 className="font-serif-editorial text-xl text-brand-green font-bold border-b border-brand-cream-dark/20 pb-3 flex items-center gap-2">
              <Award className="w-5 h-5 text-brand-gold" />
              Loyalty Rewards Progress
            </h1>

            <div className="bg-brand-cream-light/35 border border-brand-cream-dark/20 p-6 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <span className="text-[10px] font-bold tracking-wider text-brand-green uppercase block">Orders Count (Last 30 Days)</span>
                <p className="text-3xl font-bold text-brand-green leading-none">{profile.ordersCount} / 3</p>
                <p className="text-[10px] text-brand-muted leading-relaxed">Place 3 orders within 1 month to qualify for the **Lifetime 5% OFF Coupon**.</p>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-bold tracking-wider text-brand-green uppercase block">Loyalty Coupon Status</span>
                {profile.qualifiesLoyalty ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-brand-green font-bold bg-green-100/50 p-2 rounded-lg border border-green-200">
                      <ShieldCheck className="w-4 h-4 text-green-600" />
                      <span>Lifetime 5% Active!</span>
                    </div>
                    <p className="text-[10px] text-brand-muted">Coupon Code: <span className="font-bold text-brand-gold">LIFETIME5</span> (5% off future purchases, subject to 3-month activity checks).</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-brand-muted font-bold bg-brand-cream-light p-2 rounded-lg border">
                      <span>Not Eligible Yet</span>
                    </div>
                    <p className="text-[10px] text-brand-muted">Qualify by placing {(3 - profile.ordersCount) > 0 ? (3 - profile.ordersCount) : 0} more orders this month.</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-white border border-brand-cream-dark/20 p-4 rounded-xl space-y-2">
              <span className="font-bold text-brand-green block">Lifetime Loyalty Terms:</span>
              <ul className="list-disc pl-4 space-y-1.5 text-brand-muted">
                <li>Eligible orders count toward the loyalty status automatically after successful Razorpay verification.</li>
                <li>Qualifying customers receive a flat 5% off code `LIFETIME5` to be applied on the checkout page.</li>
                <li>Your profile activity must remain active with at least one order every 3 months. ShubhMewa management reserves the right to deactivate or modify coupon terms.</li>
              </ul>
            </div>
          </div>
        )}

        {/* Tab 3: Profile Details */}
        {activeTab === "profile" && (
          <div className="space-y-6">
            <h1 className="font-serif-editorial text-xl text-brand-green font-bold border-b border-brand-cream-dark/20 pb-3 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-brand-gold" />
              Delivery Details
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1 bg-brand-cream-light/20 border border-brand-cream-dark/25 p-4 rounded-xl">
                <span className="font-bold text-brand-green block uppercase text-[10px] tracking-wider">Contact Email</span>
                <p className="text-brand-muted">{profile.email}</p>
              </div>
              <div className="space-y-1 bg-brand-cream-light/20 border border-brand-cream-dark/25 p-4 rounded-xl">
                <span className="font-bold text-brand-green block uppercase text-[10px] tracking-wider">Registered Mobile</span>
                <p className="text-brand-muted">{profile.phone}</p>
              </div>
              <div className="space-y-1 bg-brand-cream-light/20 border border-brand-cream-dark/25 p-4 rounded-xl md:col-span-2">
                <span className="font-bold text-brand-green block uppercase text-[10px] tracking-wider">Primary Shipping Destination</span>
                <p className="text-brand-muted">{profile.address}</p>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
