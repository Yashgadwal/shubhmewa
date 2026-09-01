import React from "react";

export default function ShippingPolicyPage() {
  return (
    <div className="w-full bg-brand-cream-light/30 min-h-screen py-16 font-sans">
      <div className="max-w-2xl mx-auto px-4 bg-white border border-brand-cream-dark/30 p-8 md:p-12 rounded-3xl shadow-xs space-y-6 text-xs text-brand-muted leading-relaxed">
        <h1 className="font-serif-editorial text-3xl text-brand-green font-bold border-b border-brand-cream-dark/20 pb-4">
          Shipping & Delivery Policy
        </h1>
        <div className="inline-block bg-brand-gold/10 text-brand-gold border border-brand-gold/30 px-3 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider">
          Effective: September 2026
        </div>

        <h2 className="font-serif-editorial text-lg text-brand-green font-bold mt-6">
          1. Ujjain Local Delivery (Active Now)
        </h2>
        <p>
          We provide guaranteed same-day or next-day home delivery across Ujjain, Madhya Pradesh. Orders placed before **05:00 PM** are dispatched and delivered same-day. Orders placed after **05:00 PM** are processed on the next business day.
        </p>
        <p>
          - **Free Delivery Threshold**: Orders of **₹399/-** and above qualify for **100% Free Delivery**.
          <br />
          - **Standard Local Delivery Charge**: Orders below ₹399/- carry a flat fee of **₹40/-**.
          <br />
          - **Delivery Timeline**: Within **24 Hours** (Same-Day / Next-Day).
        </p>

        <h2 className="font-serif-editorial text-lg text-brand-green font-bold mt-6">
          2. Delivery Area & 1st Month Restriction
        </h2>
        <div className="p-4 bg-amber-50 border border-amber-200/70 rounded-2xl text-amber-900 space-y-2">
          <p className="font-bold">⚠️ Notice for Outside-Ujjain Customers:</p>
          <p className="italic">
            “Currently, we are delivering only in Ujjain. We will start accepting orders from your location next month.”
          </p>
          <p className="text-[11px]">
            For the first month, our delivery operations are exclusively serving Ujjain District. Outside-Ujjain locations are marked as "Not Deliverable in Your Location" during this launch phase.
          </p>
        </div>

        <h2 className="font-serif-editorial text-lg text-brand-green font-bold mt-6">
          3. Outside Ujjain Expansion (Starting within 2 Months)
        </h2>
        <p>
          For locations outside Ujjain District across Madhya Pradesh and Pan-India:
        </p>
        <p>
          - **Launch Timeline**: Delivery will start **within 2 months**.
          <br />
          - **Free Shipping Threshold**: Orders of **₹599/-** and above will qualify for **Free Shipping**.
          <br />
          - **Delivery Transit Time**: **48–72 Hours** via express courier partners.
          <br />
          - **Standard Shipping Fee**: Orders below ₹599/- will carry a flat shipping charge of ₹90/-.
        </p>

        <h2 className="font-serif-editorial text-lg text-brand-green font-bold mt-6">
          4. Packaging & Quality Assurance
        </h2>
        <p>
          Every order is vacuum-packed and sealed in protective food-grade outer boxes to guarantee that your nuts, seeds, and spices arrive in fresh condition.
        </p>
      </div>
    </div>
  );
}
