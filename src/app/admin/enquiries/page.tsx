import React from "react";
import EnquiriesManager from "@/components/EnquiriesManager";

export const revalidate = 0; // Dynamic server-side rendering

export default async function AdminEnquiriesPage() {
  const enquiries = [
    {
      id: "enq-1",
      customerName: "Nisha Garg (Nexora Group)",
      phone: "919876543210",
      whatsapp: "919876543210",
      email: "nisha@nexora.com",
      occasion: "Corporate Gifting",
      quantity: 50,
      budgetPerHamper: 1200,
      requiredDeliveryDate: new Date().toISOString(),
      customizationDetails: "Laser engraved logo on wooden lid",
      message: "Need standard corporate boxes.",
      status: "NEW",
      notes: "",
      createdAt: new Date().toISOString()
    },
    {
      id: "enq-2",
      customerName: "Rahul Sethi",
      phone: "919988776655",
      whatsapp: "919988776655",
      email: "rahul@sethiwedding.com",
      occasion: "Wedding return favors",
      quantity: 120,
      budgetPerHamper: 800,
      requiredDeliveryDate: new Date().toISOString(),
      customizationDetails: "Gold foil label",
      message: "Wedding return gifts.",
      status: "IN_PROGRESS",
      notes: "Offered W240 cashews and organic seeds.",
      createdAt: new Date().toISOString()
    }
  ];

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
