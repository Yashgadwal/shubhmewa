import React from "react";

export default function ShippingPolicyPage() {
  return (
    <div className="w-full bg-brand-cream-light/30 min-h-screen py-16 font-sans">
      <div className="max-w-2xl mx-auto px-4 bg-white border border-brand-cream-dark/30 p-8 md:p-12 rounded-3xl shadow-xs space-y-6 text-xs text-brand-muted leading-relaxed">
        <h1 className="font-serif-editorial text-3xl text-brand-green font-bold border-b border-brand-cream-dark/20 pb-4">
          Shipping & Delivery Policy
        </h1>
        <p className="text-[10px] text-brand-gold uppercase tracking-wider font-bold">
          Local Delivery & Outstation Shipping
        </p>

        <h2 className="font-serif-editorial text-lg text-brand-green font-bold mt-6">
          1. Ujjain Local Home Delivery
        </h2>
        <p>
          We provide same-day home delivery across Ujjain, Madhya Pradesh. Orders placed before **06:00 PM** are dispatched and delivered within **4-6 hours**. 
        </p>
        <p>
          - **Free Shipping Threshold**: Orders above **₹999** qualify for free home delivery.
          - **Standard Delivery Charge**: Orders below ₹999 carry a flat local delivery fee of **₹50**.
        </p>

        <h2 className="font-serif-editorial text-lg text-brand-green font-bold mt-6">
          2. Outstation Gifting Orders
        </h2>
        <p>
          For orders outside Ujjain, we ship via standard courier services (Blue Dart, Delhivery). Delivery timeline takes **3-5 business days** depending on the location in India.
        </p>

        <h2 className="font-serif-editorial text-lg text-brand-green font-bold mt-6">
          3. Bulk Gifting Hampers Lead Time
        </h2>
        <p>
          Customized wedding favors and corporate engraving orders have a minimum lead time of **7-10 days** from design sign-off.
        </p>
      </div>
    </div>
  );
}
