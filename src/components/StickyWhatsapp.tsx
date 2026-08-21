"use client";

import React from "react";
import { MessageSquare, PhoneCall } from "lucide-react";
import Link from "next/link";

interface StickyWhatsappProps {
  settings: Record<string, string>;
}

export default function StickyWhatsapp({ settings }: StickyWhatsappProps) {
  const whatsappNumber = settings["whatsapp_number"] || "919876543210";
  const contactPhone = settings["contact_phone"] || "+91 98765 43210";

  // Raw number for phone link
  const rawPhone = contactPhone.replace(/[^\d+]/g, "");

  return (
    <>
      {/* Desktop Floating WhatsApp Button */}
      <div className="hidden md:block fixed bottom-6 right-6 z-40 font-sans">
        <Link
          href={`https://wa.me/${whatsappNumber}?text=Hello!%20I%20am%20interested%20in%20ordering%20premium%20dry%20fruits.`}
          target="_blank"
          className="flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white px-5 py-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 font-semibold text-sm tracking-wide"
        >
          <MessageSquare className="w-5 h-5 fill-current" />
          <span>Quick WhatsApp Order</span>
        </Link>
      </div>

      {/* Mobile Sticky CTA Bar (WhatsApp & Call) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xs border-t border-brand-cream-dark/30 grid grid-cols-2 p-3 gap-3 shadow-2xl font-sans">
        <Link
          href={`tel:${rawPhone}`}
          className="flex items-center justify-center gap-2 border border-brand-green text-brand-green py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all active:bg-brand-cream-light"
        >
          <PhoneCall className="w-4 h-4 text-brand-gold" />
          <span>Call Shop</span>
        </Link>

        <Link
          href={`https://wa.me/${whatsappNumber}?text=Hello!%20I%20would%20like%20to%20order%20premium%20dry%20fruits.`}
          target="_blank"
          className="flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all active:opacity-90 shadow-md"
        >
          <MessageSquare className="w-4 h-4 fill-current text-brand-cream-light" />
          <span>WhatsApp Us</span>
        </Link>
      </div>
    </>
  );
}
