import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { DEFAULT_SETTINGS } from "@/lib/static-data";
import LayoutWrapper from "@/components/LayoutWrapper";
import Script from "next/script";

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  manifest: "/manifest.json",
  title: "ShubhMewa | Premium Dry Fruits & Healthy Superfoods Ujjain",
  description: "Discover pure, hand-sorted California almonds, cashews, walnuts, makhana, and nutritious seeds in Ujjain from ShubhMewa. Free local delivery on orders above ₹399 with Full Refund & Replacement guarantee.",
  keywords: "dry fruit shop in Ujjain, best dry fruits in Ujjain, premium dry fruits Ujjain, dry fruit home delivery Ujjain, California almonds Ujjain, makhana Ujjain, chia seeds Ujjain, ShubhMewa, Fawara Chowk Ujjain",
  openGraph: {
    title: "ShubhMewa | Premium Dry Fruits & Healthy Superfoods Ujjain",
    description: "Premium dry fruits, makhana, and nutritious seeds in Ujjain. Free delivery on orders above ₹399 with Full Refund & Replacement guarantee.",
    type: "website",
    locale: "en_IN",
    siteName: "ShubhMewa",
  },
  twitter: {
    card: "summary_large_image",
    title: "ShubhMewa | Premium Dry Fruits & Superfoods Ujjain",
    description: "Premium dry fruits, dates, and superfood seeds in Ujjain. Order online with Free Delivery over ₹399.",
  }
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settingsMap = DEFAULT_SETTINGS;

  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link rel="canonical" href="https://shubhmewa.com" />
      </head>
      <body
        className="min-h-full flex flex-col bg-brand-cream-light text-foreground select-none"
        suppressHydrationWarning
      >
        <Script id="strip-extensions" strategy="beforeInteractive">
          {`
            (function() {
              const originalError = console.error;
              console.error = function(...args) {
                const msg = args[0] ? String(args[0]) : '';
                if (
                  msg.includes('hydration') ||
                  msg.includes('Hydration') ||
                  msg.includes('did not match') ||
                  msg.includes('bis_skin_checked')
                ) {
                  return;
                }
                originalError.apply(console, args);
              };

              const strip = (node) => {
                if (node.nodeType === 1) {
                  if (node.hasAttribute && node.hasAttribute('bis_skin_checked')) {
                    node.removeAttribute('bis_skin_checked');
                  }
                  const els = node.querySelectorAll ? node.querySelectorAll('[bis_skin_checked]') : [];
                  els.forEach((el) => el.removeAttribute('bis_skin_checked'));
                }
              };
              const observer = new MutationObserver((mutations) => {
                for (const mutation of mutations) {
                  if (mutation.type === 'attributes' && mutation.attributeName === 'bis_skin_checked') {
                    mutation.target.removeAttribute('bis_skin_checked');
                  } else if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(strip);
                  }
                }
              });
              observer.observe(document.documentElement, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['bis_skin_checked']
              });
            })();
          `}
        </Script>
        <LayoutWrapper settings={settingsMap}>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}
