import React from "react";
import { prisma } from "@/lib/prisma";
import ProductCard, { ProductWithDetails } from "@/components/ProductCard";
import HamperBuilder from "@/components/HamperBuilder";

export const revalidate = 0; // Dynamic server-side rendering

export default async function GiftingPage() {
  // Query all gift hampers products
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      category: { slug: "hampers" }
    },
    include: {
      images: { orderBy: { displayOrder: "asc" } },
      variants: { orderBy: { weight: "asc" } },
    },
  });

  const settingsList = await prisma.websiteSetting.findMany({
    where: { key: "whatsapp_number" }
  });
  
  const whatsappNumber = settingsList[0]?.value || "919876543210";

  return (
    <div className="w-full bg-brand-cream-light/30 min-h-screen py-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto">
          <span className="text-[10px] tracking-widest font-bold uppercase text-brand-gold">Luxury Gifting</span>
          <h1 className="font-serif-editorial text-4xl text-brand-green font-bold mt-2">
            Curated Gift Hampers
          </h1>
          <div className="h-[1px] w-20 bg-brand-gold mx-auto mt-3" />
          <p className="text-xs text-brand-muted mt-4 leading-relaxed">
            Elegant, handcrafted hampers packed with premium nuts, saffron, and sweet dates. Complete with gold detailing and custom laser-engraved motifs.
          </p>
        </div>

        {/* Premade Hampers Grid */}
        <div className="space-y-6">
          <h2 className="font-serif-editorial text-2xl text-brand-green font-bold text-center">
            Our Signature Hamper Collection
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((hamper) => (
              <ProductCard
                key={hamper.id}
                product={hamper as unknown as ProductWithDetails}
                whatsappNumber={whatsappNumber}
              />
            ))}
          </div>
        </div>

        {/* Custom Hamper Builder Section */}
        <div className="space-y-6 pt-10 border-t border-brand-cream-dark/20">
          <div className="text-center max-w-lg mx-auto">
            <h2 className="font-serif-editorial text-2xl text-brand-green font-bold">
              Custom Hamper Atelier
            </h2>
            <p className="text-xs text-brand-muted mt-1 leading-relaxed">
              Curate a bespoke presentation by choosing custom outer packaging boxes and premium filling combinations.
            </p>
          </div>
          <HamperBuilder whatsappNumber={whatsappNumber} />
        </div>
      </div>
    </div>
  );
}
