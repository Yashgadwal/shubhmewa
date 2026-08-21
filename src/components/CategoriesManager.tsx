"use client";

import React, { useState } from "react";
import { Trash2, AlertTriangle, Check } from "lucide-react";
import { deleteCategory } from "@/lib/actions";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  displayOrder: number;
}

interface CategoriesManagerProps {
  initialCategories: Category[];
}

export default function CategoriesManager({ initialCategories }: CategoriesManagerProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category? Make sure no products are currently linked to it.")) return;
    setDeletingId(id);
    const res = await deleteCategory(id);
    setDeletingId(null);

    if (res.success) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } else {
      alert(res.error || "Failed to delete category.");
    }
  };

  return (
    <div className="bg-white border border-brand-cream-dark/30 rounded-2xl overflow-hidden shadow-xs font-sans">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-brand-cream-light/40 text-brand-green font-bold uppercase tracking-wider border-b border-brand-cream-dark/20">
              <th className="p-4">Thumbnail</th>
              <th className="p-4">Category Name</th>
              <th className="p-4">URL Slug</th>
              <th className="p-4">Description</th>
              <th className="p-4 text-center">Display Order</th>
              <th className="p-4 text-right">Delete</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-brand-muted">
                  No categories defined.
                </td>
              </tr>
            ) : (
              categories.map((cat) => {
                const isDeleting = deletingId === cat.id;
                return (
                  <tr
                    key={cat.id}
                    className={`border-b border-brand-cream-light/35 hover:bg-brand-cream-light/10 ${
                      isDeleting ? "opacity-50" : ""
                    }`}
                  >
                    <td className="p-4">
                      <img
                        src={cat.image || "/images/product_almond.jpg"}
                        alt={cat.name}
                        className="w-12 h-9 object-cover rounded border border-brand-cream-dark/20"
                      />
                    </td>
                    <td className="p-4 font-bold text-brand-green">{cat.name}</td>
                    <td className="p-4 text-brand-gold font-semibold uppercase">{cat.slug}</td>
                    <td className="p-4 text-brand-muted max-w-xs truncate">{cat.description || "N/A"}</td>
                    <td className="p-4 text-center font-semibold text-brand-green">{cat.displayOrder}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDelete(cat.id)}
                        disabled={isDeleting}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors inline-flex items-center gap-1 font-semibold"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
