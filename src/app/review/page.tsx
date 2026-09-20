"use client";

import React, { useState, useEffect } from "react";

const GOOGLE_REVIEW_URL = "https://maps.google.com/?q=Shop+No.+5,+Gali+No.+4,+Tilak+Marg,+Fawara+Chowk,+Daulat+Ganj,+Ujjain";

const REVIEWS = [
  "Bought California jumbo almonds and Chilean walnuts from ShubhMewa. The quality is exceptional! The nuts are super fresh, crunchy, and have zero bitterness. Best dry fruits store in Ujjain!",
  "Ordered dry fruits online and was amazed by their same-day delivery service in Ujjain. The packaging is airtight and hygienic. King size cashews are huge and delicious.",
  "Visited their store at Fawara Chowk, Daulat Ganj. The staff was very polite and explained their sourcing process. Grade-one almonds and walnuts at very genuine prices.",
  "Their Phool Makhana is the crunchiest I have had in Ujjain! Roasted them with ghee and rock salt for our evening snacks. Highly recommended for health lovers.",
  "ShubhMewa is our go-to shop for family festive gifting. The gift boxes and nut hampers look royal, and every single almond and cashew is uniform and clean.",
  "I regularly buy Chilean extra light walnut kernels for my family. Buttery taste and very fresh harvest. Great service and prompt home delivery in Ujjain.",
  "Very reliable dry fruit brand in Ujjain. Free delivery on orders above ₹399 is super convenient. The quality of W240 cashews is top notch.",
  "The Medjool dates and salted pistachios were fresh, soft, and naturally delicious. Great variety of healthy seeds and nuts under one roof.",
  "Outstanding quality! Hand-sorted almonds are large in size with no broken pieces. You can immediately feel the difference from ordinary market dry fruits.",
  "Prompt delivery, hygienic vacuum-sealed packaging, and top-tier dry fruits. ShubhMewa has set a high benchmark in Ujjain.",
  "Visited the shop in Tilak Marg near Fawara Chowk. Clean and organized store with courteous staff. Definitely the finest dry fruit boutique in Ujjain.",
  "We ordered dry fruits for our parents' wellness routine. The chia seeds, raw almonds, and walnuts are very clean and fresh. Thank you ShubhMewa!",
  "Best place in Ujjain for dry fruit shopping! King size cashews are wholesome and rich in taste. Perfect for snacking and cooking.",
  "I appreciate their full refund and replacement policy. It gives complete confidence in product purity. The almonds tasted exceptionally fresh.",
  "Bought salted pistachios and Chilean walnuts yesterday. Packaging was premium and crunchiness was top grade. Will certainly order again.",
  "Their California almonds are crunchy and full of natural oils. Fast home delivery within Ujjain. So glad we discovered ShubhMewa.",
  "Excellent dry fruits store in Ujjain! The staff is courteous, portions are accurate, and prices are very fair for this high level of quality.",
  "ShubhMewa's Phool Makhana is large, clean, and has zero grit or residue. Perfect quality for fasting and daily healthy snacks.",
  "Ordered an assortment of dry fruits and seeds online. Reached my doorstep in Ujjain in just a few hours. 10/10 experience!",
  "The walnut kernels are light in color, fresh, and have a naturally sweet, buttery flavor. No rancid smell or bitter aftertaste. Truly grade-one.",
  "Great customer support on WhatsApp and phone. They helped me pick the right nuts for gifting. My relatives loved the premium dry fruit packs.",
  "Fresh harvest dry fruits at reasonable rates. The W240 cashews are big and creamy. Best dry fruit shopping experience in Ujjain.",
  "Cleanliness, quick service, and superior product quality define ShubhMewa. Delighted to have such a reliable dry fruits brand in Ujjain.",
  "Ordered California jumbo almonds and chia seeds. The freshness is noticeable from the first bite. Very satisfied with the timely delivery.",
  "Love the fact that every nut is double-sorted. Not a single defective almond or cashew in the entire pouch. Pure quality!",
  "Great shopping experience at Fawara Chowk. The store is well-maintained and the dry fruits are displayed hygienically. Highly recommended.",
  "Their royal dates are soft, rich, and naturally sweet without any artificial syrup. Wonderful healthy snack option for kids and elders alike.",
  "Super fast delivery service in Ujjain. Received fresh, crispy almonds and walnuts neatly sealed in premium food-grade packaging.",
  "ShubhMewa has the best walnuts and cashews in town. Freshness and quality are consistently maintained on every purchase.",
  "I have tried many shops in Ujjain, but the aroma and crunch of ShubhMewa almonds are unmatched. 5 stars for authentic quality.",
  "Very friendly staff who patiently let you check the grade of nuts before buying. Sourced fresh and transparent pricing.",
  "The roasted salted pistachios were evenly split and perfectly salted. Great crunch and freshness. Best evening snack!",
  "Ordered dry fruit hampers for a family function in Ujjain. Guests praised the quality of almonds and cashews. Thank you ShubhMewa team.",
  "Top quality dry fruits and superfoods! The makhana is large and crisp, and the almonds are uniform. Outstanding service.",
  "Got free doorstep delivery in Ujjain for my order above ₹399. Everything was packed fresh and delivered safely on time.",
  "The Chilean walnuts are of supreme grade. Extremely light halves and buttery texture. Pure nutrition without any bitterness.",
  "ShubhMewa stands for authentic purity. Their California almonds are whole, undamaged, and super fresh. Very happy customer!",
  "Pleasant visit to their boutique store at Tilak Marg, Ujjain. The dry fruits are clean, well-graded, and affordably priced.",
  "Consistent freshness and polite service every single time. ShubhMewa is our family's trusted dry fruits shop in Ujjain.",
  "High protein Phool Makhana from ShubhMewa has become a daily staple in our diet. Exceptionally clean and crisp.",
  "Ordered via phone and received prompt response and quick delivery. The jumbo almonds and cashews exceeded our expectations.",
  "If you want genuine grade-one dry fruits in Ujjain, ShubhMewa at Fawara Chowk is the best destination. Top quality guaranteed.",
  "The vacuum sealed packaging preserves the natural crunch and aroma of nuts. Loved their cashews and Medjool dates!",
  "Very impressed with the hygiene standards and premium presentation. ShubhMewa is a genuine gem for dry fruit lovers in Ujjain.",
  "Natural sweetness in their dates and rich creaminess in their cashews. Exceptional quality across all products.",
  "Best dry fruits store in Ujjain by far! Prompt delivery, honest weight, and hand-sorted grade-one almonds.",
  "Their Chilean extra light walnuts are fresh and full of natural nutrients. Great shop with honest pricing.",
  "We regularly buy almonds, seeds, and pistachios from ShubhMewa. The quality is always fresh and dependable.",
  "Staff is polite, ordering is seamless, and product quality is second to none. Proud to have ShubhMewa in Ujjain.",
  "Delicious, crunchy, and freshly packed dry fruits delivered right to our home. ShubhMewa is 5 stars all the way!"
];

export default function ReviewPage() {
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCopyOverlay, setShowCopyOverlay] = useState(false);
  const [overlayText, setOverlayText] = useState("Copied & Opening Google Review…");
  const [toast, setToast] = useState<{ show: boolean; msg: string; isError?: boolean }>({ show: false, msg: "" });
  const [confetti, setConfetti] = useState<Array<{ id: number; left: number; bg: string; delay: number; dur: number }>>([]);
  const [lastIndex, setLastIndex] = useState(-1);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("shubhmewa_last_review");
      if (saved) setReview(saved);
    } catch {}
  }, []);

  const triggerToast = (msg: string, isError = false) => {
    setToast({ show: true, msg, isError });
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000);
  };

  const fireConfetti = () => {
    const colors = ["#173C2D", "#B88A44", "#D4A359", "#FBF5EB", "#255C46", "#FFFFFF", "#EADCC8"];
    const pieces = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      bg: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 1.2,
      dur: Math.random() * 2 + 2.5,
    }));
    setConfetti(pieces);
    setTimeout(() => setConfetti([]), 5000);
  };

  const handleGenerate = () => {
    setLoading(true);
    setTimeout(() => {
      let idx: number;
      do {
        idx = Math.floor(Math.random() * REVIEWS.length);
      } while (idx === lastIndex && REVIEWS.length > 1);
      setLastIndex(idx);
      const selectedReview = REVIEWS[idx];

      setReview(selectedReview);
      setLoading(false);
      try {
        localStorage.setItem("shubhmewa_last_review", selectedReview);
      } catch {}

      // Copy automatically
      navigator.clipboard?.writeText(selectedReview);

      fireConfetti();
      setOverlayText("Copied & Opening Google Review…");
      setShowCopyOverlay(true);

      setTimeout(() => {
        setShowCopyOverlay(false);
        window.open(GOOGLE_REVIEW_URL, "_blank", "noopener,noreferrer");
      }, 1200);
    }, 450);
  };

  const handleCopy = () => {
    if (!review.trim()) {
      triggerToast("Generate a review first.", true);
      return;
    }
    navigator.clipboard?.writeText(review);
    triggerToast("✓ Review copied to clipboard!");
    setOverlayText("Copied to clipboard!");
    setShowCopyOverlay(true);
    setTimeout(() => setShowCopyOverlay(false), 900);
  };

  const handleOpenGoogle = () => {
    window.open(GOOGLE_REVIEW_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-[#FFFDF8] text-[#1A1A1A] font-sans flex flex-col items-center px-4 py-8 relative overflow-x-hidden">
      {/* Ambient background glows */}
      <div className="fixed -top-24 -left-24 w-80 h-80 rounded-full bg-[#173C2D]/10 blur-[80px] pointer-events-none" />
      <div className="fixed bottom-24 -right-20 w-72 h-72 rounded-full bg-[#B88A44]/10 blur-[80px] pointer-events-none" />

      {/* Confetti container */}
      {confetti.length > 0 && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {confetti.map((c) => (
            <div
              key={c.id}
              className="absolute w-2 h-2 rounded-xs animate-bounce"
              style={{
                left: `${c.left}vw`,
                top: "-10px",
                backgroundColor: c.bg,
                animationDuration: `${c.dur}s`,
                animationDelay: `${c.delay}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Toast Notification */}
      <div
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full bg-white border shadow-lg text-sm font-semibold transition-all duration-300 ${
          toast.show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none"
        } ${toast.isError ? "border-red-400 text-red-600" : "border-[#B88A44] text-[#173C2D]"}`}
      >
        {toast.msg}
      </div>

      <div className="w-full max-w-[580px] flex flex-col gap-5 z-10">
        {/* Announcement Banner */}
        <div className="bg-[#173C2D] text-[#F7F1E8] text-xs font-semibold px-4 py-2 rounded-full flex items-center justify-center gap-2 text-center shadow-sm border border-[#B88A44]/30">
          <span>🚚 Free Delivery in Ujjain over ₹399</span>
          <span>•</span>
          <span className="text-[#D4A359]">Full Refund Guaranteed</span>
        </div>

        {/* Brand Header */}
        <div className="text-center pt-3 pb-1">
          <div className="w-20 h-20 mx-auto rounded-full border-2 border-[#B88A44] bg-[#B88A44]/10 flex items-center justify-center text-3xl shadow-sm mb-3">
            🌰
          </div>
          <h1 className="font-serif-editorial text-4xl font-bold tracking-wide uppercase leading-none">
            <span className="text-[#173C2D]">Shubh</span>
            <span className="text-[#B88A44]">Mewa</span>
          </h1>
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#B88A44] font-semibold mt-1.5">
            Pure Indian Dry Fruit &amp; Superfood Brand
          </p>
          <p className="text-xs text-[#6B6B6B] mt-0.5">
            Fawara Chowk • Daulat Ganj • Ujjain
          </p>
        </div>

        {/* Hero Card */}
        <div className="bg-gradient-to-br from-white to-[#FBF5EB] border border-[#B88A44]/25 rounded-2xl p-6 text-center shadow-sm relative overflow-hidden">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B88A44]/10 border border-[#B88A44]/25 text-[11px] font-semibold text-[#173C2D] uppercase tracking-wider mb-4">
            <span className="w-2 h-2 rounded-full bg-[#B88A44]" />
            Verified Customer Experience
          </div>
          <h2 className="font-serif-editorial text-3xl md:text-4xl font-bold text-[#173C2D] leading-tight mb-2">
            Rate Your <span className="text-[#B88A44]">ShubhMewa Experience</span>
          </h2>
          <p className="text-xs md:text-sm text-[#4A453E] leading-relaxed max-w-md mx-auto">
            Your genuine feedback helps us continue providing hand-sorted, fresh dry fruits &amp; superfoods to families across Ujjain.
          </p>
          <div className="flex justify-center gap-2 mt-4 text-2xl text-[#B88A44]">
            <span>★</span>
            <span>★</span>
            <span>★</span>
            <span>★</span>
            <span>★</span>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="bg-white/80 border border-[#B88A44]/20 rounded-xl p-2.5">
            <span className="text-lg">🌰</span>
            <span className="block font-serif-editorial font-bold text-sm text-[#173C2D]">100%</span>
            <span className="block text-[9px] uppercase tracking-wider text-[#6B6B6B] font-semibold">Sourced Fresh</span>
          </div>
          <div className="bg-white/80 border border-[#B88A44]/20 rounded-xl p-2.5">
            <span className="text-lg">🚚</span>
            <span className="block font-serif-editorial font-bold text-sm text-[#173C2D]">₹399+</span>
            <span className="block text-[9px] uppercase tracking-wider text-[#6B6B6B] font-semibold">Free Delivery</span>
          </div>
          <div className="bg-white/80 border border-[#B88A44]/20 rounded-xl p-2.5">
            <span className="text-lg">⭐</span>
            <span className="block font-serif-editorial font-bold text-sm text-[#173C2D]">5.0 ★</span>
            <span className="block text-[9px] uppercase tracking-wider text-[#6B6B6B] font-semibold">Google Rating</span>
          </div>
          <div className="bg-white/80 border border-[#B88A44]/20 rounded-xl p-2.5">
            <span className="text-lg">🛡️</span>
            <span className="block font-serif-editorial font-bold text-sm text-[#173C2D]">Full</span>
            <span className="block text-[9px] uppercase tracking-wider text-[#6B6B6B] font-semibold">Refund Assured</span>
          </div>
        </div>

        {/* Review Generator Card */}
        <div className="bg-gradient-to-br from-white to-[#FBF5EB] border border-[#B88A44]/25 rounded-2xl p-6 shadow-sm">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#173C2D] mb-3 flex items-center gap-2">
            <span>Generate Your Review</span>
            <div className="flex-1 h-[1px] bg-gradient-to-r from-[#B88A44]/35 to-transparent" />
          </div>

          <div className="relative mb-4">
            <textarea
              value={review}
              readOnly
              placeholder='Tap "Click Here For Review" below to get an authentic 5-star review you can post on Google…'
              className="w-full min-h-[135px] bg-[#FBF5EB]/60 border border-[#B88A44]/30 rounded-xl p-4 text-sm text-[#1A1A1A] leading-relaxed resize-none focus:outline-none focus:border-[#B88A44]"
            />
            <div className="absolute bottom-3 right-3 text-[10px] text-[#6B6B6B]">
              {review.length} / 300
            </div>

            {/* Copy success overlay */}
            {showCopyOverlay && (
              <div className="absolute inset-0 bg-[#FFFDF8]/95 rounded-xl flex flex-col items-center justify-center gap-1">
                <span className="text-3xl">✅</span>
                <span className="text-xs font-semibold text-[#173C2D]">{overlayText}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2.5">
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-[#173C2D] hover:bg-[#255C46] text-white font-semibold text-sm transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3v3M18.36 5.64l-2.12 2.12M21 12h-3M18.36 18.36l-2.12-2.12M12 21v-3M5.64 18.36l2.12-2.12M3 12h3M5.64 5.64l2.12 2.12"/>
              </svg>
              <span>{loading ? "Generating..." : "Click Here For Review"}</span>
            </button>

            <button
              onClick={handleCopy}
              className="w-full py-3 px-4 rounded-xl border border-[#B88A44] hover:bg-[#B88A44]/10 text-[#173C2D] font-semibold text-sm transition-all flex items-center justify-center gap-2"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
              <span>Copy Review</span>
            </button>

            <div className="flex items-center gap-3 my-1">
              <div className="flex-1 h-[1px] bg-[#B88A44]/20" />
              <span className="text-[10px] uppercase text-[#6B6B6B] font-bold">or</span>
              <div className="flex-1 h-[1px] bg-[#B88A44]/20" />
            </div>

            <button
              onClick={handleOpenGoogle}
              className="w-full py-2.5 px-4 rounded-xl bg-white border border-[#B88A44]/30 hover:border-[#B88A44] text-[#4A453E] hover:text-[#173C2D] font-medium text-xs transition-all flex items-center justify-center gap-2"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <span>Open Google Review Page</span>
            </button>
          </div>
        </div>

        {/* Boutique Store Info Card */}
        <div className="bg-[#173C2D]/5 border border-dashed border-[#B88A44]/50 rounded-2xl p-4 text-xs text-[#4A453E] flex flex-col gap-2">
          <div className="font-serif-editorial font-bold text-base text-[#173C2D] flex items-center gap-1.5">
            <span>📍</span> ShubhMewa Boutique Store • Ujjain
          </div>
          <div className="flex items-start gap-2 leading-relaxed">
            <span className="text-[#B88A44]">🗺️</span>
            <span>Shop No. 5, Gali No. 4, Tilak Marg, Dev Sahab Ki Gali, Fawara Chowk, Daulat Ganj, Ujjain, MP</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#B88A44]">⏰</span>
            <span>10:00 AM – 09:30 PM (All Days Open)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#B88A44]">📞</span>
            <span>
              Call &amp; WhatsApp: <a href="tel:8982010210" className="text-[#173C2D] font-bold underline">+91 89820 10210</a>
            </span>
          </div>
        </div>

        {/* Sourcing Standard / Guarantees */}
        <div className="bg-gradient-to-br from-white to-[#FBF5EB] border border-[#B88A44]/25 rounded-2xl p-6 shadow-sm">
          <div className="text-center mb-4">
            <h3 className="font-serif-editorial text-2xl font-bold text-[#173C2D]">
              ♛ The ShubhMewa Sourcing Standard
            </h3>
            <p className="text-xs text-[#6B6B6B] mt-0.5">
              Pure nutrition, hand-sorted freshness • every order counts
            </p>
          </div>

          <div className="flex flex-col gap-2.5">
            <div className="p-3 bg-white/70 border border-[#B88A44]/20 rounded-xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-xl">🚚</span>
                <div>
                  <span className="block text-xs font-bold text-[#173C2D]">Free Home Delivery Across Ujjain</span>
                  <span className="block text-[11px] text-[#6B6B6B]">Free same-day or 24h delivery on orders over ₹399</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#B88A44]/15 text-[#B88A44]">₹399+</span>
            </div>

            <div className="p-3 bg-white/70 border border-[#B88A44]/20 rounded-xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-xl">🌰</span>
                <div>
                  <span className="block text-xs font-bold text-[#173C2D]">100% Hand-Sorted Grade-1 Nuts</span>
                  <span className="block text-[11px] text-[#6B6B6B]">Double manual sort for uniform size, clean crunch &amp; zero bitterness</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#B88A44]/15 text-[#B88A44]">Premium</span>
            </div>

            <div className="p-3 bg-white/70 border border-[#B88A44]/20 rounded-xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-xl">🛡️</span>
                <div>
                  <span className="block text-xs font-bold text-[#173C2D]">Full Refund &amp; Replacement Assurance</span>
                  <span className="block text-[11px] text-[#6B6B6B]">Complete peace of mind guarantee on every order</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#B88A44]/15 text-[#B88A44]">Guaranteed</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center pt-2 pb-6">
          <p className="text-xs text-[#6B6B6B] mb-2">
            Thank you for choosing ShubhMewa <span className="text-red-500">❤️</span>
          </p>
          <a
            href="https://www.nexorascale.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-[#B88A44]/30 text-[10px] font-semibold uppercase tracking-wider text-[#6B6B6B] hover:text-[#173C2D] transition-colors"
          >
            <span className="w-4 h-4 rounded bg-[#B88A44] text-white flex items-center justify-center font-bold text-[9px]">N</span>
            <span>Managed &amp; Powered by Nexora Scale</span>
          </a>
        </footer>
      </div>
    </div>
  );
}
