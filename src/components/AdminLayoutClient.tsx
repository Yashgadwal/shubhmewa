"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LogOut, LayoutDashboard, ShoppingCart, FolderPlus, HelpCircle, Settings, Tag, FileText } from "lucide-react";
import { adminLogout } from "@/lib/actions";

interface AdminLayoutClientProps {
  children: React.ReactNode;
  session: { name: string; role: string } | null;
}

export default function AdminLayoutClient({
  children,
  session,
}: AdminLayoutClientProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  const menuLinks = [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Orders Manager", href: "/admin/orders", icon: ShoppingCart },
    { label: "Bulk Enquiries", href: "/admin/enquiries", icon: HelpCircle },
    { label: "Products CRUD", href: "/admin/products", icon: FolderPlus },
    { label: "Categories CRUD", href: "/admin/categories", icon: Settings },
    { label: "Manage Coupons", href: "/admin/coupons", icon: Tag },
    { label: "CMS Settings", href: "/admin/content", icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-brand-cream-light/60 flex flex-col md:flex-row font-sans select-none" suppressHydrationWarning>
      
      {/* Mobile Top Navigation Header */}
      <header className="flex md:hidden items-center justify-between bg-brand-green text-brand-cream-light p-4 border-b border-brand-gold/20 sticky top-0 z-40">
        <div className="flex flex-col">
          <span className="font-serif-editorial text-xs font-bold tracking-wide uppercase text-brand-cream-light leading-none">
            ShubhMewa Admin
          </span>
          <span className="text-[7px] uppercase tracking-widest text-brand-gold mt-1 font-semibold">
            Pure Dry Fruits & Superfoods
          </span>
        </div>
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-1 text-brand-cream-light hover:text-brand-gold transition-colors cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>
      </header>

      {/* Backdrop (Mobile only) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/45 backdrop-blur-xs md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed md:sticky top-0 left-0 bottom-0 z-50 md:z-auto w-64 bg-brand-green border-r border-brand-gold/20 text-brand-cream-light flex flex-col justify-between p-6 shrink-0 transform transition-transform duration-300 md:transform-none md:transition-none ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="space-y-8">
          {/* Sidebar Header with close button on mobile */}
          <div className="flex items-center justify-between border-b border-brand-gold/20 pb-5">
            <div className="flex flex-col">
              <span className="font-serif-editorial text-sm font-bold tracking-wide uppercase text-brand-cream-light leading-none">
                ShubhMewa Admin
              </span>
              <span className="text-[8px] uppercase tracking-widest text-brand-gold mt-1.5 font-semibold">
                Pure Dry Fruits & Superfoods
              </span>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-1 md:hidden text-brand-cream-light hover:text-brand-gold transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Menu links */}
          <nav className="flex flex-col gap-1">
            {menuLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                    isActive
                      ? "bg-brand-gold/20 text-brand-gold font-bold"
                      : "hover:bg-white/10 hover:text-brand-gold text-brand-cream-light/90"
                  }`}
                >
                  <Icon className="w-4 h-4 text-brand-gold shrink-0" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info & Logout */}
        <div className="space-y-4 border-t border-brand-gold/20 pt-5">
          {session && (
            <div className="px-4">
              <p className="text-xs font-bold text-brand-cream-light">{session.name}</p>
              <p className="text-[10px] text-brand-gold font-semibold uppercase mt-0.5">{session.role}</p>
            </div>
          )}
          
          <form action={adminLogout} onSubmit={() => setIsSidebarOpen(false)}>
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-red-300 hover:bg-white/10 hover:text-red-400 transition-all text-left cursor-pointer"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span>Logout Panel</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main content viewport */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto max-h-[calc(100vh-60px)] md:max-h-screen">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
