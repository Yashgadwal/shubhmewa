import React from "react";
import { prisma } from "@/lib/prisma";
import ShopCatalog from "@/components/ShopCatalog";

export const revalidate = 0; // Dynamic server-side rendering

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
    bestseller?: string;
  }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  // Resolve searchParams promise in Next.js 15
  const params = await searchParams;
  const initialCategory = params.category || "";
  const filterBestseller = params.bestseller === "true";

  // Fetch products and categories
  const [products, categories, settingsList] = await Promise.all([
    prisma.product.findMany({
      where: { isActive: true },
      include: {
        images: { orderBy: { displayOrder: "asc" } },
        variants: { orderBy: { weight: "asc" } },
      },
      orderBy: { displayOrder: "asc" },
    }),
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: "asc" },
    }),
    prisma.websiteSetting.findMany({
      where: { key: "whatsapp_number" }
    }),
  ]);

  const whatsappNumber = settingsList[0]?.value || "919876543210";

  return (
    <div className="w-full bg-brand-cream-light/30 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-8">
        <div>
          <h1 className="font-serif-editorial text-4xl text-brand-green font-bold">
            Explore Gourmet Collection
          </h1>
          <p className="text-xs text-brand-muted mt-1 leading-relaxed">
            Hygienically sorted almonds, cashews, raisins, seeds, spices, and custom gift hampers in Ujjain.
          </p>
        </div>

        <ShopCatalog
          products={products as any}
          categories={categories as any}
          whatsappNumber={whatsappNumber}
          initialCategory={initialCategory}
          filterBestseller={filterBestseller}
        />
      </div>
    </div>
  );
}
