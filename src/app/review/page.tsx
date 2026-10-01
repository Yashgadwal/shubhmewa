"use client";

import React, { useState, useEffect } from "react";

const GOOGLE_REVIEW_URL = "https://share.google/IMnqjSCB6lR9pgXvC";

const REVIEWS = [
  "Best shop in Ujjain for both dry fruits and pure masalas! The almonds are big and crunchy, and the aroma of their whole garam masala is unbeatable.",
  "Purchased dry fruits and spices for my family function from M/S Best Quality in Kharakua Colony. The quality, packaging, and rates were completely unmatched.",
  "The Kashmiri walnuts and W240 cashews are extremely fresh. No rancid taste at all. Truly lives up to its name — Best Quality!",
  "Their whole spices, especially green cardamom (elaichi) and cloves, have such a strong, pure fragrance. You won't find this quality in packed supermarket brands.",
  "Located near Shree Krishna Dudh Bhandar, Daulatganj. Very honest shopkeeper, accurate weighing, and genuinely reasonable prices for grade-one dry fruits.",
  "Got Phool Makhana, jumbo California badam, and pure saffron (kesar). Absolutely authentic products. A trusted shop in Ujjain.",
  "One-stop destination for all grocery, dry fruits, and masala requirements. Clean store and very polite customer service.",
  "I have been buying daily spices and dry fruits from here for months. Consistency in quality is 10/10. Highly recommend M/S Best Quality.",
  "The best dry fruit store in Daulatganj, Ujjain. The king size cashews are wholesome, sweet, and uniform. Very fair rates!",
  "Their freshly blended garam masala and sabji masala add such an authentic taste to food. Pure ingredients without any adulteration.",
  "Amazing experience! Visited their store near Shree Krishna Dudh Bhandar. The staff is welcoming and helped me choose the best grade nuts.",
  "Ordered dry fruit gift hampers for Diwali. The presentation was royal and the dry fruits were fresh and crisp. Everyone loved it!",
  "Their roasted salted pistachios and Afghan anjeer are top tier. Always fresh stock available. 5 stars for quality and service.",
  "Authentic spices with genuine aroma. Their haldi, mirch, and dhaniya are completely pure and unadulterated. Must visit in Ujjain.",
  "Best place in Kharakua Colony for wedding dry fruit shopping. They offer wholesale rates on bulk purchases and pack everything neatly.",
  "The walnuts are extra light, buttery, and have zero bitterness. M/S Best Quality really maintains high standards.",
  "Superb customer service! The owner is very humble and guides you on the best products according to your budget.",
  "Their Phool Makhana is large, clean, and perfectly crunchy. Ideal for evening fasting snacks. Very satisfied.",
  "If you want genuine grade-one dry fruits and aromatic khada masala in Ujjain, this is the best shop. Honest pricing and pure quality.",
  "The Medjool dates and soft black raisins were delicious and fresh. Clean packaging and prompt assistance at the store.",
  "Very reliable shop in Daulatganj area. Whether it is daily kitchen spices or premium dry fruits, they never compromise on purity.",
  "Bought almonds, cashews, and elaichi for prasad. The fragrance of cardamom filled the whole room! Truly pure quality.",
  "Best shop near Shree Krishna Dudh Bhandar. You get premium quality dry fruits at prices much lower than branded supermarket packs.",
  "Clean, hygienic store with a complete range of spices, dry fruits, and seeds. The shopkeeper is courteous and helpful.",
  "The California jumbo almonds are fresh, whole, and have no broken pieces. You can taste the rich natural oils in every bite.",
  "I always recommend M/S Best Quality to my friends and relatives in Ujjain. Honest dealing, perfect weight, and best quality goods.",
  "Their whole khada masala mix is extraordinary. It makes curries and biryani smell like royal catering. Excellent product!",
  "Great variety of nutritious seeds like chia seeds, pumpkin seeds, and flax seeds along with premium nuts. Very impressed.",
  "Visited the shop in Kharakua Colony, Ujjain. Excellent quality dry fruits and fresh spices at genuine wholesale rates.",
  "The saffron (kesar) purchased from here was 100% authentic and gave rich color and aroma to our sweets. Highly satisfied!",
  "Top quality raisins and figs (anjeer). They take utmost care in maintaining freshness and keeping everything dust-free.",
  "Great shopping experience! Very polite behavior and quick billing. Best quality dry fruits and masala store in Ujjain.",
  "Honest shopkeeper with transparent rates. The cashews are whole and crunchy, and the dates are naturally soft and sweet.",
  "We purchased dry fruits for our newborn and mother. All items were fresh harvest, clean, and packed with care. Thank you!",
  "Best place in Ujjain for pure Hing and whole spices. The flavor and aroma are long-lasting and rich.",
  "The split salted pistachios are roasted to perfection with just the right amount of salt. My family's favorite evening snack.",
  "Wide assortment of premium nuts, makhana, spices, and pooja essentials. Very convenient location near Shree Krishna Dudh Bhandar.",
  "Their Chilean walnuts are clean and have a delightful mild taste. Highly recommended for daily brain nutrition.",
  "Pure and aromatic spices that remind you of traditional home-ground taste. M/S Best Quality is a blessing for Ujjain kitchens.",
  "Affordable prices without any compromise on dry fruit size or freshness. Will always buy from M/S Best Quality.",
  "The staff is helpful and lets you inspect the quality before purchasing. Everything is clean and well-arranged.",
  "Exceptional quality of dry fruits and whole spices. The gift packing for our family function was praised by all guests.",
  "The aroma of green elaichi and cloves from this shop is unmatched. Best grocery and dry fruits merchant in Daulatganj.",
  "From crunchy lotus seeds (makhana) to royal dates, every item was fresh and properly sealed. 5 stars all the way!",
  "Reliable and ethical business in Ujjain. They treat every customer with utmost respect and offer genuine rates.",
  "A trusted name in Kharakua Colony for fresh dry fruits. Our family has been buying from here and we are always delighted.",
  "The king-size cashews (kaju) are large, creamy, and unbroken. Excellent value for money!",
  "Fresh harvest dry fruits, authentic aromatic spices, and honest weighing. M/S Best Quality is truly the best in town.",
  "Very satisfied with the prompt service and superior quality of all items. Best dryfruits and masala house in Ujjain.",
  "Outstanding experience! Authentic products, polite service, and reasonable prices. Highly recommended to everyone in Ujjain."
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
      const saved = localStorage.getItem("msbestquality_last_review");
      if (saved) setReview(saved);
    } catch {}
  }, []);

  const triggerToast = (msg: string, isError = false) => {
    setToast({ show: true, msg, isError });
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000);
  };

  const fireConfetti = () => {
    const colors = ["#851818", "#C28B1E", "#D9A438", "#FBF4E6", "#A32424", "#FFFFFF", "#EBDDC6"];
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
        localStorage.setItem("msbestquality_last_review", selectedReview);
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
    <div className="min-h-screen bg-[#FFFDF9] text-[#1C1917] font-sans flex flex-col items-center px-4 py-8 relative overflow-x-hidden">
      {/* Ambient background glows */}
      <div className="fixed -top-24 -left-24 w-80 h-80 rounded-full bg-[#851818]/10 blur-[80px] pointer-events-none" />
      <div className="fixed bottom-24 -right-20 w-72 h-72 rounded-full bg-[#C28B1E]/12 blur-[80px] pointer-events-none" />

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
        } ${toast.isError ? "border-red-400 text-red-600" : "border-[#C28B1E] text-[#851818]"}`}
      >
        {toast.msg}
      </div>

      <div className="w-full max-w-[580px] flex flex-col gap-5 z-10">
        {/* Announcement Banner */}
        <div className="bg-[#851818] text-[#F6EFE2] text-xs font-semibold px-4 py-2 rounded-full flex items-center justify-center gap-2 text-center shadow-sm border border-[#C28B1E]/35">
          <span>🌟 Pure Quality Dryfruits &amp; Authentic Masalas</span>
          <span>•</span>
          <span className="text-[#D9A438]">Ujjain's Trusted Destination</span>
        </div>

        {/* Brand Header */}
        <div className="text-center pt-3 pb-1">
          <div className="w-20 h-20 mx-auto rounded-full border-2 border-[#C28B1E] bg-[#C28B1E]/10 flex items-center justify-center text-3xl shadow-sm mb-3">
            🌰
          </div>
          <h1 className="font-serif-editorial text-3xl md:text-4xl font-bold tracking-wide uppercase leading-tight">
            <span className="text-[#851818] mr-1.5 text-2xl md:text-3xl">M/S</span>
            <span className="text-[#851818]">Best Quality</span>
          </h1>
          <p className="text-[11px] uppercase tracking-[0.22em] text-[#C28B1E] font-bold mt-1.5">
            Dryfruits &amp; Masala House
          </p>
          <p className="text-xs text-[#78716C] mt-1 flex items-center justify-center gap-1">
            <span>📍</span> Near Shree Krishna Dudh Bhandar, Kharakua Colony, Daulatganj, Ujjain
          </p>
        </div>

        {/* Hero Card */}
        <div className="bg-gradient-to-br from-white to-[#FBF4E6] border border-[#C28B1E]/30 rounded-2xl p-6 text-center shadow-sm relative overflow-hidden">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C28B1E]/10 border border-[#C28B1E]/30 text-[11px] font-semibold text-[#851818] uppercase tracking-wider mb-4">
            <span className="w-2 h-2 rounded-full bg-[#C28B1E]" />
            Verified Customer Feedback
          </div>
          <h2 className="font-serif-editorial text-2xl md:text-3xl font-bold text-[#851818] leading-tight mb-2">
            Rate Your <span className="text-[#C28B1E]">M/S Best Quality Experience</span>
          </h2>
          <p className="text-xs md:text-sm text-[#44403C] leading-relaxed max-w-md mx-auto">
            Your genuine feedback helps food lovers and families in Ujjain discover the finest hand-sorted dry fruits, aromatic masalas &amp; spices.
          </p>
          <div className="flex justify-center gap-2 mt-4 text-2xl text-[#C28B1E]">
            <span>★</span>
            <span>★</span>
            <span>★</span>
            <span>★</span>
            <span>★</span>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="bg-white/85 border border-[#C28B1E]/20 rounded-xl p-2.5">
            <span className="text-lg">🌰</span>
            <span className="block font-serif-editorial font-bold text-sm text-[#851818]">100%</span>
            <span className="block text-[9px] uppercase tracking-wider text-[#78716C] font-semibold">Pure Dryfruits</span>
          </div>
          <div className="bg-white/85 border border-[#C28B1E]/20 rounded-xl p-2.5">
            <span className="text-lg">🌿</span>
            <span className="block font-serif-editorial font-bold text-sm text-[#851818]">Aromatic</span>
            <span className="block text-[9px] uppercase tracking-wider text-[#78716C] font-semibold">Pure Spices</span>
          </div>
          <div className="bg-white/85 border border-[#C28B1E]/20 rounded-xl p-2.5">
            <span className="text-lg">⭐</span>
            <span className="block font-serif-editorial font-bold text-sm text-[#851818]">4.7+ ★</span>
            <span className="block text-[9px] uppercase tracking-wider text-[#78716C] font-semibold">Google Rating</span>
          </div>
          <div className="bg-white/85 border border-[#C28B1E]/20 rounded-xl p-2.5">
            <span className="text-lg">⚖️</span>
            <span className="block font-serif-editorial font-bold text-sm text-[#851818]">Honest</span>
            <span className="block text-[9px] uppercase tracking-wider text-[#78716C] font-semibold">Best Rates</span>
          </div>
        </div>

        {/* Review Generator Card */}
        <div className="bg-gradient-to-br from-white to-[#FBF4E6] border border-[#C28B1E]/30 rounded-2xl p-6 shadow-sm">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#851818] mb-3 flex items-center gap-2">
            <span>Generate Your Review</span>
            <div className="flex-1 h-[1px] bg-gradient-to-r from-[#C28B1E]/35 to-transparent" />
          </div>

          <div className="relative mb-4">
            <textarea
              value={review}
              readOnly
              placeholder='Tap "Click Here For Review" below to get an authentic 5-star review you can post on Google…'
              className="w-full min-h-[135px] bg-[#FBF4E6]/60 border border-[#C28B1E]/30 rounded-xl p-4 text-sm text-[#1C1917] leading-relaxed resize-none focus:outline-none focus:border-[#C28B1E]"
            />
            <div className="absolute bottom-3 right-3 text-[10px] text-[#78716C]">
              {review.length} / 300
            </div>

            {/* Copy success overlay */}
            {showCopyOverlay && (
              <div className="absolute inset-0 bg-[#FFFDF9]/95 rounded-xl flex flex-col items-center justify-center gap-1">
                <span className="text-3xl">✅</span>
                <span className="text-xs font-semibold text-[#851818]">{overlayText}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2.5">
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-[#851818] hover:bg-[#A32424] text-white font-semibold text-sm transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3v3M18.36 5.64l-2.12 2.12M21 12h-3M18.36 18.36l-2.12-2.12M12 21v-3M5.64 18.36l2.12-2.12M3 12h3M5.64 5.64l2.12 2.12"/>
              </svg>
              <span>{loading ? "Generating..." : "Click Here For Review"}</span>
            </button>

            <button
              onClick={handleCopy}
              className="w-full py-3 px-4 rounded-xl border border-[#C28B1E] hover:bg-[#C28B1E]/10 text-[#851818] font-semibold text-sm transition-all flex items-center justify-center gap-2"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
              <span>Copy Review</span>
            </button>

            <div className="flex items-center gap-3 my-1">
              <div className="flex-1 h-[1px] bg-[#C28B1E]/20" />
              <span className="text-[10px] uppercase text-[#78716C] font-bold">or</span>
              <div className="flex-1 h-[1px] bg-[#C28B1E]/20" />
            </div>

            <button
              onClick={handleOpenGoogle}
              className="w-full py-2.5 px-4 rounded-xl bg-white border border-[#C28B1E]/30 hover:border-[#C28B1E] text-[#44403C] hover:text-[#851818] font-medium text-xs transition-all flex items-center justify-center gap-2"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <span>Open Google Review Page</span>
            </button>
          </div>
        </div>

        {/* Store Info Card */}
        <div className="bg-[#851818]/5 border border-dashed border-[#C28B1E]/50 rounded-2xl p-4 text-xs text-[#44403C] flex flex-col gap-2">
          <div className="font-serif-editorial font-bold text-base text-[#851818] flex items-center gap-1.5">
            <span>📍</span> Store Location • Ujjain
          </div>
          <div className="flex items-start gap-2 leading-relaxed">
            <span className="text-[#C28B1E]">🗺️</span>
            <span>
              <strong>M/S Best Quality Dryfruits and Masala House</strong><br />
              Near Shree Krishna Dudh Bhandar, Kharakua Colony, Daulatganj, Ujjain, Madhya Pradesh - 456010
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#C28B1E]">⏰</span>
            <span>Open All Days • Morning to Evening Market Hours</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#C28B1E]">🔗</span>
            <span>
              Google Listing: <a href="https://share.google/IMnqjSCB6lR9pgXvC" target="_blank" rel="noopener" className="text-[#851818] font-bold underline">share.google/IMnqjSCB6lR9pgXvC</a>
            </span>
          </div>
        </div>

        {/* Quality Assurance Section */}
        <div className="bg-gradient-to-br from-white to-[#FBF4E6] border border-[#C28B1E]/30 rounded-2xl p-6 shadow-sm">
          <div className="text-center mb-4">
            <h3 className="font-serif-editorial text-2xl font-bold text-[#851818]">
              ♛ The Best Quality Standard
            </h3>
            <p className="text-xs text-[#78716C] mt-0.5">
              Pure dry fruits, authentic whole spices &amp; honest pricing
            </p>
          </div>

          <div className="flex flex-col gap-2.5">
            <div className="p-3 bg-white/75 border border-[#C28B1E]/20 rounded-xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-xl">🌰</span>
                <div>
                  <span className="block text-xs font-bold text-[#851818]">Hand-Picked Grade-1 Dry Fruits</span>
                  <span className="block text-[11px] text-[#78716C]">California badam, king size kaju, akhrot giri, makhana &amp; munakka</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#C28B1E]/15 text-[#C28B1E]">Fresh</span>
            </div>

            <div className="p-3 bg-white/75 border border-[#C28B1E]/20 rounded-xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-xl">🌿</span>
                <div>
                  <span className="block text-xs font-bold text-[#851818]">Aromatic Spices &amp; Khada Masala</span>
                  <span className="block text-[11px] text-[#78716C]">Green cardamom, cloves, cinnamon, pure hing &amp; Kashmiri saffron</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#C28B1E]/15 text-[#C28B1E]">Aromatic</span>
            </div>

            <div className="p-3 bg-white/75 border border-[#C28B1E]/20 rounded-xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-xl">🎁</span>
                <div>
                  <span className="block text-xs font-bold text-[#851818]">Wedding &amp; Festival Hampers</span>
                  <span className="block text-[11px] text-[#78716C]">Custom gift packing &amp; wholesale pricing for bulk family celebrations</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#C28B1E]/15 text-[#C28B1E]">Gifting</span>
            </div>

            <div className="p-3 bg-white/75 border border-[#C28B1E]/20 rounded-xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-xl">⚖️</span>
                <div>
                  <span className="block text-xs font-bold text-[#851818]">Honest Pricing &amp; Courteous Service</span>
                  <span className="block text-[11px] text-[#78716C]">Accurate weighing, clean packing and trusted local reputation in Ujjain</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#C28B1E]/15 text-[#C28B1E]">Trusted</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center pt-2 pb-6">
          <p className="text-xs text-[#78716C] mb-2">
            Thank you for supporting M/S Best Quality <span className="text-red-500">❤️</span>
          </p>
          <a
            href="https://www.nexorascale.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-[#C28B1E]/30 text-[10px] font-semibold uppercase tracking-wider text-[#78716C] hover:text-[#851818] transition-colors"
          >
            <span className="w-4 h-4 rounded bg-[#C28B1E] text-white flex items-center justify-center font-bold text-[9px]">N</span>
            <span>Managed &amp; Powered by Nexora Scale</span>
          </a>
        </footer>
      </div>
    </div>
  );
}
