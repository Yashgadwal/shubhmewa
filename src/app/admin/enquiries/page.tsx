import React from "react";
import EnquiriesManager from "@/components/EnquiriesManager";
import { getAdminEnquiries } from "@/lib/actions";

export const revalidate = 0; // Dynamic server-side rendering

export default async function AdminEnquiriesPage() {
  const enquiries = await getAdminEnquiries();

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className="font-serif-editorial text-3xl text-brand-green font-bold">
          Bulk Order Enquiries
        </h1>
        <p className="text-xs text-brand-muted mt-1 leading-relaxed">
          Manage wholesale bulk inquiries, customer contact notes, and export inquiry records to CSV.
        </p>
      </div>

      <EnquiriesManager initialEnquiries={enquiries as any} />
    </div>
  );
}
