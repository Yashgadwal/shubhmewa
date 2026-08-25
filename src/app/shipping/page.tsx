import React from "react";

export default function ShippingPolicyPage() {
  return (
    <div className="w-full bg-brand-cream-light/30 min-h-screen py-16 font-sans">
      <div className="max-w-2xl mx-auto px-4 bg-white border border-brand-cream-dark/30 p-8 md:p-12 rounded-3xl shadow-xs space-y-6 text-xs text-brand-muted leading-relaxed">
        <h1 className="font-serif-editorial text-3xl text-brand-green font-bold border-b border-brand-cream-dark/20 pb-4">
          Shipping & Delivery Policy
        </h1>
        <p className="text-[10px] text-brand-gold uppercase tracking-wider font-bold">
          Local Delivery & Outstation Shipping Rates
        </p>

        <h2 className="font-serif-editorial text-lg text-brand-green font-bold mt-6">
          1. Ujjain Local Delivery
        </h2>
        <p>
          We provide same-day or next-day home delivery across Ujjain, Madhya Pradesh. Orders placed before **05:00 PM** are dispatched and delivered same-day. Orders placed after **05:00 PM** are processed on the next business day.
        </p>
        <p>
          - **Free Shipping Threshold**: Orders above **₹399** qualify for free home delivery.
          - **Standard Delivery Charge**: Orders below ₹399 carry a flat local delivery fee of **₹40**.
        </p>

        <h2 className="font-serif-editorial text-lg text-brand-green font-bold mt-6">
          2. Madhya Pradesh Shipping
        </h2>
        <p>
          For orders within Madhya Pradesh (outside Ujjain), standard shipping takes **24-48 Hours** in transit.
        </p>
        <p>
          - **Free Shipping Threshold**: Orders above **₹399** qualify for free shipping.
          - **Standard Delivery Charge**: Orders below ₹399 carry a flat shipping fee of **₹60**.
        </p>

        <h2 className="font-serif-editorial text-lg text-brand-green font-bold mt-6">
          3. Pan-India Shipping
        </h2>
        <p>
          For orders outside Madhya Pradesh, we ship via standard courier services. Delivery timeline takes **4-6 days** depending on the destination.
        </p>
        <p>
          - **Free Shipping Threshold**: Orders above **₹399** qualify for free shipping.
          - **Standard Delivery Charge**: Orders below ₹399 carry a flat shipping fee of **₹90**.
        </p>

        <h2 className="font-serif-editorial text-lg text-brand-green font-bold mt-6">
          4. Custom Gifting Hampers Lead Time
        </h2>
        <p>
          Customized wedding favors and premium celebration boxes have a minimum lead time of **7-10 days** from design sign-off to packaging.
        </p>
      </div>
    </div>
  );
}
