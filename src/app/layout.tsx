import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { prisma } from "@/lib/prisma";
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
  title: "ShubhMewa | Premium Hampers Ujjain",
  description: "Discover premium dry fruits, high-grade spices, kirana, and custom gift hampers in Ujjain from ShubhMewa. Perfect for corporate and wedding gifting. Order directly on WhatsApp.",
  keywords: "dry fruit shop in Ujjain, best dry fruits in Ujjain, premium dry fruits Ujjain, dry fruit home delivery Ujjain, dry fruit gift hampers Ujjain, wedding dry fruit hampers Ujjain, corporate gifting Ujjain, ShubhMewa, Fawara Chowk Ujjain",
  openGraph: {
    title: "ShubhMewa | Premium Hampers Ujjain",
    description: "Premium dry fruits, spices, and custom gifting hampers in Ujjain. Free local delivery on orders above ₹999.",
    type: "website",
    locale: "en_IN",
    siteName: "ShubhMewa",
  },
  twitter: {
    card: "summary_large_image",
    title: "ShubhMewa | Premium Hampers Ujjain",
    description: "Premium dry fruits and wedding/corporate hampers in Ujjain. Direct WhatsApp ordering.",
  }
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch settings at server level
  const settingsMap: Record<string, string> = {};
  try {
    const settings = await prisma.websiteSetting.findMany();
    settings.forEach((s) => {
      settingsMap[s.key] = s.value;
    });
  } catch (error) {
    console.error("Failed to load layout settings:", error);
  }

  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link rel="canonical" href="https://harshildryfruits.com" />
      </head>
      <body
        className="min-h-full flex flex-col bg-brand-cream-light text-foreground select-none"
        suppressHydrationWarning
      >
        <Script id="strip-extensions" strategy="beforeInteractive">
          {`
            (function() {
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
