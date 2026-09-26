import type { Metadata } from "next";
import BestQualityClient from "./BestQualityClient";

export const metadata: Metadata = {
  title: "Best Quality Dryfruits & Masala House | Dry Fruits & Masalas in Ujjain",
  description:
    "Shop quality dry fruits, masalas, grocery essentials and gifting options at M/S Best Quality Dryfruits & Masala House, Fawara Chowk, Ujjain. Call +91 88393 15887 or visit us today.",
  keywords: [
    "dry fruit shop in Ujjain",
    "dry fruits in Ujjain",
    "masala shop in Ujjain",
    "dry fruit store near Fawara Chowk",
    "dry fruits near Doulatganj",
    "grocery store in Ujjain",
    "dry fruit gift hampers Ujjain",
    "best quality dryfruits ujjain",
    "masala house ujjain",
  ],
  authors: [{ name: "M/S Best Quality Dryfruits & Masala House" }],
  openGraph: {
    type: "website",
    title: "Best Quality Dryfruits & Masala House | Dry Fruits & Masalas in Ujjain",
    description:
      "Premium quality dry fruits, whole & ground masalas, and festive gift hampers at Fawara Chowk, near Doulatganj, Ujjain.",
    url: "https://shubhmewa.com/best-quality",
    siteName: "M/S Best Quality Dryfruits & Masala House",
    images: [
      {
        url: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Best Quality Dryfruits & Masala House Ujjain",
      },
    ],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "GroceryStore",
  name: "M/S Best Quality Dryfruits & Masala House",
  alternateName: "Best Quality Dryfruits and Masala House",
  image: [
    "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80",
  ],
  "@id": "https://share.google/gzS1QF0zgvS4xpSxy",
  url: "https://share.google/gzS1QF0zgvS4xpSxy",
  telephone: "+918839315887",
  priceRange: "₹₹",
  address: {
    "@type": "PostalAddress",
    streetAddress: "55, Fawara Chowk, near Doulatganj, Kharakua Colony",
    addressLocality: "Ujjain",
    addressRegion: "Madhya Pradesh",
    postalCode: "456010",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 23.1824,
    longitude: 75.7764,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "11:00",
      closes: "20:00",
    },
  ],
  sameAs: [
    "https://www.instagram.com/ms_best_quality/",
    "https://share.google/gzS1QF0zgvS4xpSxy",
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "10",
    bestRating: "5",
    worstRating: "1",
  },
};

export default function BestQualityPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BestQualityClient />
    </>
  );
}
