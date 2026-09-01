import React from "react";

export default function TermsPage() {
  return (
    <div className="w-full bg-brand-cream-light/30 min-h-screen py-16 font-sans">
      <div className="max-w-2xl mx-auto px-4 bg-white border border-brand-cream-dark/30 p-8 md:p-12 rounded-3xl shadow-xs space-y-6 text-xs text-brand-muted leading-relaxed">
        <h1 className="font-serif-editorial text-3xl text-brand-green font-bold border-b border-brand-cream-dark/20 pb-4">
          Terms & Conditions
        </h1>
        <p className="text-[10px] text-brand-gold uppercase tracking-wider font-bold">
          Effective Date: August 2026
        </p>

        <p>
          Welcome to **ShubhMewa**. By accessing our catalog, ordering dry fruits online, or placing inquiries, you agree to comply with the terms defined herein.
        </p>

        <h2 className="font-serif-editorial text-lg text-brand-green font-bold mt-6">
          1. Store Sourcing & Products
        </h2>
        <p>
          We make every effort to display dry fruit sizes, weights, and packaging boxes accurately. Because agricultural goods naturally vary in size, shapes, and textures, final deliveries may differ slightly in color or layout.
        </p>

        <h2 className="font-serif-editorial text-lg text-brand-green font-bold mt-6">
          2. Gifting Orders & WhatsApp Checkout
        </h2>
        <p>
          The cart-to-WhatsApp flow acts as an order checklist helper. Sourced orders are confirmed once our boutique team confirms quantity availability and delivery slot options in Ujjain.
        </p>

        <h2 className="font-serif-editorial text-lg text-brand-green font-bold mt-6">
          3. Cancellation Policy (Bulk Orders)
        </h2>
        <p>
          - Standard orders cannot be cancelled once they have been processed or dispatched.
        </p>
        <p>
          - Any order consisting of a quantity of **10 or more units** is treated as a Bulk Order and cannot be cancelled, modified, or refunded under any circumstances once placed.
        </p>

        <h2 className="font-serif-editorial text-lg text-brand-green font-bold mt-6">
          4. Limitation of Liability
        </h2>
        <p>
          ShubhMewa operates under Madhya Pradesh food hygiene guidelines. Sourced items are packaged hygienically; however, customers must check allergen details (such as nut allergies) before usage.
        </p>
      </div>
    </div>
  );
}
