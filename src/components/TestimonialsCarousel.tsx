"use client";

import React, { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  rating: number;
  review: string;
  image?: string | null;
  isGoogleReview: boolean;
}

interface TestimonialsCarouselProps {
  testimonials: Testimonial[];
  googleMapsLink: string;
}

export default function TestimonialsCarousel({
  testimonials,
  googleMapsLink,
}: TestimonialsCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [testimonials]);

  if (testimonials.length === 0) return null;

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const current = testimonials[activeIndex];

  return (
    <div className="w-full max-w-4xl mx-auto py-10 px-4 md:px-8 bg-brand-cream-light/30 border border-brand-cream-dark/40 rounded-3xl relative font-sans shadow-xs">
      {/* Google badge info */}
      <div className="flex flex-col items-center text-center mb-8 border-b border-brand-cream-dark/20 pb-6">
        <div className="flex items-center gap-2 mb-1">
          <Star className="w-5 h-5 fill-brand-gold text-brand-gold" />
          <span className="font-serif-editorial text-lg md:text-xl font-bold text-brand-green">
            5.0 Rated on Google Reviews
          </span>
        </div>
        <p className="text-xs text-brand-muted max-w-sm leading-relaxed mb-4">
          Trusted by families and households in Ujjain for premium quality dry fruits and superfoods.
        </p>
        <a
          href={googleMapsLink}
          target="_blank"
          className="inline-block text-[11px] font-bold tracking-wider uppercase bg-brand-green hover:bg-brand-green/90 text-brand-cream-light px-6 py-2.5 rounded-full transition-all"
        >
          Review Us on Google
        </a>
      </div>

      {/* Slide Container */}
      <div className="min-h-[160px] flex flex-col justify-center items-center text-center px-4 md:px-12 transition-all duration-500">
        <div className="flex items-center justify-center gap-1 mb-4">
          {[...Array(current.rating)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-brand-gold text-brand-gold" />
          ))}
        </div>
        <p className="font-serif-editorial text-brand-green text-base md:text-xl italic leading-relaxed max-w-2xl">
          "{current.review}"
        </p>
        <div className="mt-6 flex items-center justify-center gap-2">
          {current.isGoogleReview && (
            <span className="bg-[#4285F4] text-white text-[9px] tracking-wider font-semibold uppercase px-2 py-0.5 rounded-sm">
              Google Review
            </span>
          )}
          <span className="text-xs font-bold uppercase tracking-wider text-brand-green">
            - {current.name}
          </span>
        </div>
      </div>

      {/* Buttons */}
      {testimonials.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 p-2 rounded-full border border-brand-cream-dark/50 text-brand-green hover:text-brand-gold bg-white hover:bg-brand-cream-light/30 transition-all shadow-xs"
            aria-label="Previous review"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-2 rounded-full border border-brand-cream-dark/50 text-brand-green hover:text-brand-gold bg-white hover:bg-brand-cream-light/30 transition-all shadow-xs"
            aria-label="Next review"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </>
      )}

      {/* Indicators */}
      {testimonials.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-8">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`w-2 h-2 rounded-full transition-all ${
                activeIndex === idx ? "bg-brand-gold w-4" : "bg-brand-cream-dark"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
