import React from "react";
import Link from "next/link";
import { CATEGORIES } from "@/lib/static-data";

export const revalidate = 0; // Dynamic server-side rendering

export default async function CategoriesPage() {
  const categories = CATEGORIES;

  return (
    <div className="w-full bg-brand-cream-light/30 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-12">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-[10px] tracking-widest font-bold uppercase text-brand-gold">Our Assortment</span>
          <h1 className="font-serif-editorial text-4xl text-brand-green font-bold mt-2">
            Browse by Category
          </h1>
          <div className="h-[1px] w-20 bg-brand-gold mx-auto mt-3" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              className="group bg-white border border-brand-cream-dark/30 hover:border-brand-gold rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col h-full font-sans"
            >
              <div className="aspect-[4/3] bg-brand-cream-light overflow-hidden">
                <img
                  src={cat.image || "/images/product_almond.jpg"}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h2 className="font-serif-editorial text-2xl text-brand-green font-bold group-hover:text-brand-gold transition-colors">
                    {cat.name}
                  </h2>
                  <p className="text-xs text-brand-muted leading-relaxed">
                    {cat.description || `Browse our fine selection of high-grade gourmet ${cat.name.toLowerCase()} sourced with trust.`}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold tracking-wider uppercase text-brand-gold mt-6 border-b border-transparent group-hover:border-brand-gold w-fit pb-0.5 transition-all">
                  View Collection &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
