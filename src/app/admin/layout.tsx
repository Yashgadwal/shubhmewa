import React from "react";
import Link from "next/link";
import { getAdminSession, adminLogout } from "@/lib/actions";
import { LayoutDashboard, ShoppingCart, FolderPlus, HelpCircle, Settings, LogOut, MessageSquare, Tag, FileText, Lock } from "lucide-react";

export const revalidate = 0; // Dynamic server-side rendering

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();

  const menuLinks = [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Orders Manager", href: "/admin/orders", icon: ShoppingCart },
    { label: "Gifting Leads", href: "/admin/enquiries", icon: HelpCircle },
    { label: "Products CRUD", href: "/admin/products", icon: FolderPlus },
    { label: "Categories CRUD", href: "/admin/categories", icon: Settings },
    { label: "Manage Coupons", href: "/admin/coupons", icon: Tag },
    { label: "CMS Settings", href: "/admin/content", icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-brand-cream-light/60 flex font-sans select-none" suppressHydrationWarning>
      {/* Sidebar navigation */}
      <aside className="w-64 bg-brand-green border-r border-brand-gold/20 text-brand-cream-light flex flex-col justify-between p-6 shrink-0">
        <div className="space-y-8">
          {/* Logo */}
          <div className="flex flex-col border-b border-brand-gold/20 pb-5">
            <span className="font-serif-editorial text-sm font-bold tracking-wide uppercase text-brand-cream-light leading-none">
              ShubhMewa Admin
            </span>
            <span className="text-[8px] uppercase tracking-widest text-brand-gold mt-1.5 font-semibold">
              Dryfruits & Masalas
            </span>
          </div>

          {/* Menu links */}
          <nav className="flex flex-col gap-1">
            {menuLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-white/10 hover:text-brand-gold transition-all"
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
          
          <form action={adminLogout}>
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-red-300 hover:bg-white/10 hover:text-red-400 transition-all text-left"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span>Logout Panel</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main content viewport */}
      <main className="flex-1 p-8 overflow-y-auto max-h-screen">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
