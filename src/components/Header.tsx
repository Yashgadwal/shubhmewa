"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, X, Search, User } from "lucide-react";
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

  const announcementText = settings["announcement_text"] || "🚚 Free shipping on orders above ₹399! | Order on WhatsApp";
  const announcementActive = settings["announcement_active"] !== "false";
  const whatsappNumber = settings["whatsapp_number"] || "8982010210";
  const storeName = settings["store_name"] || "ShubhMewa";

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
    { label: "Dry Fruits", href: "/shop?category=dry-fruits" },
    { label: "Masala & Spices", href: "/shop?category=spices" },
    { label: "Makhana", href: "/shop?query=Makhana" },
    { label: "Gift Hampers", href: "/shop?category=hampers" },
    { label: "About Us", href: "/about" },
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
              ? "fixed top-0 left-0 bg-brand-cream-light/95 backdrop-blur-md shadow-md py-3"
              : "bg-transparent py-5"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
            <Link href="/" className="flex flex-col">
              <span className="font-serif-editorial text-xl md:text-2xl font-bold tracking-wide text-brand-green uppercase leading-none">
                <span className="text-brand-green">Shubh</span>
                <span className="text-brand-gold">Mewa</span>
              </span>
              <span className="text-[9px] uppercase tracking-widest text-brand-gold mt-1 font-semibold">
                Premium Quality
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden xl:flex items-center gap-6">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`text-[10px] font-bold uppercase tracking-widest transition-all hover:text-brand-gold ${
                      isActive ? "text-brand-gold" : "text-brand-green"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* Search Form */}
              <form action="/shop" method="GET" className="hidden md:flex items-center relative">
                <input
                  type="text"
                  name="query"
                  placeholder="Search..."
                  className="border border-brand-cream-dark/40 px-3.5 py-1.5 rounded-full text-[11px] focus:outline-none focus:border-brand-gold text-brand-green bg-white/70 pl-8 w-28 focus:w-44 transition-all"
                />
                <Search className="w-3.5 h-3.5 text-brand-muted absolute left-3 pointer-events-none" />
              </form>

              {/* Profile Link */}
              <Link
                href="/account"
                className="p-2 bg-white border border-brand-cream-dark/50 text-brand-green hover:border-brand-gold hover:text-brand-gold rounded-full transition-all shadow-xs"
                aria-label="Account Profile"
              >
                <User className="w-3.5 h-3.5" />
              </Link>

              {/* Cart Toggle */}
              <button
                onClick={() => setIsOpen(true)}
                className="relative p-2 bg-white border border-brand-cream-dark/50 text-brand-green hover:border-brand-gold hover:text-brand-gold rounded-full transition-all shadow-xs"
                aria-label="Open Cart"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                {totalItemsCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-brand-gold text-brand-cream-light text-[9px] font-bold w-4.5 h-4.5 flex items-center justify-center rounded-full border border-brand-cream-light">
                    {totalItemsCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 xl:hidden border border-brand-cream-dark/50 text-brand-green rounded-full bg-white/50"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 top-[100px] z-30 xl:hidden bg-brand-cream-light border-t border-brand-cream-dark/30 flex flex-col p-6 animate-fade-in">
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
                href="/shop"
                onClick={() => setMobileMenuOpen(false)}
                className="bg-brand-green hover:bg-brand-green/90 text-brand-cream-light py-3 rounded-full text-xs font-semibold tracking-widest uppercase transition-all shadow-sm flex items-center justify-center gap-2 mt-4"
              >
                Shop Now
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
