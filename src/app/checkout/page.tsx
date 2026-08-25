"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { ArrowLeft, ShoppingBag, CreditCard, ShieldCheck } from "lucide-react";
import { calculateShippingCharge, validateCouponCode, createOrder } from "@/lib/actions";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, couponCode, discount, clearCart } = useCart();

  // Form Fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [apartment, setApartment] = useState("");
  const [address, setAddress] = useState("");
  const [area, setArea] = useState("");
  const [city, setCity] = useState("Ujjain");
  const [state, setState] = useState("Madhya Pradesh");
  const [pincode, setPincode] = useState("");

  // States
  const [shippingCharge, setShippingCharge] = useState(0);
  const [deliveryType, setDeliveryType] = useState("Standard Shipping");
  const [expectedDelivery, setExpectedDelivery] = useState("4-6 days");
  const [isUrgent, setIsUrgent] = useState(false);
  const [urgentCharge, setUrgentCharge] = useState(100);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Load Razorpay Script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Calculate Shipping charges when subtotal or pincode changes
  useEffect(() => {
    async function updateShipping() {
      if (/^\d{6}$/.test(pincode)) {
        const res = await calculateShippingCharge(pincode, subtotal - discount);
        setShippingCharge(res.shippingCharge);
        setDeliveryType(res.deliveryType);
        setExpectedDelivery(res.expectedDelivery);
      } else {
        // Default outstation rates
        const res = await calculateShippingCharge("000000", subtotal - discount);
        setShippingCharge(res.shippingCharge);
        setDeliveryType(res.deliveryType);
        setExpectedDelivery(res.expectedDelivery);
      }
    }
    updateShipping();
  }, [pincode, subtotal, discount]);

  // Bulk Order Checks
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const isBulkOrder = totalQuantity >= 10;

  const finalShipping = shippingCharge + (isUrgent ? urgentCharge : 0);
  const grandTotal = Math.max(0, subtotal - discount + finalShipping);
  const handleSandboxSimulate = async () => {
    if (items.length === 0) return;

    if (!name || !phone || !address || !pincode) {
      setErrorMsg("Please fill in all required delivery fields.");
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      setErrorMsg("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (!/^\d{6}$/.test(pincode)) {
      setErrorMsg("Please enter a valid 6-digit pincode.");
      return;
    }

    setErrorMsg("");
    setIsSubmitting(true);

    try {
      // Create Order in DB directly
      const dbOrderRes = await createOrder({
        customerName: name,
        phone: phone,
        whatsapp: phone,
        email: email || undefined,
        shippingAddress: `${apartment}, ${address}, ${area}, ${city}, ${state} - ${pincode}`,
        deliveryType: "DELIVERY",
        orderNotes: `SIMULATED TEST CHECKOUT (SANDBOX). ${isUrgent ? "URGENT. " : ""}${isBulkOrder ? "FLAG: BULK ORDER 10+." : ""}`,
        items: items.map(item => ({
          productId: item.id,
          variantId: item.variantId || null,
          productName: item.name,
          weight: item.weight,
          quantity: item.quantity,
          price: item.price
        }))
      });

      if (dbOrderRes.success && dbOrderRes.orderNumber) {
        // Sync order to Shiprocket
        const { syncOrderToShiprocket } = await import("@/lib/actions");
        await syncOrderToShiprocket(dbOrderRes.orderNumber);

        clearCart();
        router.push(`/track?query=${dbOrderRes.orderNumber}&success=true`);
      } else {
        throw new Error(dbOrderRes.error || "Order saving failed.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to process sandbox payment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    if (!name || !phone || !address || !pincode) {
      setErrorMsg("Please fill in all required delivery fields.");
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      setErrorMsg("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (!/^\d{6}$/.test(pincode)) {
      setErrorMsg("Please enter a valid 6-digit pincode.");
      return;
    }

    setErrorMsg("");
    setIsSubmitting(true);

    try {
      // 1. Call server actions to generate Razorpay Order ID
      const { createRazorpayOrderAction } = await import("@/lib/actions");
      const orderRes = await createRazorpayOrderAction(grandTotal);

      if (!orderRes.success || !orderRes.orderId) {
        throw new Error(orderRes.error || "Failed to initiate Razorpay transaction.");
      }

      // 2. Configure Razorpay modal options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_mockkey123456", // Load live or test key
        amount: grandTotal * 100,
        currency: "INR",
        name: "ShubhMewa",
        description: isBulkOrder ? "Bulk Order Gifting Checkout" : "Retail Dry Fruit Order Checkout",
        order_id: orderRes.orderId,
        handler: async function (response: any) {
          // Trigger server side payment verification
          try {
            const { verifyRazorpayPaymentAction } = await import("@/lib/actions");
            const verifyRes = await verifyRazorpayPaymentAction(
              response.razorpay_payment_id,
              response.razorpay_order_id,
              response.razorpay_signature
            );

            if (!verifyRes.success) {
              throw new Error("Payment signature verification failed.");
            }

            // Create Order in DB
            const dbOrderRes = await createOrder({
              customerName: name,
              phone: phone,
              whatsapp: phone,
              email: email || undefined,
              shippingAddress: `${apartment}, ${address}, ${area}, ${city}, ${state} - ${pincode}`,
              deliveryType: "DELIVERY",
              orderNotes: `${isUrgent ? "URGENT DELIVERY REQUIRED. " : ""}${isBulkOrder ? "FLAG: BULK ORDER 10+ UNITS." : ""}`,
              items: items.map(item => ({
                productId: item.id,
                variantId: item.variantId || null,
                productName: item.name,
                weight: item.weight,
                quantity: item.quantity,
                price: item.price
              }))
            });

            if (dbOrderRes.success && dbOrderRes.orderNumber) {
              // Sync order to Shiprocket
              const { syncOrderToShiprocket } = await import("@/lib/actions");
              await syncOrderToShiprocket(dbOrderRes.orderNumber);

              clearCart();
              router.push(`/track?query=${dbOrderRes.orderNumber}&success=true`);
            } else {
              throw new Error(dbOrderRes.error || "Order saving failed.");
            }

          } catch (err: any) {
            setErrorMsg(err.message || "Something went wrong during payment verification.");
            setIsSubmitting(false);
          }
        },
        prefill: {
          name: name,
          email: email || "customer@shubhmewa.com",
          contact: phone,
        },
        theme: {
          color: "#1C3F3A", // ShubhMewa Green
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to process payment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-6 font-sans">
        <div className="w-16 h-16 bg-brand-green/10 text-brand-green rounded-full flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-serif-editorial text-brand-green font-bold">Your Checkout is Empty</h2>
        <p className="text-brand-muted text-sm max-w-xs mx-auto">Add some premium dry fruits or hampers to the shopping list before checking out.</p>
        <Link href="/shop" className="inline-block bg-brand-green text-brand-cream-light px-8 py-3 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-brand-green/90 transition-all shadow-sm">
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 font-sans grid grid-cols-1 lg:grid-cols-12 gap-8 text-xs text-brand-muted">
      
      {/* Left Column: Checkout Details Form */}
      <div className="lg:col-span-8 bg-white border border-brand-cream-dark/30 p-6 md:p-10 rounded-3xl space-y-8 shadow-xs">
        <div className="flex items-center gap-2 border-b border-brand-cream-dark/20 pb-4">
          <Link href="/shop" className="text-brand-muted hover:text-brand-gold transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="font-serif-editorial text-2xl text-brand-green font-bold">
            Delivery & Payment Information
          </h1>
        </div>

        {errorMsg && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl font-semibold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handlePayment} className="space-y-6">
          <div className="space-y-4">
            <h2 className="font-serif-editorial text-base text-brand-green font-bold border-b border-brand-cream-dark/10 pb-2">
              1. Customer Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-brand-green">Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Aman Agrawal"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-brand-cream-dark/50 px-3 py-2.5 rounded-lg text-xs focus:outline-none focus:border-brand-gold text-brand-green bg-white"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-brand-green">Mobile Number (10 Digits) *</label>
                <input
                  type="tel"
                  placeholder="e.g. 8982010210"
                  required
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  className="w-full border border-brand-cream-dark/50 px-3 py-2.5 rounded-lg text-xs focus:outline-none focus:border-brand-gold text-brand-green bg-white"
                />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="font-bold text-brand-green">Email Address (for order receipts)</label>
                <input
                  type="email"
                  placeholder="e.g. aman@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-brand-cream-dark/50 px-3 py-2.5 rounded-lg text-xs focus:outline-none focus:border-brand-gold text-brand-green bg-white"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="font-serif-editorial text-base text-brand-green font-bold border-b border-brand-cream-dark/10 pb-2">
              2. Shipping Address Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1 md:col-span-1">
                <label className="font-bold text-brand-green">Apartment/House No. *</label>
                <input
                  type="text"
                  placeholder="e.g. Flat 104, Royal residency"
                  required
                  value={apartment}
                  onChange={(e) => setApartment(e.target.value)}
                  className="w-full border border-brand-cream-dark/50 px-3 py-2.5 rounded-lg text-xs focus:outline-none focus:border-brand-gold text-brand-green bg-white"
                />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="font-bold text-brand-green">Street / Road Address *</label>
                <input
                  type="text"
                  placeholder="e.g. Tilak Marg, Dev Sahab Ki Gali"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full border border-brand-cream-dark/50 px-3 py-2.5 rounded-lg text-xs focus:outline-none focus:border-brand-gold text-brand-green bg-white"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-brand-green">Area / Landmark *</label>
                <input
                  type="text"
                  placeholder="e.g. Fawara Chowk, Daulat Ganj"
                  required
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full border border-brand-cream-dark/50 px-3 py-2.5 rounded-lg text-xs focus:outline-none focus:border-brand-gold text-brand-green bg-white"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-brand-green">City *</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full border border-brand-cream-dark/50 px-3 py-2.5 rounded-lg text-xs focus:outline-none focus:border-brand-gold text-brand-green bg-white"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-brand-green">Pincode (6 Digits) *</label>
                <input
                  type="text"
                  placeholder="e.g. 456001"
                  required
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                  className="w-full border border-brand-cream-dark/50 px-3 py-2.5 rounded-lg text-xs focus:outline-none focus:border-brand-gold text-brand-green bg-white"
                />
              </div>
            </div>
          </div>

          {/* Urgent delivery checkbox option */}
          <div className="bg-brand-cream-light/50 border border-brand-cream-dark/30 p-4 rounded-xl space-y-3">
            <span className="font-bold text-brand-green block">Need Urgent Delivery?</span>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isUrgent}
                onChange={(e) => setIsUrgent(e.target.checked)}
                className="accent-brand-gold w-4 h-4"
              />
              <span className="text-xs">Yes, deliver urgently. (Select locations only; adds flat ₹{urgentCharge} delivery fee)</span>
            </label>
          </div>

          {/* Policy confirmations */}
          <div className="space-y-2 border-t border-brand-cream-dark/20 pt-4">
            <div className="bg-brand-cream-light/30 p-3 rounded-lg border border-brand-cream-dark/20 text-[10px] space-y-1.5 leading-relaxed">
              {isBulkOrder ? (
                <p className="text-red-500 font-bold flex items-center gap-1">
                  ⚠️ WARNING: This order qualifies as a BULK ORDER (10+ units). Bulk orders cannot be cancelled or refunded under any circumstances once processed.
                </p>
              ) : (
                <p className="text-brand-green font-semibold">
                  Policy: Standard orders cannot be cancelled once processed by the payment gateway. Eligible issues are resolved through replacements only (No cash/digital refunds).
                </p>
              )}
              <p>
                * Issues must be reported to customer support (WhatsApp/Phone: 8982010210) within 12 hours of delivery.
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-brand-green hover:bg-brand-green/95 text-brand-cream-light py-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-md cursor-pointer"
          >
            <CreditCard className="w-4 h-4 text-brand-gold" />
            <span>{isSubmitting ? "Generating secure payment link..." : `Pay Securely (₹${grandTotal})`}</span>
          </button>

          {process.env.NODE_ENV === "development" && (
            <button
              type="button"
              onClick={handleSandboxSimulate}
              disabled={isSubmitting}
              className="w-full border-2 border-dashed border-brand-gold hover:border-brand-gold/80 text-brand-gold py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-2 bg-white cursor-pointer"
            >
              <span>Simulate Sandbox Checkout (Save Test Data)</span>
            </button>
          )}
        </form>
      </div>

      {/* Right Column: Order Items Summary Card */}
      <div className="lg:col-span-4 bg-brand-cream-light/50 border border-brand-cream-dark/30 p-6 rounded-3xl space-y-6 h-fit">
        <h2 className="font-serif-editorial text-lg text-brand-green font-bold border-b border-brand-cream-dark/20 pb-2 flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-brand-gold" />
          Order Summary
        </h2>

        {/* Cart Item Row List */}
        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
          {items.map((item) => (
            <div key={`${item.id}-${item.variantId}`} className="flex gap-3 bg-white p-2.5 rounded-xl border border-brand-cream-dark/20">
              <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg border" />
              <div className="flex-grow flex flex-col justify-between">
                <div>
                  <p className="font-serif-editorial text-brand-green font-bold leading-tight">{item.name}</p>
                  <span className="text-[10px] text-brand-muted">{item.weight} x {item.quantity}</span>
                </div>
                <p className="text-right text-brand-green font-semibold">₹{item.price * item.quantity}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Pricing Subtotals */}
        <div className="border-t border-brand-cream-dark/20 pt-4 space-y-2 text-xs leading-none">
          <div className="flex justify-between text-brand-muted">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-red-500">
              <span>Coupon Discount {couponCode && `(${couponCode})`}</span>
              <span>-₹{discount}</span>
            </div>
          )}
          <div className="flex justify-between text-brand-muted">
            <span>Shipping ({deliveryType})</span>
            <span>{shippingCharge === 0 ? "FREE" : `₹${shippingCharge}`}</span>
          </div>
          {isUrgent && (
            <div className="flex justify-between text-brand-muted">
              <span>Urgent Delivery Charge</span>
              <span>+₹{urgentCharge}</span>
            </div>
          )}
          <div className="flex justify-between text-brand-green font-bold text-base border-t border-brand-cream-dark/20 pt-3">
            <span>Grand Total</span>
            <span>₹{grandTotal}</span>
          </div>
          <p className="text-[10px] text-brand-gold font-semibold pt-1">
            📦 Expected delivery: {expectedDelivery}
          </p>
        </div>

        {/* Trust Badging */}
        <div className="bg-white border border-brand-cream-dark/30 p-4 rounded-xl flex gap-3 items-center">
          <ShieldCheck className="w-8 h-8 text-brand-gold shrink-0" />
          <div className="space-y-0.5">
            <span className="font-bold text-brand-green block leading-none">Verified Secure Checkout</span>
            <p className="text-[9px] text-brand-muted leading-tight">Protected by Razorpay 256-bit bank-grade encryption algorithms.</p>
          </div>
        </div>
      </div>

    </div>
  );
}
