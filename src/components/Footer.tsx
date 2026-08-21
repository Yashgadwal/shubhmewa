"use client";

import React from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

interface FooterProps {
  settings: Record<string, string>;
}

export default function Footer({ settings }: FooterProps) {
  const storeName = settings["store_name"] || "Harshil Dry Fruits";
  const whatsappNumber = settings["whatsapp_number"] || "919876543210";
  const email = settings["contact_email"] || "info@harshildryfruits.com";
  const phone = settings["contact_phone"] || "+91 98765 43210";
  const address = settings["store_address"] || "12, Freeganj Main Road, Opp. Gold Gym, Ujjain, Madhya Pradesh - 456001";
  const timings = settings["store_timings"] || "10:00 AM - 09:30 PM (All Days Open)";
  const mapsLink = settings["google_maps_link"] || "https://maps.google.com/?q=Freeganj+Ujjain";
  const instagram = settings["instagram_link"] || "https://instagram.com/harshildryfruits";
  const credit = settings["footer_credit"] || "Designed and Powered by Nexora Scale";

  return (
    <footer className="w-full bg-brand-green text-brand-cream-light border-t border-brand-gold/20 pt-16 pb-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        
        {/* About Column */}
        <div className="space-y-4">
          <Link href="/" className="flex flex-col">
            <span className="font-serif-editorial text-2xl font-bold tracking-wide text-brand-cream-light uppercase leading-none">
              {storeName}
            </span>
            <span className="text-[9px] uppercase tracking-widest text-brand-gold mt-1 font-semibold">
              Premium Quality
            </span>
          </Link>
          <p className="text-xs text-brand-cream-light/75 leading-relaxed max-w-xs pt-2">
            Providing Ujjain and surrounding regions with carefully selected dry fruits, organic seeds, high-grade spices, and customized hampers since our founding. Quality, hygiene, and freshness guaranteed.
          </p>
          <div className="flex gap-4 pt-2">
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
          <h4 className="font-serif-editorial text-brand-gold text-base font-semibold tracking-wider">
            Quick Links
          </h4>
          <ul className="space-y-2 text-xs text-brand-cream-light/80">
            <li>
              <Link href="/shop" className="hover:text-brand-gold transition-colors">Shop Catalog</Link>
            </li>
            <li>
              <Link href="/gifting" className="hover:text-brand-gold transition-colors">Gift Hampers</Link>
            </li>
            <li>
              <Link href="/wedding" className="hover:text-brand-gold transition-colors">Wedding Orders</Link>
            </li>
            <li>
              <Link href="/corporate" className="hover:text-brand-gold transition-colors">Corporate Gifting</Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-brand-gold transition-colors">Health Blog</Link>
            </li>
            <li>
              <Link href="/track" className="hover:text-brand-gold transition-colors">Track Enquiry</Link>
            </li>
            <li>
              <Link href="/admin/login" className="hover:text-brand-gold transition-colors">Admin Login</Link>
            </li>
          </ul>
        </div>

        {/* Store Timings & Delivery Info */}
        <div className="space-y-4">
          <h4 className="font-serif-editorial text-brand-gold text-base font-semibold tracking-wider">
            Store Hours & Delivery
          </h4>
          <div className="space-y-3 text-xs text-brand-cream-light/80">
            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-brand-gold mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-brand-cream-light">Operating Timings</p>
                <p className="text-[11px] text-brand-cream-light/70">{timings}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-brand-gold mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-brand-cream-light">Local Home Delivery</p>
                <p className="text-[11px] text-brand-cream-light/70">
                  Ujjain local delivery within 4-6 hours. Free delivery on orders above ₹999.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Column */}
        <div className="space-y-4">
          <h4 className="font-serif-editorial text-brand-gold text-base font-semibold tracking-wider">
            Contact Us
          </h4>
          <div className="space-y-3 text-xs text-brand-cream-light/80">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-brand-gold mt-0.5 shrink-0" />
              <Link href={mapsLink} target="_blank" className="hover:underline transition-all">
                {address}
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-brand-gold shrink-0" />
              <Link href={`tel:${phone}`} className="hover:underline transition-all">{phone}</Link>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-brand-gold shrink-0" />
              <Link href={`mailto:${email}`} className="hover:underline transition-all">{email}</Link>
            </div>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-16 pt-8 border-t border-brand-cream-dark/20 text-center space-y-4">
        {/* Policy Links */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[10px] uppercase tracking-widest text-brand-cream-light/60 font-semibold">
          <Link href="/privacy-policy" className="hover:text-brand-gold transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-brand-gold transition-colors">Terms & Conditions</Link>
          <Link href="/shipping" className="hover:text-brand-gold transition-colors">Shipping Policy</Link>
          <Link href="/refunds" className="hover:text-brand-gold transition-colors">Refunds & Cancellation</Link>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-brand-cream-light/45 gap-4">
          <p>© {new Date().getFullYear()} {storeName}. All rights reserved.</p>
          <p className="text-[10px] tracking-wider uppercase font-semibold text-brand-gold/60">
            {credit}
          </p>
        </div>
      </div>
    </footer>
  );
}
