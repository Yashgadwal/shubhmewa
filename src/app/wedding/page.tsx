import React from "react";
import { prisma } from "@/lib/prisma";
import BulkOrderForm from "@/components/BulkOrderForm";

export const revalidate = 0; // Dynamic server-side rendering

export default async function WeddingGiftingPage() {
  const settingsList = await prisma.websiteSetting.findMany({
    where: { key: "whatsapp_number" }
  });
  
  const whatsappNumber = settingsList[0]?.value || "919876543210";

  return (
    <div className="w-full bg-brand-cream-light/30 min-h-screen py-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column: Brand content */}
        <div className="lg:col-span-5 space-y-6">
          <span className="text-[10px] tracking-widest font-bold uppercase text-brand-gold">Royal Favours</span>
          <h1 className="font-serif-editorial text-4xl text-brand-green font-bold leading-tight">
            Exquisite Gifting for Indian Weddings
          </h1>
          <div className="h-[1px] w-20 bg-brand-gold mt-2" />
          <p className="text-xs text-brand-muted leading-relaxed">
            Welcome your guests and distribute wedding invitation favors with premium dry fruit hampers from Harshil Dry Fruits. Our customized return gift boxes represent elegance and tradition.
          </p>

          {/* Visual Presentation */}
          <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-sm border border-brand-cream-dark/30">
            <img
              src="/images/hamper_wedding.jpg"
              alt="Indian Wedding Dry Fruit Favor Box"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-4 pt-2 text-xs text-brand-green font-semibold">
            <div className="flex gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-gold shrink-0 mt-1.5" />
              <span>Laser-carved premium wooden boxes with custom family monograms.</span>
            </div>
            <div className="flex gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-gold shrink-0 mt-1.5" />
              <span>Designer velvet pouches filled with select jumbo almonds & saffron.</span>
            </div>
            <div className="flex gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-gold shrink-0 mt-1.5" />
              <span>Hygienic processing and packaging with long-lasting freshness.</span>
            </div>
          </div>
        </div>

        {/* Right Column: Lead Form */}
        <div className="lg:col-span-7">
          <div className="bg-white p-2 rounded-3xl border border-brand-cream-dark/20 shadow-xs">
            <BulkOrderForm whatsappNumber={whatsappNumber} />
          </div>
        </div>

      </div>
    </div>
  );
}
