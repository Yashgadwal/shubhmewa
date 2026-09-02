import React from "react";

export default function PrivacyPolicyPage() {
  return (
    <div className="w-full bg-brand-cream-light/30 min-h-screen py-16 font-sans">
      <div className="max-w-2xl mx-auto px-4 bg-white border border-brand-cream-dark/30 p-8 md:p-12 rounded-3xl shadow-xs space-y-6 text-xs text-brand-muted leading-relaxed">
        <h1 className="font-serif-editorial text-3xl text-brand-green font-bold border-b border-brand-cream-dark/20 pb-4">
          Privacy Policy
        </h1>
        <p className="text-[10px] text-brand-gold uppercase tracking-wider font-bold">
          Last Updated: August 2026
        </p>

        <p>
          At **ShubhMewa**, we prioritize your privacy. This Privacy Policy details how we collect, use, and safeguard the information you provide when using our website or placing orders through our cart-to-WhatsApp channels.
        </p>
        
        <h2 className="font-serif-editorial text-lg text-brand-green font-bold mt-6">
          1. Information We Collect
        </h2>
        <p>
          We collect basic identifiers necessary to process order delivery:
          - Contact Information: Full name, phone number, WhatsApp number, and delivery address.
          - Usage Data: Information on products viewed, cart selections, and coupon check history.
        </p>

        <h2 className="font-serif-editorial text-lg text-brand-green font-bold mt-6">
          2. How We Use Your Information
        </h2>
        <p>
          Your details are utilized to:
          - Process and dispatch dry fruit and healthy snack orders.
          - Pre-fill WhatsApp checkout texts and order updates.
          - Record customer orders, surprise gifts, and inquiries.
        </p>

        <h2 className="font-serif-editorial text-lg text-brand-green font-bold mt-6">
          3. Sourcing Data Protection
        </h2>
        <p>
          We store all data in local secure records, accessible only by verified store administrators. We do not sell or lease customer numbers or emails to third-party marketing services.
        </p>

        <p className="pt-6">
          For any clarifications regarding your details, contact our customer operations team in Ujjain at info@shubhmewa.com.
        </p>
      </div>
    </div>
  );
}
