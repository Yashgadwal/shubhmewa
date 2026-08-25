import React from "react";
import Link from "next/link";
import { Sparkles, ShieldCheck, HeartPulse } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="w-full bg-brand-cream-light/30 min-h-screen py-16 font-sans">
      <div className="max-w-4xl mx-auto px-4 md:px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="text-[10px] tracking-widest font-bold uppercase text-brand-gold">Our Story</span>
          <h1 className="font-serif-editorial text-4xl text-brand-green font-bold">
            Legacy of Trust & Quality
          </h1>
          <div className="h-[1px] w-20 bg-brand-gold mx-auto mt-3" />
        </div>

        {/* Big image banner */}
        <div className="w-full aspect-[2/1] rounded-3xl overflow-hidden border border-brand-cream-dark/30 shadow-sm">
          <img
            src="/images/shop_interior.jpg"
            alt="ShubhMewa Store Counter"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content Editorial block */}
        <div className="space-y-6 text-xs text-brand-muted leading-relaxed">
          <h2 className="font-serif-editorial text-2xl text-brand-green font-bold">
            Bringing Nature's Finest to Ujjain
          </h2>
          <p>
            ShubhMewa was established with a singular objective: to elevate the standard of healthy snacking in Ujjain, Madhya Pradesh. In a market often saturated with low-grade or stale nuts, we committed to supplying only grade-one jumbo almonds, creamy cashews, split-free roasted pistachios, and royal dates.
          </p>
          <p>
            We believe that clean eating should be delightful and trustworthy. That is why we handpick every product, run them through two thorough cleaning and checking cycles, and vacuum-pack them to ensure the original taste, natural oils, and crispiness remain completely intact until they reach your home.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-brand-cream-dark/20 text-brand-green font-semibold">
            <div className="space-y-2">
              <div className="w-8 h-8 bg-brand-green/10 text-brand-gold rounded-full flex items-center justify-center mb-2">
                <Sparkles className="w-4 h-4" />
              </div>
              <p className="font-serif-editorial text-base font-bold">Global Sourcing</p>
              <p className="text-[11px] text-brand-muted font-normal">
                Direct imports from California farms, Iranian orchards, and the valleys of Kashmir.
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-8 h-8 bg-brand-green/10 text-brand-gold rounded-full flex items-center justify-center mb-2">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <p className="font-serif-editorial text-base font-bold">Manual Sorting</p>
              <p className="text-[11px] text-brand-muted font-normal">
                Hygienic hands-on sorting by local staff in Ujjain to separate undersized or damaged items.
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-8 h-8 bg-brand-green/10 text-brand-gold rounded-full flex items-center justify-center mb-2">
                <HeartPulse className="w-4 h-4" />
              </div>
              <p className="font-serif-editorial text-base font-bold">Freshness Locked</p>
              <p className="text-[11px] text-brand-muted font-normal">
                Packed in reusable airtight glass jars or premium paper stand-up pouches.
              </p>
            </div>
          </div>

          <p className="pt-6">
            Whether you are choosing daily healthy breakfast toppings, planning elegant wedding favor hampers, or ordering premium celebration gifts, ShubhMewa is proud to be your local trusted partner. Visit our boutique counter in Ujjain to experience our products first-hand.
          </p>
        </div>

        <div className="text-center pt-8">
          <Link
            href="/shop"
            className="bg-brand-green hover:bg-brand-green/95 text-brand-cream-light px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-md"
          >
            Explore Sourced Catalog
          </Link>
        </div>
      </div>
    </div>
  );
}
