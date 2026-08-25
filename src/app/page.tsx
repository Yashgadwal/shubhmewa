import React from "react";
import Link from "next/link";
import { Star, ShieldCheck, Truck, Sparkles, ArrowRight, HeartPulse, MapPin, Clock, Phone, MessageSquare } from "lucide-react";
import { CATEGORIES, PRODUCTS, TESTIMONIALS, DEFAULT_SETTINGS } from "@/lib/static-data";
import HeroCanvas from "@/components/HeroCanvas";
import ProductCard, { ProductWithDetails } from "@/components/ProductCard";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import BulkOrderForm from "@/components/BulkOrderForm";
import HamperBuilder from "@/components/HamperBuilder";

export const revalidate = 0; // Dynamic server-side rendering

export default async function HomePage() {
  const categories = CATEGORIES;
  const products = PRODUCTS;
  const testimonials = TESTIMONIALS;
  const settings = DEFAULT_SETTINGS;
  const banners: any[] = [];

  const whatsappNumber = settings["whatsapp_number"] || "8982010210";
  const contactPhone = settings["contact_phone"] || "8982010210";
  const timings = settings["store_timings"] || "10:00 AM - 09:30 PM (All Days Open)";
  const address = settings["store_address"] || "Shop No. 5, Gali No. 4, Tilak Marg, Dev Sahab Ki Gali, Fawara Chowk, Daulat Ganj, Ujjain, Madhya Pradesh";
  const mapsLink = settings["google_maps_link"] || "https://maps.google.com/?q=Shop+No.+5,+Gali+No.+4,+Tilak+Marg,+Fawara+Chowk,+Daulat+Ganj,+Ujjain";
  const heroTitle = settings["hero_title"] || "Premium Dry Fruits. Packed Fresh. Delivered with Care.";
  const heroSubtitle = settings["hero_subtitle"] || "ShubhMewa brings carefully selected dry fruits, makhana, seeds, spices and gifting essentials to your doorstep.";

  // Filter bestsellers
  const bestsellers = products.filter((p) => p.isBestseller);

  // Health benefits mock list - fully factual and compliant
  const healthBenefits = [
    { name: "California Almonds", desc: "A natural source of healthy fats, protein, and vitamin E. Handpicked for quality.", benefit: "Nutrient Rich" },
    { name: "Chilean Walnuts", desc: "Premium light halves containing naturally occurring nutrients. Buttery taste and premium texture.", benefit: "Naturally Healthy" },
    { name: "Medjool Dates", desc: "Delicious natural sugar replacement, high in taste and texture, providing instant freshness.", benefit: "Instant Refresh" },
    { name: "Salted Pistachios", desc: "Premium crunchy salted split-shell nuts, rich in protein and fiber, roasted to perfection.", benefit: "Roasted Snack" },
  ];

  return (
    <div className="w-full font-sans bg-brand-cream-light/40 overflow-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative w-full min-h-[90vh] flex items-center pt-8 md:pt-0 bg-gradient-to-b from-brand-cream-light to-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full z-10">
          {/* Hero text */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-gold/10 border border-brand-gold/30 rounded-full text-brand-gold">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="text-[10px] tracking-widest font-bold uppercase">Premium Retail Food Brand</span>
            </div>
            
            <h1 className="font-serif-editorial text-4xl md:text-5xl lg:text-6xl text-brand-green font-bold leading-[1.1] tracking-tight">
              {heroTitle}
            </h1>
            
            <p className="text-sm md:text-base text-brand-muted max-w-lg leading-relaxed">
              {heroSubtitle}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                className="bg-[#25D366] hover:bg-[#20ba5a] text-white px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-2 group"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>Order on WhatsApp</span>
              </Link>
              <Link
                href="/shop"
                className="border border-brand-green hover:border-brand-gold text-brand-green hover:text-brand-gold px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all bg-white shadow-xs"
              >
                Explore Products
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-brand-cream-dark/20 max-w-md text-xs text-brand-green font-semibold">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-brand-gold" />
                <span>100% Quality Assured</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-brand-gold" />
                <span>Local Free Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-brand-gold fill-brand-gold" />
                <span>5.0 Rated Store</span>
              </div>
            </div>
          </div>

          {/* Hero 3D visual */}
          <div className="lg:col-span-6 w-full h-[400px] md:h-[550px] relative">
            <HeroCanvas />
          </div>
        </div>
      </section>

      {/* 2. CATEGORY SECTION */}
      <section className="py-20 max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
          <span className="text-[10px] tracking-widest font-bold uppercase text-brand-gold">Select Category</span>
          <h2 className="font-serif-editorial text-3xl md:text-4xl text-brand-green font-bold">
            Shop by Assortment
          </h2>
          <div className="h-[1px] w-20 bg-brand-gold mx-auto mt-3" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              className="group flex flex-col bg-white border border-brand-cream-dark/30 rounded-2xl overflow-hidden transition-all duration-300 hover:border-brand-gold hover:shadow-md"
            >
              <div className="aspect-[4/3] bg-brand-cream-light overflow-hidden">
                <img
                  src={cat.image || "/images/product_almond.jpg"}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="font-serif-editorial text-brand-green font-bold text-base md:text-lg">
                  {cat.name}
                </h3>
                {cat.description && (
                  <p className="text-[10px] text-brand-muted mt-1 uppercase tracking-wide">
                    {cat.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. BESTSELLING PRODUCTS */}
      <section className="py-20 bg-brand-cream-light/30 border-y border-brand-cream-dark/20">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
            <div>
              <span className="text-[10px] tracking-widest font-bold uppercase text-brand-gold">Top Picks</span>
              <h2 className="font-serif-editorial text-3xl md:text-4xl text-brand-green font-bold mt-1">
                Bestselling Specialties
              </h2>
            </div>
            <Link
              href="/shop"
              className="text-xs font-bold uppercase tracking-wider text-brand-green hover:text-brand-gold flex items-center gap-1 mt-4 sm:mt-0 transition-colors"
            >
              <span>View All Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestsellers.slice(0, 4).map((product) => (
              <ProductCard
                key={product.id}
                product={product as unknown as ProductWithDetails}
                whatsappNumber={whatsappNumber}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE US */}
      <section className="py-20 max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
          <span className="text-[10px] tracking-widest font-bold uppercase text-brand-gold">Our Philosophy</span>
          <h2 className="font-serif-editorial text-3xl md:text-4xl text-brand-green font-bold">
            The ShubhMewa Sourcing Standard
          </h2>
          <div className="h-[1px] w-20 bg-brand-gold mx-auto mt-3" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6 space-y-3 bg-white border border-brand-cream-dark/30 rounded-2xl shadow-xs">
            <div className="w-12 h-12 bg-brand-green/10 text-brand-gold rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-serif-editorial text-brand-green font-bold text-lg">Rigorous Sourcing</h3>
            <p className="text-xs text-brand-muted leading-relaxed">
              We import directly from California, Iran, and source Kashmiri walnut halves, selecting only jumbo sizes and white premium grades.
            </p>
          </div>
          <div className="p-6 space-y-3 bg-white border border-brand-cream-dark/30 rounded-2xl shadow-xs">
            <div className="w-12 h-12 bg-brand-green/10 text-brand-gold rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-serif-editorial text-brand-green font-bold text-lg">Hygienic Packaging</h3>
            <p className="text-xs text-brand-muted leading-relaxed">
              Every nut is sorted manually, dry vacuum sealed or packed in airtight premium glass jars to preserve moisture, freshness, and crunch.
            </p>
          </div>
          <div className="p-6 space-y-3 bg-white border border-brand-cream-dark/30 rounded-2xl shadow-xs">
            <div className="w-12 h-12 bg-brand-green/10 text-brand-gold rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="font-serif-editorial text-brand-green font-bold text-lg">Reliable Delivery</h3>
            <p className="text-xs text-brand-muted leading-relaxed">
              Guaranteed home delivery across Ujjain within 4-6 hours. Safe local tracking and convenient cash-on-delivery.
            </p>
          </div>
        </div>
      </section>

      {/* 5. FESTIVAL PROMOTION BANNER */}
      {banners.length > 0 && (
        <section className="w-full relative py-24 bg-brand-green text-brand-cream-light border-y border-brand-gold/30">
          <div className="absolute inset-0 z-0 opacity-15">
            <img
              src={banners[0].image}
              alt="Festival Offer Banner"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="max-w-4xl mx-auto px-4 text-center space-y-6 z-10 relative">
            <span className="text-[10px] tracking-widest font-bold uppercase text-brand-gold">Festival Exclusive</span>
            <h2 className="font-serif-editorial text-4xl md:text-5xl font-bold">
              {banners[0].title}
            </h2>
            <p className="text-sm text-brand-cream-light/80 max-w-xl mx-auto leading-relaxed">
              {banners[0].subtitle}
            </p>
            {banners[0].link && (
              <Link
                href={banners[0].link}
                className="inline-block bg-brand-gold hover:bg-brand-gold/90 text-brand-cream-light px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-md"
              >
                Explore Offer Hampers
              </Link>
            )}
          </div>
        </section>
      )}

      {/* 6. BUILD YOUR OWN HAMPER */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-[10px] tracking-widest font-bold uppercase text-brand-gold">Custom Gifting</span>
            <h2 className="font-serif-editorial text-3xl md:text-4xl text-brand-green font-bold">
              Build Your Own Gift Box
            </h2>
            <div className="h-[1px] w-20 bg-brand-gold mx-auto mt-3" />
          </div>

          <HamperBuilder whatsappNumber={whatsappNumber} />
        </div>
      </section>

      {/* 7. BULK LEAD GENERATION (WEDDING & CELEBRATION) */}
      <section className="py-20 max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-5 space-y-6">
          <span className="text-[10px] tracking-widest font-bold uppercase text-brand-gold">Bulk Enquiries</span>
          <h2 className="font-serif-editorial text-3xl md:text-4xl text-brand-green font-bold leading-tight">
            Celebration & Wedding Royal Gifting Proposals
          </h2>
          <p className="text-xs text-brand-muted leading-relaxed">
            For wedding invites, wedding return favors, and festive celebrations, ShubhMewa designs gold-embossed packages customized to your target budgets.
          </p>
          <div className="space-y-3 pt-2 text-xs text-brand-green font-semibold">
            <p className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-brand-gold" />
              Custom wood-engraving and monogram printing.
            </p>
            <p className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-brand-gold" />
              Premium packaging customized for retail gifting.
            </p>
            <p className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-brand-gold" />
              Express hand delivery options across Ujjain.
            </p>
          </div>
        </div>
        
        <div className="lg:col-span-7">
          <BulkOrderForm whatsappNumber={whatsappNumber} />
        </div>
      </section>

      {/* 8. BRAND STORY */}
      <section className="py-24 bg-brand-cream-light/25 border-y border-brand-cream-dark/15">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="aspect-[4/3] bg-brand-cream-light rounded-3xl overflow-hidden shadow-md">
            <img
              src="/images/shop_interior.jpg"
              alt="ShubhMewa Shop Interior"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-6">
            <span className="text-[10px] tracking-widest font-bold uppercase text-brand-gold">Our Legacy</span>
            <h2 className="font-serif-editorial text-3xl md:text-4xl text-brand-green font-bold">
              ShubhMewa Sourcing Legacy in Ujjain
            </h2>
            <p className="text-xs text-brand-muted leading-relaxed">
              Based in the holy city of Ujjain, Madhya Pradesh, we are dedicated to bringing healthy, premium nuts, seeds, and gourmet items to our patrons. We choose only grade-one items from select growers and import terminals.
            </p>
            <p className="text-xs text-brand-muted leading-relaxed">
              Each almond and cashew kernel undergoes two manual sorting passes to guarantee uniform color, size, and absolute freshness before bagging. Enjoy clean nutrition directly from our Fawara Chowk store.
            </p>
            <Link
              href="/about"
              className="inline-block text-xs font-bold uppercase tracking-wider text-brand-green hover:text-brand-gold border-b border-brand-green hover:border-brand-gold pb-1 transition-all"
            >
              Read Full Brand Story
            </Link>
          </div>
        </div>
      </section>

      {/* 9. HEALTH BENEFITS SECTION */}
      <section className="py-20 max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
          <span className="text-[10px] tracking-widest font-bold uppercase text-brand-gold">Wellness Guide</span>
          <h2 className="font-serif-editorial text-3xl md:text-4xl text-brand-green font-bold">
            Health Profiles of Premium Nuts
          </h2>
          <div className="h-[1px] w-20 bg-brand-gold mx-auto mt-3" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {healthBenefits.map((item, idx) => (
            <div
              key={idx}
              className="bg-white border border-brand-cream-dark/30 rounded-2xl p-5 shadow-xs space-y-3"
            >
              <div className="inline-block bg-brand-green/10 text-brand-gold text-[10px] tracking-wider uppercase font-bold px-2 py-0.5 rounded-md">
                {item.benefit}
              </div>
              <h3 className="font-serif-editorial text-brand-green font-bold text-base md:text-lg">
                {item.name}
              </h3>
              <p className="text-xs text-brand-muted leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
        <p className="text-[9px] text-brand-muted text-center mt-8 italic max-w-md mx-auto">
          *Disclaimer: The above information is general nutrition details and does not constitute medical advice. Consult health experts for custom dietary programs.
        </p>
      </section>

      {/* 10. CUSTOMER REVIEWS */}
      <section className="py-20 bg-brand-cream-light/10">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
            <span className="text-[10px] tracking-widest font-bold uppercase text-brand-gold">Client Feedback</span>
            <h2 className="font-serif-editorial text-3xl md:text-4xl text-brand-green font-bold">
              What Our Patrons Say
            </h2>
            <div className="h-[1px] w-20 bg-brand-gold mx-auto mt-3" />
          </div>

          <TestimonialsCarousel testimonials={testimonials} googleMapsLink={mapsLink} />
        </div>
      </section>

      {/* 11. INSTAGRAM SECTION */}
      <section className="py-20 max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
          <span className="text-[10px] tracking-widest font-bold uppercase text-brand-gold">Social Corner</span>
          <h2 className="font-serif-editorial text-3xl md:text-4xl text-brand-green font-bold">
            Instagram Feed
          </h2>
          <div className="h-[1px] w-20 bg-brand-gold mx-auto mt-3" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {["/images/product_almond.jpg", "/images/hamper_festive.jpg", "/images/product_dates.jpg", "/images/product_cashew.jpg"].map((url, idx) => (
            <div key={idx} className="group relative aspect-square overflow-hidden rounded-2xl bg-brand-cream-light shadow-xs">
              <img
                src={url}
                alt="Instagram Creative Post"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs uppercase tracking-wider font-semibold">
                <span>View Post</span>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link
            href={settings["instagram_link"] || "https://instagram.com/shubhmewa"}
            target="_blank"
            className="inline-block text-xs font-bold uppercase tracking-wider text-brand-green hover:text-brand-gold border border-brand-green hover:border-brand-gold px-8 py-3 rounded-full transition-all"
          >
            Follow on Instagram
          </Link>
        </div>
      </section>

      {/* IMPORTANT BUSINESS POLICIES & SHIPPING DETAILS */}
      <section className="py-20 bg-brand-cream-light/30 border-y border-brand-cream-dark/20">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
            <span className="text-[10px] tracking-widest font-bold uppercase text-brand-gold">Essential Policies</span>
            <h2 className="font-serif-editorial text-3xl md:text-4xl text-brand-green font-bold">
              Important Business Information
            </h2>
            <div className="h-[1px] w-20 bg-brand-gold mx-auto mt-3" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            <div className="bg-white border border-brand-cream-dark/20 p-6 rounded-2xl space-y-3 shadow-xs">
              <span className="text-brand-gold font-bold text-[10px] tracking-wider uppercase bg-brand-gold/10 px-2.5 py-1 rounded">01. Same/Next Day Cutoff</span>
              <p className="text-xs text-brand-muted leading-relaxed">
                For Ujjain orders, standard delivery is completed same-day or next-day. Orders placed after 5:00 PM will be processed on the next business day.
              </p>
            </div>
            <div className="bg-white border border-brand-cream-dark/20 p-6 rounded-2xl space-y-3 shadow-xs">
              <span className="text-brand-gold font-bold text-[10px] tracking-wider uppercase bg-brand-gold/10 px-2.5 py-1 rounded">02. Bulk Order Non-Cancellation</span>
              <p className="text-xs text-brand-muted leading-relaxed">
                Any order with a quantity of 10 or more units is treated as a Bulk Order and cannot be cancelled or refunded under any circumstances.
              </p>
            </div>
            <div className="bg-white border border-brand-cream-dark/20 p-6 rounded-2xl space-y-3 shadow-xs">
              <span className="text-brand-gold font-bold text-[10px] tracking-wider uppercase bg-brand-gold/10 px-2.5 py-1 rounded">03. 12-Hour Reporting Window</span>
              <p className="text-xs text-brand-muted leading-relaxed">
                Damaged products, missing items, or weight discrepancies must be reported to our support number within 12 hours of delivery.
              </p>
            </div>
            <div className="bg-white border border-brand-cream-dark/20 p-6 rounded-2xl space-y-3 shadow-xs">
              <span className="text-brand-gold font-bold text-[10px] tracking-wider uppercase bg-brand-gold/10 px-2.5 py-1 rounded">04. Replacement Only Policy</span>
              <p className="text-xs text-brand-muted leading-relaxed">
                We maintain a strict "No Refund. Replacement Only" policy. Replacements will be dispatched once verified by our logistics team.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 12. LOCAL TRUST SECTION */}
      <section className="py-20 bg-white border-t border-brand-cream-dark/20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-[10px] tracking-widest font-bold uppercase text-brand-gold">Find Our Shop</span>
            <h2 className="font-serif-editorial text-3xl md:text-4xl text-brand-green font-bold">
              Visit Us in Ujjain
            </h2>
            
            <div className="space-y-4 text-xs text-brand-green">
              <div className="flex gap-3">
                <MapPin className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
                <p className="leading-relaxed">{address}</p>
              </div>
              <div className="flex gap-3">
                <Clock className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
                <p className="leading-relaxed">{timings}</p>
              </div>
              <div className="flex gap-3">
                <Phone className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
                <p className="leading-relaxed">{contactPhone}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href={mapsLink}
                target="_blank"
                className="bg-brand-green hover:bg-brand-green/95 text-brand-cream-light px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md"
              >
                Directions
              </Link>
              <Link
                href={`tel:${contactPhone}`}
                className="border border-brand-green hover:border-brand-gold text-brand-green hover:text-brand-gold px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
              >
                Call Shop
              </Link>
            </div>
          </div>

          {/* Interactive Google Map Mapbox/Iframe */}
          <div className="lg:col-span-7 w-full h-[350px] bg-brand-cream-light rounded-3xl overflow-hidden border border-brand-cream-dark/40 shadow-xs relative">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14686.096739414272!2d75.78018314441584!3d23.169305141014167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39637446af090b8f%3A0xe9f7b03b41d24c01!2sFreeganj%2C%20Madhya%20Pradesh%20456010!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>

      {/* 13. FINAL CTA SECTION */}
      <section className="py-20 bg-brand-green text-brand-cream-light text-center relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-15">
          <img
            src="/images/shop_jars.jpg"
            alt="Macro Dry Fruits Background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="max-w-2xl mx-auto px-4 space-y-6 relative z-10">
          <h2 className="font-serif-editorial text-3xl md:text-5xl font-bold leading-tight">
            Premium Quality Is Only One Message Away.
          </h2>
          <p className="text-xs text-brand-cream-light/75 tracking-wider uppercase font-semibold">
            Order fresh dry fruits online or visit our boutique store in Ujjain.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              className="bg-[#25D366] hover:bg-[#20ba5a] text-white px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4 fill-current" />
              <span>Order on WhatsApp</span>
            </Link>
            <Link
              href={`tel:${contactPhone}`}
              className="bg-brand-gold hover:bg-brand-gold/90 text-brand-cream-light px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-md"
            >
              Call Now
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
