import React from "react";
import { CATEGORIES } from "@/lib/static-data";
import CategoriesManager from "@/components/CategoriesManager";

export const revalidate = 0; // Dynamic server-side rendering

export default async function AdminCategoriesPage() {
  const categories = CATEGORIES;

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className="font-serif-editorial text-3xl text-brand-green font-bold">
          Categories Manager
        </h1>
        <p className="text-xs text-brand-muted mt-1 leading-relaxed">
          Manage product categories, customize display order, and review descriptions.
        </p>
      </div>

      <CategoriesManager initialCategories={categories as any} />
    </div>
  );
}
