import React from "react";
import { prisma } from "@/lib/prisma";
import CouponsManager from "@/components/CouponsManager";

export const revalidate = 0; // Dynamic server-side rendering

export default async function AdminCouponsPage() {
  const coupons = await prisma.coupon.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

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
