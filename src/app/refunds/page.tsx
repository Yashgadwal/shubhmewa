import React from "react";

export default function RefundsPage() {
  return (
    <div className="w-full bg-brand-cream-light/30 min-h-screen py-16 font-sans">
      <div className="max-w-2xl mx-auto px-4 bg-white border border-brand-cream-dark/30 p-8 md:p-12 rounded-3xl shadow-xs space-y-6 text-xs text-brand-muted leading-relaxed">
        <h1 className="font-serif-editorial text-3xl text-brand-green font-bold border-b border-brand-cream-dark/20 pb-4">
          Replacement & Cancellation Policy
        </h1>
        <p className="text-[10px] text-brand-gold uppercase tracking-wider font-bold">
          Effective: August 2026
        </p>

        <h2 className="font-serif-editorial text-lg text-brand-green font-bold mt-6">
          1. Strict Replacement-Only Policy
        </h2>
        <p>
          Because dry fruits, seeds, and spices are agricultural food consumables, we enforce a strict **"No Refund. Replacement Only"** policy. We do not issue cash or digital refunds under any circumstances once orders have been processed and shipped.
        </p>

        <h2 className="font-serif-editorial text-lg text-brand-green font-bold mt-6">
          2. Damaged or Quality Issues (12-Hour reporting window)
        </h2>
        <p>
          If you receive incorrect dry fruit weights, packaging box damage, missing items, or quality discrepancies, you must notify our customer support team at **info@shubhmewa.com** or via WhatsApp (**8982010210**) within **12 hours** of delivery.
        </p>
        <p>
          Any complaints reported after the 12-hour window will not be eligible for review, return, or replacement. Please ensure you inspect the products immediately upon delivery and provide clear photo evidence of the outer box and product contents.
        </p>

        <h2 className="font-serif-editorial text-lg text-brand-green font-bold mt-6">
          3. Order Cancellations & Bulk Orders
        </h2>
        <p>
          - **Standard Orders**: Once processed for packing and shipment, standard orders cannot be cancelled or modified.
        </p>
        <p>
          - **Bulk Orders**: Any order consisting of a quantity of **10 or more units** is treated as a Bulk Order and cannot be cancelled or refunded under any circumstances once placed. Custom-designed celebration and wedding favors with specialized monogram engravings or custom box prints are also strictly non-cancellable.
        </p>
      </div>
    </div>
  );
}
