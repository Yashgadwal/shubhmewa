"use client";

import React from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, MessageSquare, Sparkles } from "lucide-react";

interface FooterProps {
  settings: Record<string, string>;
}

export default function Footer({ settings }: FooterProps) {
  const whatsappNumber = settings["whatsapp_number"] || "8982010210";
  const email = settings["contact_email"] || "info@shubhmewa.com";
  const phone = settings["contact_phone"] || "8982010210";
  const address = settings["store_address"] || "Shop No. 5, Gali No. 4, Tilak Marg, Dev Sahab Ki Gali, Fawara Chowk, Daulat Ganj, Ujjain, Madhya Pradesh";
  const mapsLink = settings["google_maps_link"] || "https://maps.google.com/?q=Shop+No.+5,+Gali+No.+4,+Tilak+Marg,+Fawara+Chowk,+Daulat+Ganj,+Ujjain";
  const instagram = settings["instagram_link"] || "https://instagram.com/shubhmewa";
  const credit = settings["footer_credit"] || "Designed and Powered by ShubhMewa";

  return (
    <footer className="w-full bg-brand-green text-brand-cream-light border-t border-brand-gold/20 pt-16 pb-8 font-sans">
      
      {/* Coming Soon E-Commerce Platforms Banner */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mb-12">
        <div className="bg-brand-cream-light/10 border border-brand-gold/30 rounded-2xl p-5 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-brand-gold text-[10px] uppercase font-bold tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Expanding Pan-India</span>
            </div>
            <p className="font-serif-editorial text-lg md:text-xl font-bold text-brand-cream-light">
              Coming Soon on Amazon, Flipkart, Meesho & Other E-commerce Platforms
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider">
            <span className="px-3.5 py-1.5 rounded-lg bg-white/10 text-brand-cream-light border border-white/20">Amazon</span>
            <span className="px-3.5 py-1.5 rounded-lg bg-white/10 text-brand-cream-light border border-white/20">Flipkart</span>
            <span className="px-3.5 py-1.5 rounded-lg bg-white/10 text-brand-cream-light border border-white/20">Meesho</span>
            <span className="px-3.5 py-1.5 rounded-lg bg-brand-gold/20 text-brand-gold border border-brand-gold/40">Quick-Commerce</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        
        {/* Branding & Contact Info */}
        <div className="space-y-5">
          <Link href="/" className="flex flex-col">
            <span className="font-serif-editorial text-2xl font-bold tracking-wide text-brand-cream-light uppercase leading-none">
              <span className="text-brand-cream-light">Shubh</span>
              <span className="text-brand-gold">Mewa</span>
            </span>
            <span className="text-[9px] uppercase tracking-widest text-brand-gold mt-1 font-semibold">
              Premium Quality
            </span>
          </Link>
          <p className="text-xs text-brand-cream-light/75 leading-relaxed">
            Premium Dry Fruits • Makhana • Spices • Healthy Seeds. Sourced with trust, packed fresh, and delivered with care.
          </p>
          <div className="flex gap-4 pt-1">
            <Link
              href={instagram}
              target="_blank"
              className="text-brand-cream-light hover:text-brand-gold transition-colors"
              aria-label="Instagram"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </Link>
          </div>
        </div>

        {/* Quick Links Column */}
        <div className="space-y-4">
          <h4 className="font-serif-editorial text-brand-gold text-sm font-bold uppercase tracking-widest">
            Quick Links
          </h4>
          <ul className="space-y-2.5 text-xs text-brand-cream-light/80">
            <li>
              <Link href="/" className="hover:text-brand-gold transition-colors">Home</Link>
            </li>
            <li>
              <Link href="/shop" className="hover:text-brand-gold transition-colors">All Products</Link>
            </li>
            <li>
              <Link href="/shop?category=dry-fruits" className="hover:text-brand-gold transition-colors">Dry Fruits</Link>
            </li>
            <li>
              <Link href="/shop?category=spices" className="hover:text-brand-gold transition-colors">Masala & Spices</Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-brand-gold transition-colors">About Us</Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-brand-gold transition-colors">Contact</Link>
            </li>
          </ul>
        </div>

        {/* Customer Support Column */}
        <div className="space-y-4">
          <h4 className="font-serif-editorial text-brand-gold text-sm font-bold uppercase tracking-widest">
            Customer Support & Policies
          </h4>
          <ul className="space-y-2.5 text-xs text-brand-cream-light/80">
            <li>
              <Link href={`https://wa.me/${whatsappNumber}`} target="_blank" className="hover:text-brand-gold transition-colors flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
                <span>WhatsApp Support ({whatsappNumber})</span>
              </Link>
            </li>
            <li>
              <Link href="/shipping" className="hover:text-brand-gold transition-colors">Delivery & Shipping (Ujjain ₹399 Free)</Link>
            </li>
            <li>
              <Link href="/refunds" className="hover:text-brand-gold transition-colors">Full Refund & Replacement Policy</Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-brand-gold transition-colors">Terms of Service</Link>
            </li>
            <li>
              <Link href="/track" className="hover:text-brand-gold transition-colors">Track Your Order</Link>
            </li>
          </ul>
        </div>

        {/* Store Location Info */}
        <div className="space-y-4">
          <h4 className="font-serif-editorial text-brand-gold text-sm font-bold uppercase tracking-widest">
            Boutique Store
          </h4>
          <div className="space-y-3.5 text-xs text-brand-cream-light/80">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
              <Link href={mapsLink} target="_blank" className="hover:underline transition-all leading-relaxed">
                {address}
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-brand-gold shrink-0" />
              <Link href={`tel:${phone}`} className="hover:underline transition-all">📲 {phone}</Link>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-brand-gold shrink-0" />
              <Link href={`mailto:${email}`} className="hover:underline transition-all">{email}</Link>
            </div>
          </div>
        </div>

      </div>

      {/* Policies bottom row */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-12 pt-8 border-t border-brand-cream-dark/20 text-center space-y-4">
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[10px] uppercase tracking-widest text-brand-cream-light/60 font-semibold">
          <Link href="/privacy-policy" className="hover:text-brand-gold transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-brand-gold transition-colors">Terms & Conditions</Link>
          <Link href="/shipping" className="hover:text-brand-gold transition-colors">Shipping Policy</Link>
          <Link href="/refunds" className="hover:text-brand-gold transition-colors">Full Refund & Replacement</Link>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-brand-cream-light/45 gap-4">
          <p>© {new Date().getFullYear()} SHUBHMEWA. All rights reserved.</p>
          <p className="text-[10px] tracking-wider uppercase font-semibold text-brand-gold/60">
            {credit}
          </p>
        </div>
      </div>
    </footer>
  );
}
