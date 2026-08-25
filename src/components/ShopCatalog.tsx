"use client";

import React, { useState, useMemo } from "react";
import { Search, Filter, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import ProductCard, { ProductWithDetails } from "./ProductCard";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ShopCatalogProps {
  products: ProductWithDetails[];
  categories: Category[];
  whatsappNumber: string;
  initialCategory: string;
  filterBestseller: boolean;
  initialQuery?: string;
}

export default function ShopCatalog({
  products,
  categories,
  whatsappNumber,
  initialCategory,
  filterBestseller,
  initialQuery = "",
}: ShopCatalogProps) {
  const [search, setSearch] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [priceRange, setPriceRange] = useState<number>(3000);
  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc" | "bestseller" | "newest">("default");
  const [onlyBestsellers, setOnlyBestsellers] = useState(filterBestseller);

  // Apply Filters
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Search filter
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                              p.description.toLowerCase().includes(search.toLowerCase());
        
        // Category filter
        const matchesCategory = selectedCategory === "" 
          ? true 
          : categories.find((c) => c.slug === selectedCategory)?.id === p.categoryId;

        // Bestseller filter
        const matchesBestseller = onlyBestsellers ? p.isBestseller : true;

        // Price filter (based on minimum price option)
        const minPrice = p.variants && p.variants.length > 0 
          ? Math.min(...p.variants.map((v) => v.discountedPrice || v.originalPrice))
          : p.discountedPrice || p.originalPrice;
        const matchesPrice = minPrice <= priceRange;

        return matchesSearch && matchesCategory && matchesBestseller && matchesPrice;
      })
      .sort((a, b) => {
        const getPrice = (p: ProductWithDetails) => p.discountedPrice || p.originalPrice;
        if (sortBy === "price-asc") {
          return getPrice(a) - getPrice(b);
        }
        if (sortBy === "price-desc") {
          return getPrice(b) - getPrice(a);
        }
        if (sortBy === "bestseller") {
          return (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0);
        }
        if (sortBy === "newest") {
          return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
        }
        return 0; // Default ordering
      });
  }, [products, categories, search, selectedCategory, priceRange, sortBy, onlyBestsellers]);

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-4 gap-8 font-sans">
      
      {/* Sidebar Filters */}
      <div className="lg:col-span-1 bg-white border border-brand-cream-dark/30 p-6 rounded-2xl h-fit space-y-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-brand-cream-dark/20 pb-4">
          <h3 className="font-serif-editorial text-lg text-brand-green font-bold flex items-center gap-2">
            <Filter className="w-4 h-4 text-brand-gold" />
            Catalog Filters
          </h3>
          <button
            onClick={() => {
              setSearch("");
              setSelectedCategory("");
              setPriceRange(3000);
              setSortBy("default");
              setOnlyBestsellers(false);
            }}
            className="text-[10px] text-brand-gold hover:underline font-bold uppercase tracking-wider"
          >
            Clear All
          </button>
        </div>

        {/* Search */}
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase tracking-wider font-semibold text-brand-green block">
            Search Collection
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search almonds, hampers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-brand-cream-dark/50 px-3.5 py-2 rounded-xl text-xs focus:outline-none focus:border-brand-gold text-brand-green bg-brand-cream-light/10 pl-9"
            />
            <Search className="w-4 h-4 text-brand-muted absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Categories Selector */}
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-wider font-semibold text-brand-green block">
            Product Category
          </label>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => setSelectedCategory("")}
              className={`text-left text-xs py-1.5 px-3 rounded-lg transition-all ${
                selectedCategory === ""
                  ? "bg-brand-green text-brand-cream-light font-semibold"
                  : "text-brand-green hover:bg-brand-cream-light/30"
              }`}
            >
              All Assortments
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`text-left text-xs py-1.5 px-3 rounded-lg transition-all ${
                  selectedCategory === cat.slug
                    ? "bg-brand-green text-brand-cream-light font-semibold"
                    : "text-brand-green hover:bg-brand-cream-light/30"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Price Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-baseline">
            <label className="text-[10px] uppercase tracking-wider font-semibold text-brand-green">
              Max Budget
            </label>
            <span className="text-xs font-bold text-brand-gold">₹{priceRange}</span>
          </div>
          <input
            type="range"
            min={100}
            max={3000}
            step={50}
            value={priceRange}
            onChange={(e) => setPriceRange(Number(e.target.value))}
            className="w-full accent-brand-gold cursor-pointer"
          />
          <div className="flex justify-between text-[9px] text-brand-muted font-semibold">
            <span>₹100</span>
            <span>₹3000+</span>
          </div>
        </div>

        {/* Bestseller Checkbox */}
        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-brand-green select-none">
          <input
            type="checkbox"
            checked={onlyBestsellers}
            onChange={(e) => setOnlyBestsellers(e.target.checked)}
            className="accent-brand-gold w-4 h-4 border-brand-cream-dark/50 rounded-sm"
          />
          Show Bestsellers Only
        </label>
      </div>

      {/* Catalog Grid */}
      <div className="lg:col-span-3 space-y-6">
        {/* Sort header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center bg-white border border-brand-cream-dark/30 p-4 rounded-xl gap-4 shadow-xs">
          <span className="text-xs text-brand-muted font-medium">
            Showing <span className="text-brand-green font-bold">{filteredProducts.length}</span> premium products
          </span>

          <div className="flex items-center gap-2 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-brand-gold" />
            <span className="text-brand-green font-semibold">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="border border-brand-cream-dark/50 rounded-lg px-2 py-1 focus:outline-none focus:border-brand-gold text-brand-green font-semibold"
            >
              <option value="default">Default Sourcing</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="bestseller">Popular Bestseller</option>
              <option value="newest">New Arrivals</option>
            </select>
          </div>
        </div>

        {/* Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white border border-brand-cream-dark/30 rounded-2xl">
            <SlidersHorizontal className="w-12 h-12 text-brand-cream-dark mx-auto mb-4" />
            <p className="font-serif-editorial text-brand-green font-bold text-lg">No products found</p>
            <p className="text-brand-muted text-xs mt-1">Try clearing your filters or typing another search keyword.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((p) => (
              <ProductCard key={p.id} product={p} whatsappNumber={whatsappNumber} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
