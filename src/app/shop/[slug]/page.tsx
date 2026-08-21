import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
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

  // Query product details from database
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { displayOrder: "asc" } },
      variants: { orderBy: { weight: "asc" } },
      category: true,
    },
  });

  if (!product) {
    notFound();
  }

  // Fetch related products in the same category
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      isActive: true,
    },
    include: {
      images: { orderBy: { displayOrder: "asc" } },
      variants: { orderBy: { weight: "asc" } },
    },
    take: 4,
  });

  const settingsList = await prisma.websiteSetting.findMany({
    where: { key: "whatsapp_number" }
  });
  
  const whatsappNumber = settingsList[0]?.value || "919876543210";

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
