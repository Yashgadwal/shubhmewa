"use client";

import React from "react";
import { CartProvider } from "@/context/CartContext";
import Header from "./Header";
import Footer from "./Footer";
import { usePathname } from "next/navigation";

interface LayoutWrapperProps {
  children: React.ReactNode;
  settings: Record<string, string>;
}

export default function LayoutWrapper({ children, settings }: LayoutWrapperProps) {
  const pathname = usePathname();
  const isAppView = pathname?.startsWith("/admin");

  if (isAppView) {
    return <div className="min-h-screen bg-brand-cream-light/35 font-sans" suppressHydrationWarning>{children}</div>;
  }

  return (
    <CartProvider>
      <Header settings={settings} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
    </CartProvider>
  );
}
