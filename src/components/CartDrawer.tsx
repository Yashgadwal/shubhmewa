"use client";

import React, { useState } from "react";
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { createOrder } from "@/lib/actions";

interface CartDrawerProps {
  settings: Record<string, string>;
}

export default function CartDrawer({ settings }: CartDrawerProps) {
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

  const [checkoutMethod, setCheckoutMethod] = useState<"whatsapp" | "online">("whatsapp");
  const [couponInput, setCouponInput] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [deliveryType, setDeliveryType] = useState<"DELIVERY" | "PICKUP">("DELIVERY");
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "ONLINE">("COD");
  const [orderNotes, setOrderNotes] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [orderSuccessNum, setOrderSuccessNum] = useState("");

  const isOnlineCheckoutAllowed = settings["online_checkout_active"] !== "false";
  const whatsappNumber = settings["whatsapp_number"] || "919876543210";

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setIsApplying(true);
    const success = await applyCoupon(couponInput.trim().toUpperCase());
    setIsApplying(false);
    if (success) {
      setCouponInput("");
    }
  };

  const deliveryFee = deliveryType === "DELIVERY" ? (subtotal - discount >= 999 ? 0 : 50) : 0;
  const grandTotal = subtotal - discount + deliveryFee;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!name.trim()) {
      setErrorMsg("Please enter your name.");
      return;
    }
    if (!phone.trim() || phone.length < 10) {
      setErrorMsg("Please enter a valid 10-digit phone number.");
      return;
    }
    if (deliveryType === "DELIVERY" && !address.trim()) {
      setErrorMsg("Please enter your delivery address.");
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        customerName: name,
        phone,
        whatsapp: phone, // Assuming WhatsApp is same as phone
        email: "",
        shippingAddress: deliveryType === "DELIVERY" ? address : "Store Pickup (Ujjain)",
        deliveryType,
        orderNotes,
        couponCode: couponCode || undefined,
        items: items.map((item) => ({
          productId: item.id,
          variantId: item.variantId,
          productName: item.name,
          weight: item.weight,
          quantity: item.quantity,
          price: item.price,
        })),
        paymentMethod: checkoutMethod === "whatsapp" ? "COD" : paymentMethod,
        checkoutMethod: checkoutMethod.toUpperCase() as "WHATSAPP" | "ONLINE",
      };

      const res = await createOrder(orderPayload);

      if (res.success && res.order) {
        const orderNum = res.orderNumber || "";
        
        if (checkoutMethod === "whatsapp") {
          // Format WhatsApp message
          let message = `Hello ShubhMewa 👋\n\n*NEW ORDER - SHUBHMEWA*\n`;
          message += `Order Number: ${orderNum}\n`;
          message += `-----------------------------\n`;
          message += `*Customer:* ${name}\n`;
          message += `*Phone:* ${phone}\n`;
          message += `*Preference:* ${deliveryType === "DELIVERY" ? "Home Delivery" : "Store Pickup"}\n`;
          if (deliveryType === "DELIVERY") {
            message += `*Address:* ${address}\n`;
          }
          message += `-----------------------------\n`;
          items.forEach((item) => {
            message += `• ${item.name} (${item.weight}) x ${item.quantity} - ₹${item.price * item.quantity}\n`;
          });
          message += `-----------------------------\n`;
          if (discount > 0) {
            message += `Subtotal: ₹${subtotal}\n`;
            message += `Discount (${couponCode}): -₹${discount}\n`;
          }
          if (deliveryFee > 0) {
            message += `Delivery Fee: ₹${deliveryFee}\n`;
          }
          message += `*Total Amount:* ₹${grandTotal}\n`;
          if (orderNotes) {
            message += `*Notes:* ${orderNotes}\n`;
          }
          message += `\nPlease confirm my order details and share availability!`;

          const encodedMessage = encodeURIComponent(message);
          const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodedMessage}`;
          
          // Clear and close
          clearCart();
          setIsOpen(false);
          window.open(whatsappUrl, "_blank");
        } else {
          // Online Checkout Success
          setOrderSuccessNum(orderNum);
          clearCart();
        }
      } else {
        setErrorMsg(res.error || "Failed to process order. Try again.");
      }
    } catch (err) {
      setErrorMsg("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
              <h2 className="text-xl font-serif-editorial font-semibold tracking-wide">Your Enquiry Cart</h2>
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
              {orderSuccessNum ? (
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-brand-green/10 text-brand-green rounded-full flex items-center justify-center mx-auto mb-2">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-serif-editorial text-brand-green">Order Placed!</h3>
                  <p className="text-brand-muted text-sm max-w-xs">
                    Your order **{orderSuccessNum}** has been recorded successfully. Our team will contact you shortly.
                  </p>
                  <button
                    onClick={() => setOrderSuccessNum("")}
                    className="px-6 py-2 bg-brand-green text-brand-cream-light font-medium rounded-full text-sm hover:bg-brand-green/90 transition-all shadow-sm"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <>
                  <ShoppingBag className="w-16 h-16 text-brand-cream-dark/60 mb-4" />
                  <p className="text-lg font-serif-editorial text-brand-green font-medium">Your cart is empty</p>
                  <p className="text-brand-muted text-sm mt-1 mb-6">Add premium dry fruits, gift hampers, or seeds to get started.</p>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-6 py-2 bg-brand-green text-brand-cream-light font-medium rounded-full text-sm hover:bg-brand-green/90 transition-all shadow-sm"
                  >
                    Explore Collection
                  </button>
                </>
              )}
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
                      className="flex-1 border border-brand-cream-dark/50 px-3 py-2 rounded-lg text-xs tracking-wider focus:outline-none focus:border-brand-gold uppercase text-brand-green"
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
                  {deliveryType === "DELIVERY" && (
                    <div className="flex justify-between text-brand-muted text-xs">
                      <span>Delivery Fee</span>
                      <span>{deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-brand-green font-semibold text-base pt-1">
                    <span>Total Amount</span>
                    <span>₹{grandTotal}</span>
                  </div>
                </div>

                {/* Checkout Methods Selector */}
                {isOnlineCheckoutAllowed && (
                  <div className="grid grid-cols-2 gap-2 border border-brand-cream-dark/50 p-1 rounded-xl bg-brand-cream-light">
                    <button
                      type="button"
                      onClick={() => setCheckoutMethod("whatsapp")}
                      className={`py-2 rounded-lg text-xs font-semibold transition-all ${
                        checkoutMethod === "whatsapp"
                          ? "bg-brand-green text-brand-cream-light shadow-sm"
                          : "text-brand-green hover:text-brand-gold"
                      }`}
                    >
                      WhatsApp Checkout
                    </button>
                    <button
                      type="button"
                      onClick={() => setCheckoutMethod("online")}
                      className={`py-2 rounded-lg text-xs font-semibold transition-all ${
                        checkoutMethod === "online"
                          ? "bg-brand-green text-brand-cream-light shadow-sm"
                          : "text-brand-green hover:text-brand-gold"
                      }`}
                    >
                      Online Checkout (COD)
                    </button>
                  </div>
                )}

                {/* Quick Checkout Form */}
                <form onSubmit={handleSubmitOrder} className="space-y-3 pt-2">
                  <h3 className="text-xs font-bold tracking-wider text-brand-green uppercase">
                    Delivery Details
                  </h3>
                  
                  {errorMsg && <p className="text-red-500 text-xs font-semibold">{errorMsg}</p>}

                  <input
                    type="text"
                    placeholder="Your Full Name *"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-brand-cream-dark/50 px-3 py-2 rounded-lg text-xs focus:outline-none focus:border-brand-gold text-brand-green"
                  />
                  <input
                    type="tel"
                    placeholder="WhatsApp/Phone Number (10 Digits) *"
                    required
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                    className="w-full border border-brand-cream-dark/50 px-3 py-2 rounded-lg text-xs focus:outline-none focus:border-brand-gold text-brand-green"
                  />

                  {/* Delivery preference */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <label className="flex items-center gap-1.5 cursor-pointer text-brand-green">
                      <input
                        type="radio"
                        name="deliveryType"
                        checked={deliveryType === "DELIVERY"}
                        onChange={() => setDeliveryType("DELIVERY")}
                        className="accent-brand-gold"
                      />
                      Home Delivery
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer text-brand-green">
                      <input
                        type="radio"
                        name="deliveryType"
                        checked={deliveryType === "PICKUP"}
                        onChange={() => setDeliveryType("PICKUP")}
                        className="accent-brand-gold"
                      />
                      Store Pickup
                    </label>
                  </div>

                  {deliveryType === "DELIVERY" && (
                    <textarea
                      placeholder="Complete Delivery Address in Ujjain *"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      rows={2}
                      className="w-full border border-brand-cream-dark/50 px-3 py-2 rounded-lg text-xs focus:outline-none focus:border-brand-gold text-brand-green"
                    />
                  )}

                  {checkoutMethod === "online" && (
                    <div className="space-y-1">
                      <span className="text-[10px] text-brand-muted font-bold block uppercase tracking-wider">
                        Payment Method
                      </span>
                      <label className="flex items-center gap-1.5 cursor-pointer text-xs text-brand-green">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === "COD"}
                          onChange={() => setPaymentMethod("COD")}
                          className="accent-brand-gold"
                        />
                        Cash on Delivery (COD)
                      </label>
                    </div>
                  )}

                  <input
                    type="text"
                    placeholder="Order Notes (Optional)"
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    className="w-full border border-brand-cream-dark/50 px-3 py-2 rounded-lg text-xs focus:outline-none focus:border-brand-gold text-brand-green"
                  />

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-brand-green hover:bg-brand-green/95 text-brand-cream-light py-3 rounded-xl text-sm font-semibold tracking-wide flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-md"
                  >
                    {isSubmitting ? (
                      <span className="w-5 h-5 border-2 border-brand-cream-light border-t-transparent rounded-full animate-spin" />
                    ) : checkoutMethod === "whatsapp" ? (
                      <>
                        Confirm via WhatsApp <ArrowRight className="w-4 h-4 text-brand-gold" />
                      </>
                    ) : (
                      <>
                        Place COD Order <ArrowRight className="w-4 h-4 text-brand-gold" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
