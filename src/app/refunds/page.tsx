import React from "react";

export default function RefundsPage() {
  return (
    <div className="w-full bg-brand-cream-light/30 min-h-screen py-16 font-sans">
      <div className="max-w-2xl mx-auto px-4 bg-white border border-brand-cream-dark/30 p-8 md:p-12 rounded-3xl shadow-xs space-y-6 text-xs text-brand-muted leading-relaxed">
        <h1 className="font-serif-editorial text-3xl text-brand-green font-bold border-b border-brand-cream-dark/20 pb-4">
          Refund & Cancellation Policy
        </h1>
        <p className="text-[10px] text-brand-gold uppercase tracking-wider font-bold">
          Returns and Refunds
        </p>

        <h2 className="font-serif-editorial text-lg text-brand-green font-bold mt-6">
          1. Food Product Return Policy
        </h2>
        <p>
          Because dry fruits, seeds, and spices are agricultural food consumables, we do not accept general returns once packaging bags/jars are opened, due to hygiene safety standards.
        </p>

        <h2 className="font-serif-editorial text-lg text-brand-green font-bold mt-6">
          2. Damaged or Quality Issues
        </h2>
        <p>
          If you receive incorrect dry fruit weights, packaging box damage, or quality decay, notify us at info@harshildryfruits.com or via WhatsApp within **24 hours** of delivery. Please provide photos or order receipt numbers.
        </p>
        <p>
          Verified claims will receive a **free replacement** or **100% store refund** within 3 business days.
        </p>

        <h2 className="font-serif-editorial text-lg text-brand-green font-bold mt-6">
          3. Custom Gifting Cancellations
        </h2>
        <p>
          Wedding Favours and Custom Corporate orders with specialized name/logo laser engravings cannot be cancelled once production begins.
        </p>
      </div>
    </div>
  );
}
