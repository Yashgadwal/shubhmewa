import React from "react";
import { getAdminSession } from "@/lib/actions";
import { LayoutDashboard, ShoppingCart, FolderPlus, HelpCircle, Settings, Tag, FileText } from "lucide-react";
import AdminLayoutClient from "@/components/AdminLayoutClient";

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
    <AdminLayoutClient session={session} menuLinks={menuLinks as any}>
      {children}
    </AdminLayoutClient>
  );
}
