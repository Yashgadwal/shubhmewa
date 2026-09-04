"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface CartDrawerProps {
  settings: Record<string, string>;
}

export default function CartDrawer({ settings }: CartDrawerProps) {
  const router = useRouter();
  const {
    items,
    isOpen,
    setIsOpen,
    updateQuantity,
    removeItem,
    clearCart,
    subtotal,
    couponCode,
    couponError,
    discount,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponInput, setCouponInput] = useState("");
  const [isApplying, setIsApplying] = useState(false);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setIsApplying(true);
    await applyCoupon(couponInput.trim().toUpperCase());
    setIsApplying(false);
  };

  const handleProceedToCheckout = () => {
    setIsOpen(false);
    router.push("/checkout");
  };

  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={() => setIsOpen(false)}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-brand-cream-light border-l border-brand-cream-dark/50 flex flex-col h-full shadow-2xl transition-transform duration-300 ease-in-out">
          
          {/* Header */}
          <div className="px-6 py-5 bg-brand-green text-brand-cream-light flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-brand-gold" />
              <h2 className="text-xl font-serif-editorial font-semibold tracking-wide">Your Shopping Cart</h2>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <ShoppingBag className="w-16 h-16 text-brand-cream-dark/60 mb-4" />
              <p className="text-lg font-serif-editorial text-brand-green font-medium">Your cart is empty</p>
              <p className="text-brand-muted text-sm mt-1 mb-6">Add premium dry fruits, makhana, or healthy seeds to get started.</p>
              <button
                onClick={() => setIsOpen(false)}
                className="px-6 py-2 bg-brand-green text-brand-cream-light font-medium rounded-full text-sm hover:bg-brand-green/90 transition-all shadow-sm"
              >
                Explore Collection
              </button>
            </div>
          ) : (
            <div className="flex-grow overflow-y-auto min-h-0">
              {/* Cart Items List */}
              <div className="p-6 space-y-4">
                {items.map((item) => (
                  <div
                    key={`${item.id}-${item.variantId}`}
                    className="flex gap-4 p-3 bg-white rounded-xl border border-brand-cream-dark/30 shadow-xs"
                  >
                    <img
                      src={item.image || "/images/product_almond.jpg"}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg border border-brand-cream-dark/30"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-serif-editorial text-brand-green font-semibold text-sm leading-tight line-clamp-1">
                          {item.name}
                        </h4>
                        <span className="text-xs text-brand-muted">{item.weight}</span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        {/* Qty Counter */}
                        <div className="flex items-center border border-brand-cream-dark/50 rounded-full px-2 py-0.5 bg-brand-cream-light">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1, item.variantId)}
                            className="p-1 hover:text-brand-gold text-brand-green"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-semibold px-2 min-w-[20px] text-center text-brand-green">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1, item.variantId)}
                            className="p-1 hover:text-brand-gold text-brand-green"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        {/* Price */}
                        <span className="text-sm font-semibold text-brand-green">
                          ₹{item.price * item.quantity}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(item.id, item.variantId)}
                      className="text-brand-muted hover:text-red-500 self-start p-1 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Promo & Order Forms */}
              <div className="p-6 bg-white border-t border-brand-cream-dark/30 space-y-4">
                {/* Coupon input */}
                {!couponCode ? (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="ENTER COUPON CODE"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 border border-brand-cream-dark/50 px-3 py-2 rounded-lg text-xs tracking-wider focus:outline-none focus:border-brand-gold uppercase text-brand-green bg-white"
                    />
                    <button
                      type="submit"
                      disabled={isApplying}
                      className="bg-brand-green text-brand-cream-light px-4 py-2 rounded-lg text-xs font-semibold hover:bg-brand-green/90 transition-colors disabled:opacity-50"
                    >
                      Apply
                    </button>
                  </form>
                ) : (
                  <div className="flex items-center justify-between bg-brand-cream-light px-3 py-2 rounded-lg border border-brand-cream-dark/50">
                    <span className="text-xs font-semibold text-brand-green">
                      Coupon Applied: <span className="text-brand-gold">{couponCode}</span> (-₹{discount})
                    </span>
                    <button
                      onClick={removeCoupon}
                      className="text-brand-muted hover:text-red-500 text-xs font-medium"
                    >
                      Remove
                    </button>
                  </div>
                )}
                {couponError && <p className="text-red-500 text-xs">{couponError}</p>}

                {/* Subtotals */}
                <div className="space-y-1 text-sm border-b border-brand-cream-dark/20 pb-3">
                  <div className="flex justify-between text-brand-muted text-xs">
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-red-500 text-xs">
                      <span>Discount</span>
                      <span>-₹{discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-brand-green font-semibold text-base pt-1">
                    <span>Total Amount</span>
                    <span>₹{subtotal - discount}</span>
                  </div>
                </div>

                <button
                  onClick={handleProceedToCheckout}
                  className="w-full bg-brand-green hover:bg-brand-green/95 text-brand-cream-light py-3 rounded-xl text-sm font-semibold tracking-wide flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4 text-brand-gold" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
