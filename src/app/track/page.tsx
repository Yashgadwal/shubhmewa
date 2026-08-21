import React from "react";
import TrackingView from "@/components/TrackingView";

export default function TrackPage() {
  return (
    <div className="w-full bg-brand-cream-light/30 min-h-screen py-16 font-sans">
      <div className="max-w-xl mx-auto px-4 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="text-[10px] tracking-widest font-bold uppercase text-brand-gold">Status Check</span>
          <h1 className="font-serif-editorial text-4xl text-brand-green font-bold">
            Track Order & Enquiry
          </h1>
          <div className="h-[1px] w-20 bg-brand-gold mx-auto mt-3" />
          <p className="text-xs text-brand-muted max-w-xs mx-auto mt-2 leading-relaxed">
            Enter your order number or phone number to check current dispatch or hamper proposal status.
          </p>
        </div>

        <TrackingView />
      </div>
    </div>
  );
}
