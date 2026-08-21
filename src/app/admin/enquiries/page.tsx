import React from "react";
import { prisma } from "@/lib/prisma";
import EnquiriesManager from "@/components/EnquiriesManager";

export const revalidate = 0; // Dynamic server-side rendering

export default async function AdminEnquiriesPage() {
  const enquiries = await prisma.enquiry.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className="font-serif-editorial text-3xl text-brand-green font-bold">
          Gifting Leads
        </h1>
        <p className="text-xs text-brand-muted mt-1 leading-relaxed">
          Manage corporate RFQ proposals, custom wedding favers enquiries, update follow-up notes, and export leads list to CSV.
        </p>
      </div>

      <EnquiriesManager initialEnquiries={enquiries as any} />
    </div>
  );
}
