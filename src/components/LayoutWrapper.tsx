"use client";

import React from "react";
import { CartProvider } from "@/context/CartContext";
import Header from "./Header";
import Footer from "./Footer";
import StickyWhatsapp from "./StickyWhatsapp";
import { usePathname } from "next/navigation";

interface LayoutWrapperProps {
  children: React.ReactNode;
  settings: Record<string, string>;
}

export default function LayoutWrapper({ children, settings }: LayoutWrapperProps) {
  const pathname = usePathname();
  const isAppView = pathname?.startsWith("/admin");

  if (isAppView) {
    return <div className="min-h-screen bg-brand-cream-light/35 font-sans">{children}</div>;
  }

  return (
    <CartProvider>
      <Header settings={settings} />
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
      <StickyWhatsapp settings={settings} />
      <Footer settings={settings} />
    </CartProvider>
  );
}
