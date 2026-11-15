import React from "react";
import { notFound } from "next/navigation";
import { PRODUCTS, CATEGORIES, DEFAULT_SETTINGS } from "@/lib/static-data";
import ProductDetailsView from "@/components/ProductDetailsView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Live Payment Test Product (₹1) | ShubhMewa",
  description: "Test live Razorpay payment gateway integration, UPI/Cards checkout, and instant order placement for ₹1 with zero shipping fee.",
};

export default function DummyProductPage() {
  const staticProduct = PRODUCTS.find((p) => p.slug === "dummy-product");

  if (!staticProduct) {
    notFound();
  }

  const product = {
    ...staticProduct,
    category: {
      name: CATEGORIES.find((c) => c.id === staticProduct.categoryId)?.name || "Test Gateway",
      slug: CATEGORIES.find((c) => c.id === staticProduct.categoryId)?.slug || "test-gateway"
    }
  };

  const relatedProducts = PRODUCTS.filter(
    (p) => p.id !== staticProduct.id
  ).slice(0, 4);

  const whatsappNumber = DEFAULT_SETTINGS["whatsapp_number"] || "919876543210";

  return (
    <div className="w-full bg-brand-cream-light/30 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Test Notice Banner */}
        <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🧪</span>
            <div>
              <p className="font-bold text-sm">Live Payment Gateway Test Product</p>
              <p className="text-xs text-amber-700">Priced at exactly ₹1 with Free Shipping for verifying live Razorpay checkout, UPI payments, and order tracking.</p>
            </div>
          </div>
          <span className="px-3 py-1 bg-amber-200/60 text-amber-900 text-xs font-bold rounded-full uppercase tracking-wider">
            Test Item
          </span>
        </div>

        <ProductDetailsView
          product={product as any}
          relatedProducts={relatedProducts as any}
          whatsappNumber={whatsappNumber}
        />
      </div>
    </div>
  );
}
