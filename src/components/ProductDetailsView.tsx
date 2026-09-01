"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Star, ShieldCheck, HeartPulse, Clock, Sparkles, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import ProductCard, { ProductWithDetails } from "./ProductCard";

interface ProductDetailsViewProps {
  product: ProductWithDetails & { category: { name: string; slug: string } };
  relatedProducts: ProductWithDetails[];
  whatsappNumber: string;
}

export default function ProductDetailsView({
  product,
  relatedProducts,
  whatsappNumber,
}: ProductDetailsViewProps) {
  const { addItem, setIsOpen } = useCart();
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({});
  const [pincode, setPincode] = useState("");
  const [pincodeResult, setPincodeResult] = useState<{
    available: boolean;
    days: string;
    charge: number;
    deliveryType: string;
    message: string;
    futureNotice?: string;
  } | null>(null);
  const [pincodeChecking, setPincodeChecking] = useState(false);

  const hasVariants = product.variants && product.variants.length > 0;
  const currentVariant = hasVariants ? product.variants[selectedVariantIndex] : null;

  // Selected weight and pricing details
  const originalPrice = currentVariant ? currentVariant.originalPrice : product.originalPrice;
  const discountedPrice = currentVariant ? currentVariant.discountedPrice : product.discountedPrice;
  const weightLabel = currentVariant ? currentVariant.weight : "Standard";
  
  const discountPercent = discountedPrice 
    ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
    : product.discountPercent;

  const currentPrice = discountedPrice || originalPrice;
  
  const images = product.images.length > 0 ? product.images : [{ url: "/images/product_almond.jpg" }];
  const mainImage = images[activeImageIndex].url;

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      variantId: currentVariant?.id,
      name: product.name,
      weight: weightLabel,
      price: currentPrice,
      image: images[0]?.url,
    }, quantity);
  };

  const handleBuyNow = () => {
    addItem({
      id: product.id,
      variantId: currentVariant?.id,
      name: product.name,
      weight: weightLabel,
      price: currentPrice,
      image: images[0]?.url,
    }, quantity);
    setIsOpen(true);
  };

  const handlePincodeCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(pincode)) {
      alert("Please enter a valid 6-digit pincode.");
      return;
    }
    setPincodeChecking(true);
    try {
      const { calculateShippingCharge } = await import("@/lib/actions");
      const res = await calculateShippingCharge(pincode, currentPrice * quantity);
      setPincodeResult({
        available: res.isDeliverable,
        days: res.expectedDelivery,
        charge: res.shippingCharge,
        deliveryType: res.deliveryType,
        message: res.message,
        futureNotice: res.futureNotice,
      });
    } catch (err) {
      console.error(err);
      setPincodeResult({
        available: false,
        days: "",
        charge: 0,
        deliveryType: "",
        message: "Currently, we are delivering only in Ujjain. We will start accepting orders from your location next month.",
        futureNotice: "Outside Ujjain District delivery will start within 2 months (₹599 Free Shipping & 48-72h delivery).",
      });
    } finally {
      setPincodeChecking(false);
    }
  };

  // Magnifying Zoom functionality on hover
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: "scale(1.5)",
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({});
  };

  return (
    <div className="space-y-12 font-sans">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-brand-muted uppercase tracking-wider font-semibold">
        <Link href="/" className="hover:text-brand-gold">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-brand-gold">Shop</Link>
        <span>/</span>
        <Link href={`/shop?category=${product.category.slug}`} className="hover:text-brand-gold">
          {product.category.name}
        </Link>
        <span>/</span>
        <span className="text-brand-green font-bold">{product.name}</span>
      </div>

      {/* Main product detail section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 bg-white border border-brand-cream-dark/30 p-6 md:p-10 rounded-3xl shadow-xs">
        
        {/* Left Column: Image Gallery with Zoom */}
        <div className="lg:col-span-6 space-y-4">
          <div
            className="w-full aspect-square overflow-hidden bg-brand-cream-light border border-brand-cream-dark/30 rounded-2xl relative cursor-zoom-in"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <img
              src={mainImage}
              alt={product.name}
              style={zoomStyle}
              className="w-full h-full object-cover transition-transform duration-100"
            />
            {discountPercent && discountPercent > 0 && (
              <span className="absolute top-4 left-4 bg-brand-gold text-brand-cream-light text-xs tracking-wider uppercase font-bold px-3 py-1 rounded-md">
                Save {discountPercent}%
              </span>
            )}
          </div>

          {/* Thumbnail list */}
          {images.length > 1 && (
            <div className="flex gap-3">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 aspect-square rounded-xl overflow-hidden border bg-brand-cream-light transition-all ${
                    activeImageIndex === idx ? "border-brand-gold ring-1 ring-brand-gold" : "border-brand-cream-dark/40"
                  }`}
                >
                  <img src={img.url} alt={`${product.name} view ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Information & CTAs */}
        <div className="lg:col-span-6 flex flex-col justify-start space-y-6">
          <div className="space-y-4">
            <span className="text-xs font-bold tracking-widest text-brand-gold uppercase">
              {product.category.name}
            </span>
            <h1 className="font-serif-editorial text-3xl md:text-4xl text-brand-green font-bold leading-tight">
              {product.name}
            </h1>
            
            {/* Rating */}
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-brand-gold text-brand-gold" />
              ))}
              <span className="text-xs text-brand-muted font-bold ml-1">(5.0 Rating | 12 customer reviews)</span>
            </div>

            <p className="text-sm text-brand-muted leading-relaxed">
              {product.description}
            </p>

            {/* Price */}
            <div className="flex items-baseline gap-3 pt-2">
              <span className="text-3xl font-bold text-brand-green">₹{currentPrice}</span>
              {discountedPrice && (
                <span className="text-sm text-brand-muted line-through">₹{originalPrice}</span>
              )}
            </div>

            {/* Weight Variations Selector */}
            {hasVariants && (
              <div className="space-y-2 pt-2">
                <span className="text-[10px] uppercase tracking-wider font-bold text-brand-green block">
                  Select Weight Options
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v, idx) => (
                    <button
                      key={v.id}
                      onClick={() => {
                        setSelectedVariantIndex(idx);
                        setQuantity(1); // Reset quantity on change
                      }}
                      className={`text-xs tracking-wider uppercase font-semibold px-4 py-2 rounded-xl border transition-all ${
                        selectedVariantIndex === idx
                          ? "bg-brand-green border-brand-green text-brand-cream-light shadow-sm"
                          : "bg-white border-brand-cream-dark/50 text-brand-green hover:border-brand-gold"
                      }`}
                    >
                      {v.weight}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Availability */}
            <div className="flex items-center gap-2 pt-2 text-xs font-semibold text-brand-green">
              <ShieldCheck className="w-5 h-5 text-brand-gold" />
              <span>
                Status:{" "}
                <span className="text-brand-gold">
                  {currentVariant && currentVariant.stockQuantity > 0 ? "In Stock (Ready to Deliver)" : "Limited Stock Available"}
                </span>
              </span>
            </div>
          </div>

          <div className="border-t border-brand-cream-dark/20 pt-6 space-y-4">
            {/* Quantity Selector & standard buy CTAs */}
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center border border-brand-cream-dark px-3 py-2.5 rounded-xl bg-brand-cream-light">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-1 hover:text-brand-gold text-brand-green"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-sm font-semibold px-4 min-w-[30px] text-center text-brand-green">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-1 hover:text-brand-gold text-brand-green"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-grow md:flex-1 border border-brand-green hover:border-brand-gold text-brand-green hover:text-brand-gold py-3.5 px-6 rounded-xl text-xs font-bold uppercase tracking-widest transition-all bg-white"
              >
                Add to Cart
              </button>
              
              <button
                onClick={handleBuyNow}
                className="flex-grow md:flex-1 min-w-[150px] bg-brand-green hover:bg-brand-green/90 text-brand-cream-light py-3.5 px-6 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-md"
              >
                Buy Now
              </button>
            </div>

            {/* Pincode checker widget */}
            <div className="border-t border-brand-cream-dark/20 pt-6 space-y-3">
              <span className="text-[10px] uppercase tracking-wider font-bold text-brand-green block">
                Check Delivery Availability
              </span>
              <form onSubmit={handlePincodeCheck} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter 6-digit Pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="border border-brand-cream-dark/50 px-3.5 py-2 rounded-xl text-xs tracking-wider focus:outline-none focus:border-brand-gold text-brand-green flex-1 bg-white"
                />
                <button
                  type="submit"
                  disabled={pincodeChecking}
                  className="bg-brand-green text-brand-cream-light px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-brand-green/95 transition-all disabled:opacity-50"
                >
                  {pincodeChecking ? "Checking..." : "Check"}
                </button>
              </form>

              {pincodeResult && (
                <div className={`p-3.5 rounded-xl text-xs space-y-1.5 border leading-relaxed ${
                  pincodeResult.available
                    ? "bg-green-50/70 border-green-200 text-green-900"
                    : "bg-red-50 border-red-200 text-red-700"
                }`}>
                  {pincodeResult.available ? (
                    <>
                      <p className="font-bold flex items-center gap-1.5 text-brand-green">
                        <span>{pincodeResult.message}</span>
                      </p>
                      <p className="text-brand-muted">
                        📦 Estimated Delivery: <span className="font-semibold text-brand-green">{pincodeResult.days}</span>
                      </p>
                      <p className="text-brand-muted">
                        🚚 Shipping Charge: <span className="font-semibold text-brand-green">{pincodeResult.charge === 0 ? "FREE" : `₹${pincodeResult.charge}`}</span> ({pincodeResult.deliveryType})
                      </p>
                    </>
                  ) : (
                    <div className="space-y-1">
                      <p className="font-bold flex items-center gap-1.5 text-red-700">
                        <span>❌ Not Deliverable in Your Location</span>
                      </p>
                      <p className="text-xs text-red-700 font-medium">
                        {pincodeResult.message}
                      </p>
                      <p className="text-[10px] text-red-600/80 mt-1">
                        * {pincodeResult.futureNotice || "Outside Ujjain District delivery will start within 2 months with ₹599 Free Shipping & 48-72h delivery."}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Product metadata specs (Benefits, instructions, etc.) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Health Benefits */}
        {product.benefits && (
          <div className="md:col-span-5 bg-white border border-brand-cream-dark/30 p-6 md:p-8 rounded-3xl space-y-4 shadow-xs">
            <h3 className="font-serif-editorial text-xl text-brand-green font-bold flex items-center gap-2">
              <HeartPulse className="w-5 h-5 text-brand-gold" />
              Health & Wellness Benefits
            </h3>
            <ul className="space-y-3 text-xs text-brand-green font-medium">
              {product.benefits.split(",").map((b, idx) => (
                <li key={idx} className="flex gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-gold shrink-0 mt-1.5" />
                  <span>{b.trim()}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Specifications (Storage, Shelf-life, Delivery) */}
        <div className={`bg-white border border-brand-cream-dark/30 p-6 md:p-8 rounded-3xl space-y-4 shadow-xs ${
          product.benefits ? "md:col-span-7" : "md:col-span-12"
        }`}>
          <h3 className="font-serif-editorial text-xl text-brand-green font-bold flex items-center gap-2">
            <Clock className="w-5 h-5 text-brand-gold" />
            Storage & Sourcing Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs leading-relaxed text-brand-muted">
            <div className="space-y-1">
              <span className="font-semibold text-brand-green">Shelf Life</span>
              <p>{product.shelfLife || "6 Months"}</p>
            </div>
            <div className="space-y-1">
              <span className="font-semibold text-brand-green">Delivery Information</span>
              <p>{product.deliveryInfo || "Ships in 24 hours. Local delivery available."}</p>
            </div>
            {product.storageInstructions && (
              <div className="sm:col-span-2 space-y-1">
                <span className="font-semibold text-brand-green">Storage Instructions</span>
                <p>{product.storageInstructions}</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-6">
          <div className="flex justify-between items-end">
            <h2 className="font-serif-editorial text-2xl text-brand-green font-bold">
              You May Also Like
            </h2>
            <Link
              href="/shop"
              className="text-xs font-bold uppercase tracking-wider text-brand-green hover:text-brand-gold transition-colors"
            >
              View Shop
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} whatsappNumber={whatsappNumber} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
