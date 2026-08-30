import React from "react";
import { getAdminSession } from "@/lib/actions";
import AdminLayoutClient from "@/components/AdminLayoutClient";

export const revalidate = 0; // Dynamic server-side rendering

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();

  return (
    <AdminLayoutClient session={session}>
      {children}
    </AdminLayoutClient>
  );
}
