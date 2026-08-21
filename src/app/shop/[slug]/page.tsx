import React from "react";
import { notFound } from "next/navigation";
import { PRODUCTS, CATEGORIES, DEFAULT_SETTINGS } from "@/lib/static-data";
import ProductDetailsView from "@/components/ProductDetailsView";

export const revalidate = 0; // Dynamic server-side rendering

interface ProductDetailsPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductDetailsPage({ params }: ProductDetailsPageProps) {
  // Resolve params promise in Next.js 15
  const { slug } = await params;

  // Find static product details
  const staticProduct = PRODUCTS.find((p) => p.slug === slug);

  if (!staticProduct) {
    notFound();
  }

  const product = {
    ...staticProduct,
    category: {
      name: CATEGORIES.find((c) => c.id === staticProduct.categoryId)?.name || "General",
      slug: CATEGORIES.find((c) => c.id === staticProduct.categoryId)?.slug || "general"
    }
  };

  // Find related products
  const relatedProducts = PRODUCTS.filter(
    (p) => p.categoryId === staticProduct.categoryId && p.id !== staticProduct.id
  ).slice(0, 4);

  const whatsappNumber = DEFAULT_SETTINGS["whatsapp_number"] || "919876543210";

  return (
    <div className="w-full bg-brand-cream-light/30 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <ProductDetailsView
          product={product as any}
          relatedProducts={relatedProducts as any}
          whatsappNumber={whatsappNumber}
        />
      </div>
    </div>
  );
}
