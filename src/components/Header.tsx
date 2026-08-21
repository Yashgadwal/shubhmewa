"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, X, Search, PhoneCall } from "lucide-react";
import { useCart } from "@/context/CartContext";
import CartDrawer from "./CartDrawer";

interface HeaderProps {
  settings: Record<string, string>;
}

export default function Header({ settings }: HeaderProps) {
  const pathname = usePathname();
  const { items, setIsOpen, isOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const announcementText = settings["announcement_text"] || "Free local delivery on orders above ₹999";
  const announcementActive = settings["announcement_active"] !== "false";
  const whatsappNumber = settings["whatsapp_number"] || "919876543210";
  const storeName = settings["store_name"] || "Harshil Dry Fruits";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: "Categories", href: "/categories" },
    { label: "Gift Hampers", href: "/gifting" },
    { label: "Bulk Orders", href: "/wedding" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <>
      <header className="w-full z-40 relative font-sans">
        {/* Announcement Bar */}
        {announcementActive && (
          <div className="w-full bg-brand-green text-brand-cream-light py-2 px-4 text-center text-xs tracking-wider font-semibold border-b border-brand-gold/20">
            {announcementText}
          </div>
        )}

        {/* Navigation Bar */}
        <div
          className={`w-full transition-all duration-300 ${
            scrolled
              ? "fixed top-0 left-0 bg-brand-cream-light/90 backdrop-blur-md shadow-md py-3"
              : "bg-transparent py-5"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
            <Link href="/" className="flex flex-col">
              <span className="font-serif-editorial text-xl md:text-2xl font-bold tracking-wide text-brand-green uppercase leading-none">
                ShubhMewa
              </span>
              <span className="text-[9px] uppercase tracking-widest text-brand-gold mt-1 font-semibold">
                Premium Quality
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`text-xs font-semibold uppercase tracking-widest transition-all hover:text-brand-gold ${
                      isActive ? "text-brand-gold font-bold" : "text-brand-green"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <Link
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                className="hidden md:flex items-center gap-2 border border-brand-green hover:border-brand-gold text-brand-green hover:text-brand-gold px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all bg-white/50"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>WhatsApp Order</span>
              </Link>

              {/* Cart Toggle */}
              <button
                onClick={() => setIsOpen(true)}
                className="relative p-2.5 bg-white border border-brand-cream-dark/50 text-brand-green hover:border-brand-gold hover:text-brand-gold rounded-full transition-all shadow-xs"
                aria-label="Open Cart"
              >
                <ShoppingBag className="w-4 h-4" />
                {totalItemsCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-brand-gold text-brand-cream-light text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-brand-cream-light">
                    {totalItemsCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 lg:hidden border border-brand-cream-dark/50 text-brand-green rounded-full bg-white/50"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 top-[100px] z-30 lg:hidden bg-brand-cream-light border-t border-brand-cream-dark/30 flex flex-col p-6 animate-fade-in">
            <nav className="flex flex-col gap-6 text-center">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-sm font-semibold uppercase tracking-widest py-2 border-b border-brand-cream-dark/20 text-brand-green`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                onClick={() => setMobileMenuOpen(false)}
                className="bg-brand-green hover:bg-brand-green/90 text-brand-cream-light py-3 rounded-full text-xs font-semibold tracking-widest uppercase transition-all shadow-sm flex items-center justify-center gap-2 mt-4"
              >
                <PhoneCall className="w-4 h-4 text-brand-gold" />
                WhatsApp Order
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Cart Drawer */}
      <CartDrawer settings={settings} />
    </>
  );
}
