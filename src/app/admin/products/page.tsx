import React from "react";
import { PRODUCTS, CATEGORIES } from "@/lib/static-data";
import ProductsManager from "@/components/ProductsManager";

export const revalidate = 0; // Dynamic server-side rendering

export default async function AdminProductsPage() {
  const categories = CATEGORIES;
  const products = PRODUCTS.map((p) => ({
    ...p,
    category: CATEGORIES.find((c) => c.id === p.categoryId) || { name: "General" }
  }));

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className="font-serif-editorial text-3xl text-brand-green font-bold">
          Products Inventory
        </h1>
        <p className="text-xs text-brand-muted mt-1 leading-relaxed">
          Manage dry fruits details, variations, discounts, stock levels, and toggle visibility indicators.
        </p>
      </div>

      <ProductsManager initialProducts={products as any} categories={categories as any} />
    </div>
  );
}
