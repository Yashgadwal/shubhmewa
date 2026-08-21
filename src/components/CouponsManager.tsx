"use client";

import React, { useState } from "react";
import { Plus, Trash2, Tag, Percent, IndianRupee } from "lucide-react";
import { createCouponAction, deleteCoupon } from "@/lib/actions";

interface Coupon {
  id: string;
  code: string;
  type: string;
  value: number;
  minOrderValue: number;
  usageCount: number;
  isActive: boolean;
}

interface CouponsManagerProps {
  initialCoupons: Coupon[];
}

export default function CouponsManager({ initialCoupons }: CouponsManagerProps) {
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [code, setCode] = useState("");
  const [type, setType] = useState("PERCENTAGE");
  const [value, setValue] = useState("");
  const [minOrder, setMinOrder] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !value || !minOrder) return;
    setErrorMsg("");
    setLoading(true);

    const res = await createCouponAction(
      code.trim(),
      type,
      Number(value),
      Number(minOrder)
    );

    setLoading(false);

    if (res.success && res.coupon) {
      setCoupons((prev) => [res.coupon as any, ...prev]);
      setCode("");
      setValue("");
      setMinOrder("");
    } else {
      setErrorMsg(res.error || "Failed to create coupon.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;
    const res = await deleteCoupon(id);
    if (res.success) {
      setCoupons((prev) => prev.filter((c) => c.id !== id));
    } else {
      alert("Failed to delete coupon.");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-sans">
      
      {/* Add Coupon Form */}
      <div className="lg:col-span-4 bg-white border border-brand-cream-dark/30 p-6 rounded-2xl h-fit space-y-4 shadow-xs">
        <h3 className="font-serif-editorial text-lg text-brand-green font-bold flex items-center gap-2 border-b border-brand-cream-dark/20 pb-3">
          <Tag className="w-4 h-4 text-brand-gold" />
          Create Coupon Code
        </h3>
        
        {errorMsg && <p className="text-red-500 text-xs font-semibold">{errorMsg}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] uppercase tracking-wider font-bold text-brand-green block mb-1">
              Voucher Code *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. DIWALI20"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="w-full border border-brand-cream-dark/50 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:border-brand-gold text-brand-green uppercase font-semibold"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-wider font-bold text-brand-green block mb-1">
              Discount Type *
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full border border-brand-cream-dark/50 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:border-brand-gold text-brand-green font-semibold bg-brand-cream-light/15"
            >
              <option value="PERCENTAGE">Percentage Discount (%)</option>
              <option value="FIXED">Fixed Amount Discount (₹)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] uppercase tracking-wider font-bold text-brand-green block mb-1">
                Value *
              </label>
              <input
                type="number"
                required
                min={1}
                placeholder={type === "PERCENTAGE" ? "e.g. 15" : "e.g. 100"}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full border border-brand-cream-dark/50 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:border-brand-gold text-brand-green font-semibold"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider font-bold text-brand-green block mb-1">
                Min Purchase *
              </label>
              <input
                type="number"
                required
                min={0}
                placeholder="e.g. 500"
                value={minOrder}
                onChange={(e) => setMinOrder(e.target.value)}
                className="w-full border border-brand-cream-dark/50 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:border-brand-gold text-brand-green font-semibold"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-green hover:bg-brand-green/95 text-brand-cream-light py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-md pt-3"
          >
            <Plus className="w-4 h-4 text-brand-gold" />
            <span>Generate Coupon</span>
          </button>
        </form>
      </div>

      {/* List Grid */}
      <div className="lg:col-span-8 bg-white border border-brand-cream-dark/30 rounded-2xl overflow-hidden shadow-xs h-fit">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-brand-cream-light/40 text-brand-green font-bold uppercase tracking-wider border-b border-brand-cream-dark/20">
                <th className="p-4">Promo Code</th>
                <th className="p-4">Benefit Type</th>
                <th className="p-4">Discount Value</th>
                <th className="p-4">Min. Threshold</th>
                <th className="p-4 text-center">Usage Count</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {coupons.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-brand-muted">
                    No active coupons created.
                  </td>
                </tr>
              ) : (
                coupons.map((c) => (
                  <tr key={c.id} className="border-b border-brand-cream-light/35 hover:bg-brand-cream-light/10">
                    <td className="p-4 font-bold text-brand-green">{c.code}</td>
                    <td className="p-4">
                      <span className="flex items-center gap-1 text-[10px] font-bold text-brand-gold">
                        {c.type === "PERCENTAGE" ? (
                          <>
                            <Percent className="w-3.5 h-3.5" />
                            <span>PERCENT</span>
                          </>
                        ) : (
                          <>
                            <IndianRupee className="w-3.5 h-3.5" />
                            <span>FIXED</span>
                          </>
                        )}
                      </span>
                    </td>
                    <td className="p-4 text-brand-green font-bold">
                      {c.type === "PERCENTAGE" ? `${c.value}%` : `₹${c.value}`}
                    </td>
                    <td className="p-4 text-brand-muted">₹{c.minOrderValue}</td>
                    <td className="p-4 text-center font-bold text-brand-green">{c.usageCount} times</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors inline-flex items-center gap-1 font-semibold"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
