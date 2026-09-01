import React from "react";

export default function RefundsPage() {
  return (
    <div className="w-full bg-brand-cream-light/30 min-h-screen py-16 font-sans">
      <div className="max-w-2xl mx-auto px-4 bg-white border border-brand-cream-dark/30 p-8 md:p-12 rounded-3xl shadow-xs space-y-6 text-xs text-brand-muted leading-relaxed">
        <h1 className="font-serif-editorial text-3xl text-brand-green font-bold border-b border-brand-cream-dark/20 pb-4">
          Refund & Replacement Policy
        </h1>
        <div className="inline-block bg-green-50 text-brand-green border border-green-200 px-3 py-1 rounded-full font-bold text-[11px] uppercase tracking-wider">
          🛡️ Full Refund & Replacement Available
        </div>

        <h2 className="font-serif-editorial text-lg text-brand-green font-bold mt-6">
          1. Full Refund & Replacement Guarantee
        </h2>
        <p>
          At ShubhMewa, we are committed to delivering the highest grade of premium dry fruits, makhana, and aromatic spices. **Full Refund & Replacement Available** for any genuine quality issue, transit damage, or incorrect items.
        </p>

        <h2 className="font-serif-editorial text-lg text-brand-green font-bold mt-6">
          2. Damaged or Quality Issues (12-Hour Reporting Window)
        </h2>
        <p>
          If you receive incorrect dry fruit weights, damaged packaging, broken vacuum seals, or quality discrepancies, please notify our customer support team at **info@shubhmewa.com** or via WhatsApp (**8982010210**) within **12 hours** of delivery.
        </p>
        <p>
          Please ensure you inspect the products upon receipt and provide clear photo or video evidence of the outer packaging and defective contents. Once verified by our support team, we will promptly process your choice of an instant replacement or a full refund.
        </p>

        <h2 className="font-serif-editorial text-lg text-brand-green font-bold mt-6">
          3. Return & Replacement Eligibility Conditions
        </h2>
        <ul className="list-disc pl-4 space-y-1.5 mt-2">
          <li>To complete your return or refund claim, we require an invoice/order receipt and valid proof of the defected or damaged item (photos or unboxing video).</li>
          <li>Your item must be unused, sealed, and in the same pristine condition that you received it.</li>
          <li>It must also be in the original premium ShubhMewa packaging.</li>
        </ul>

        <h2 className="font-serif-editorial text-lg text-brand-green font-bold mt-6">
          4. Order Cancellations & Modifications
        </h2>
        <p>
          - **Standard Orders**: Orders can be modified or cancelled before they are dispatched for local delivery.
        </p>
        <p>
          - **Bulk Orders**: Orders consisting of **10 or more units** are treated as Bulk Orders and cannot be cancelled once custom packaging or batch sorting has commenced.
        </p>
      </div>
    </div>
  );
}
