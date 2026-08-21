"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShoppingBag, Eye, PhoneCall, Star } from "lucide-react";
import { useCart } from "@/context/CartContext";

export interface ProductVariant {
  id: string;
  weight: string;
  originalPrice: number;
  discountedPrice?: number | null;
  sku?: string | null;
  stockQuantity: number;
}

export interface ProductWithDetails {
  id: string;
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  originalPrice: number;
  discountedPrice?: number | null;
  discountPercent?: number | null;
  stockStatus: string;
  isBestseller: boolean;
  isNewArrival: boolean;
  benefits?: string | null;
  shelfLife?: string | null;
  deliveryInfo?: string | null;
  storageInstructions?: string | null;
  images: { url: string }[];
  variants: ProductVariant[];
}

interface ProductCardProps {
  product: ProductWithDetails;
  whatsappNumber: string;
}

export default function ProductCard({ product, whatsappNumber }: ProductCardProps) {
  const { addItem } = useCart();
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

  const hasVariants = product.variants && product.variants.length > 0;
  const currentVariant = hasVariants ? product.variants[selectedVariantIndex] : null;

  // Pricing calculation
  const originalPrice = currentVariant ? currentVariant.originalPrice : product.originalPrice;
  const discountedPrice = currentVariant ? currentVariant.discountedPrice : product.discountedPrice;
  const weightLabel = currentVariant ? currentVariant.weight : "Standard";
  
  const discountPercent = discountedPrice 
    ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
    : product.discountPercent;

  const currentPrice = discountedPrice || originalPrice;
  const imageUrl = product.images[0]?.url || "/images/product_almond.jpg";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id: product.id,
      variantId: currentVariant?.id,
      name: product.name,
      weight: weightLabel,
      price: currentPrice,
      image: imageUrl,
    });
  };

  const handleWhatsAppOrder = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Create WhatsApp Order message
    const message = `Hello! I would like to order *${product.name}*\nWeight: *${weightLabel}*\nPrice: *₹${currentPrice}*\nQuantity: *1*\n\nPlease confirm availability and share payment/delivery details.\nProduct Link: https://harshildryfruits.com/shop/${product.slug}`;
    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/${whatsappNumber}?text=${encoded}`;
    window.open(url, "_blank");
  };

  return (
    <div className="group bg-white rounded-2xl border border-brand-cream-dark/30 hover:border-brand-gold overflow-hidden transition-all duration-300 shadow-xs hover:shadow-md flex flex-col h-full font-sans relative">
      
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
        {discountPercent && discountPercent > 0 ? (
          <span className="bg-brand-gold text-brand-cream-light text-[10px] tracking-wider uppercase font-bold px-2 py-1 rounded-md">
            Save {discountPercent}%
          </span>
        ) : null}
        {product.isBestseller && (
          <span className="bg-brand-green text-brand-cream-light text-[10px] tracking-wider uppercase font-bold px-2 py-1 rounded-md">
            Bestseller
          </span>
        )}
      </div>

      {/* Image Container */}
      <Link href={`/shop/${product.slug}`} className="block relative aspect-square overflow-hidden bg-brand-cream-light">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <button
            onClick={handleAddToCart}
            className="p-3 bg-white hover:bg-brand-green hover:text-white text-brand-green rounded-full shadow-md transition-all scale-90 group-hover:scale-100"
            title="Add to Cart"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
          <span
            className="p-3 bg-white hover:bg-brand-gold hover:text-white text-brand-gold rounded-full shadow-md transition-all scale-90 group-hover:scale-100"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </span>
        </div>
      </Link>

      {/* Body */}
      <div className="p-4 md:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3 h-3 fill-brand-gold text-brand-gold" />
            ))}
            <span className="text-[10px] text-brand-muted font-bold">(5.0)</span>
          </div>

          <Link href={`/shop/${product.slug}`} className="block">
            <h3 className="font-serif-editorial text-brand-green font-bold text-base md:text-lg hover:text-brand-gold transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs text-brand-muted mt-1 leading-relaxed line-clamp-2">
            {product.description}
          </p>

          {/* Weight Variants Selector */}
          {hasVariants && (
            <div className="flex flex-wrap gap-1.5 mt-4">
              {product.variants.map((v, idx) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariantIndex(idx)}
                  className={`text-[10px] tracking-wider uppercase font-semibold px-2.5 py-1 rounded-full border transition-all ${
                    selectedVariantIndex === idx
                      ? "bg-brand-green border-brand-green text-brand-cream-light"
                      : "bg-white border-brand-cream-dark/50 text-brand-green hover:border-brand-gold"
                  }`}
                >
                  {v.weight}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mt-5 pt-4 border-t border-brand-cream-dark/20">
          {/* Price display */}
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-lg font-bold text-brand-green">₹{currentPrice}</span>
            {discountedPrice && (
              <span className="text-xs text-brand-muted line-through">₹{originalPrice}</span>
            )}
          </div>

          {/* Quick Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleAddToCart}
              className="flex items-center justify-center gap-1.5 border border-brand-green hover:border-brand-gold text-brand-green hover:text-brand-gold py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add Cart</span>
            </button>
            <button
              onClick={handleWhatsAppOrder}
              className="flex items-center justify-center gap-1.5 bg-[#25D366] hover:bg-[#20ba5a] text-white py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Order WA</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
