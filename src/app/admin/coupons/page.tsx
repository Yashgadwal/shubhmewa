import React from "react";
import CouponsManager from "@/components/CouponsManager";

export const revalidate = 0; // Dynamic server-side rendering

export default async function AdminCouponsPage() {
  const coupons = [
    { id: "cp-1", code: "WELCOME10", type: "PERCENTAGE", value: 10, minOrderValue: 500, usageCount: 5, isActive: true },
    { id: "cp-2", code: "SHUBH15", type: "PERCENTAGE", value: 15, minOrderValue: 999, usageCount: 12, isActive: true },
    { id: "cp-3", code: "MEWA100", type: "FIXED", value: 100, minOrderValue: 750, usageCount: 8, isActive: true }
  ];

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className="font-serif-editorial text-3xl text-brand-green font-bold">
          Coupons & Discounts
        </h1>
        <p className="text-xs text-brand-muted mt-1 leading-relaxed">
          Create promotional discount codes, manage value limits, and monitor usage counts.
        </p>
      </div>

      <CouponsManager initialCoupons={coupons as any} />
    </div>
  );
}
