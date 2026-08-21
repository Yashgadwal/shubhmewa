"use client";

import React, { useState } from "react";
import { Search, FileDown, Eye, MessageSquare, Save, X, Calendar } from "lucide-react";
import { updateEnquiryStatus, updateEnquiryNotes } from "@/lib/actions";

interface Enquiry {
  id: string;
  customerName: string;
  phone: string;
  whatsapp: string | null;
  email: string | null;
  occasion: string | null;
  quantity: number | null;
  budgetPerHamper: number | null;
  requiredDeliveryDate: string | null;
  customizationDetails: string | null;
  message: string | null;
  status: string;
  followUpDate: string | null;
  notes: string | null;
  createdAt: string;
}

interface EnquiriesManagerProps {
  initialEnquiries: Enquiry[];
}

export default function EnquiriesManager({ initialEnquiries }: EnquiriesManagerProps) {
  const [enquiries, setEnquiries] = useState<Enquiry[]>(initialEnquiries);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);

  const [tempStatus, setTempStatus] = useState("");
  const [tempNotes, setTempNotes] = useState("");
  const [updating, setUpdating] = useState(false);

  // Filter
  const filteredEnquiries = enquiries.filter((e) => {
    const nameStr = e.customerName.toLowerCase();
    const occStr = (e.occasion || "").toLowerCase();
    const matchesSearch =
      nameStr.includes(search.toLowerCase()) ||
      occStr.includes(search.toLowerCase()) ||
      e.phone.includes(search);

    const matchesStatus = statusFilter === "ALL" ? true : e.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Handle status update
  const handleStatusChange = async (status: string) => {
    if (!selectedEnquiry) return;
    setUpdating(true);
    const res = await updateEnquiryStatus(selectedEnquiry.id, status);
    setUpdating(false);

    if (res.success && res.enquiry) {
      setEnquiries((prev) =>
        prev.map((e) => (e.id === selectedEnquiry.id ? { ...e, status } : e))
      );
      setSelectedEnquiry((prev) => (prev ? { ...prev, status } : null));
    }
  };

  // Handle notes save
  const handleSaveNotes = async () => {
    if (!selectedEnquiry) return;
    setUpdating(true);
    const res = await updateEnquiryNotes(selectedEnquiry.id, tempNotes);
    setUpdating(false);

    if (res.success && res.enquiry) {
      setEnquiries((prev) =>
        prev.map((e) => (e.id === selectedEnquiry.id ? { ...e, notes: tempNotes } : e))
      );
      setSelectedEnquiry((prev) => (prev ? { ...prev, notes: tempNotes } : null));
    }
  };

  // Handle CSV Export
  const handleExportCSV = () => {
    const headers = [
      "Contact Name",
      "Phone",
      "WhatsApp",
      "Email",
      "Occasion",
      "Quantity",
      "Budget / Hamper",
      "Delivery Date",
      "Customization details",
      "Status",
      "Date Received",
    ];

    const rows = filteredEnquiries.map((e) => [
      `"${e.customerName}"`,
      e.phone,
      e.whatsapp || "",
      e.email || "",
      `"${e.occasion || "Hamper"}"`,
      e.quantity || "",
      e.budgetPerHamper || "",
      e.requiredDeliveryDate ? new Date(e.requiredDeliveryDate).toLocaleDateString() : "",
      `"${e.customizationDetails || ""}"`,
      e.status,
      new Date(e.createdAt).toLocaleDateString(),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Gifting_Leads_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openDrawer = (enquiry: Enquiry) => {
    setSelectedEnquiry(enquiry);
    setTempStatus(enquiry.status);
    setTempNotes(enquiry.notes || "");
  };

  const closeDrawer = () => {
    setSelectedEnquiry(null);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white border border-brand-cream-dark/30 p-4 rounded-xl shadow-xs">
        {/* Search */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Search contact name, occasion..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-brand-cream-dark/50 px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-brand-gold text-brand-green pl-9"
          />
          <Search className="w-4 h-4 text-brand-muted absolute left-3 top-2.5" />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 text-xs">
          {["ALL", "NEW", "IN_PROGRESS", "CLOSED", "CANCELLED"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg border font-semibold tracking-wide uppercase transition-all ${
                statusFilter === status
                  ? "bg-brand-green border-brand-green text-brand-cream-light shadow-sm"
                  : "bg-white border-brand-cream-dark/50 text-brand-green hover:border-brand-gold"
              }`}
            >
              {status === "ALL" ? "All Leads" : status.replace(/_/g, " ")}
            </button>
          ))}
        </div>

        {/* Export */}
        <button
          onClick={handleExportCSV}
          disabled={filteredEnquiries.length === 0}
          className="bg-brand-green hover:bg-brand-green/95 text-brand-cream-light py-2 px-4 rounded-xl text-xs font-bold uppercase tracking-wider disabled:opacity-50 flex items-center gap-1.5 shadow-sm w-full md:w-auto justify-center"
        >
          <FileDown className="w-4 h-4 text-brand-gold" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-brand-cream-dark/30 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-brand-cream-light/40 text-brand-green font-bold uppercase tracking-wider border-b border-brand-cream-dark/20">
                <th className="p-4">Contact</th>
                <th className="p-4">Occasion</th>
                <th className="p-4">Quantity</th>
                <th className="p-4">Budget / Hamper</th>
                <th className="p-4">Target Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEnquiries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-brand-muted">
                    No custom enquiries found.
                  </td>
                </tr>
              ) : (
                filteredEnquiries.map((e) => (
                  <tr key={e.id} className="border-b border-brand-cream-light/35 hover:bg-brand-cream-light/10">
                    <td className="p-4 font-bold text-brand-green">{e.customerName}</td>
                    <td className="p-4 text-brand-gold font-semibold uppercase">{e.occasion || "Hamper"}</td>
                    <td className="p-4 text-brand-muted">{e.quantity || "Custom"} units</td>
                    <td className="p-4 text-brand-green font-bold">
                      {e.budgetPerHamper ? `₹${e.budgetPerHamper}` : "Custom"}
                    </td>
                    <td className="p-4 text-brand-muted">
                      {e.requiredDeliveryDate
                        ? new Date(e.requiredDeliveryDate).toLocaleDateString()
                        : "Flexible"}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[9px] uppercase font-bold border ${
                          e.status === "CLOSED"
                            ? "bg-green-50 border-green-200 text-green-700"
                            : e.status === "CANCELLED"
                            ? "bg-red-50 border-red-200 text-red-700"
                            : "bg-blue-50 border-blue-200 text-blue-700"
                        }`}
                      >
                        {e.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => openDrawer(e)}
                        className="p-1.5 border border-brand-cream-dark/60 text-brand-green hover:border-brand-gold hover:text-brand-gold rounded-lg bg-white/50 transition-colors inline-flex items-center gap-1 font-semibold"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drawer details */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 overflow-hidden font-sans">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" onClick={closeDrawer} />

          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-brand-cream-light border-l border-brand-cream-dark flex flex-col shadow-2xl transition-transform duration-300">
              {/* Header */}
              <div className="px-6 py-5 bg-brand-green text-brand-cream-light flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-serif-editorial font-bold">Gifting Proposal</h2>
                  <p className="text-[10px] text-brand-gold tracking-widest uppercase font-semibold mt-0.5">
                    Lead ID: {selectedEnquiry.id.slice(0, 8)}
                  </p>
                </div>
                <button
                  onClick={closeDrawer}
                  className="p-1 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-brand-cream-light" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* Contact info card */}
                <div className="bg-white border border-brand-cream-dark/30 p-4 rounded-xl space-y-2">
                  <h4 className="text-[10px] text-brand-muted font-bold block uppercase tracking-wider">
                    Contact Information
                  </h4>
                  <p className="text-sm font-bold text-brand-green">{selectedEnquiry.customerName}</p>
                  <p className="text-xs text-brand-muted">Phone: {selectedEnquiry.phone}</p>
                  {selectedEnquiry.email && <p className="text-xs text-brand-muted">Email: {selectedEnquiry.email}</p>}
                  
                  {/* WhatsApp click shortcut */}
                  <a
                    href={`https://wa.me/${selectedEnquiry.phone}?text=Hello%20${selectedEnquiry.customerName},%20this%20is%20Harshil%20Dry%20Fruits%20regarding%20your%20custom%20gifting%20enquiry%20for%20${selectedEnquiry.occasion}.`}
                    target="_blank"
                    className="mt-4 flex items-center justify-center gap-1 bg-[#25D366] text-white py-2 rounded-xl text-xs font-semibold tracking-wide"
                  >
                    <MessageSquare className="w-4 h-4 fill-current" />
                    <span>Follow-up WhatsApp</span>
                  </a>
                </div>

                {/* Status selector */}
                <div className="bg-white border border-brand-cream-dark/30 p-4 rounded-xl space-y-3">
                  <label className="text-[10px] text-brand-muted font-bold block uppercase tracking-wider">
                    Lead Status Progression
                  </label>
                  <select
                    value={tempStatus}
                    disabled={updating}
                    onChange={(e) => {
                      setTempStatus(e.target.value);
                      handleStatusChange(e.target.value);
                    }}
                    className="w-full border border-brand-cream-dark/50 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand-gold text-brand-green font-semibold bg-brand-cream-light/20"
                  >
                    <option value="NEW">New Lead (Unassigned)</option>
                    <option value="IN_PROGRESS">Proposal generating (In Progress)</option>
                    <option value="CLOSED">Completed / Closed (Won)</option>
                    <option value="CANCELLED">Cancelled (Lost)</option>
                  </select>
                </div>

                {/* Follow-up internal notes */}
                <div className="bg-white border border-brand-cream-dark/30 p-4 rounded-xl space-y-3">
                  <label className="text-[10px] text-brand-muted font-bold block uppercase tracking-wider">
                    Follow-up Internal Notes
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Sourced box sizes samples, client requested quotation revision..."
                    value={tempNotes}
                    onChange={(e) => setTempNotes(e.target.value)}
                    className="w-full border border-brand-cream-dark/50 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand-gold text-brand-green"
                  />
                  <button
                    type="button"
                    onClick={handleSaveNotes}
                    disabled={updating}
                    className="bg-brand-green text-brand-cream-light px-4 py-2 rounded-lg text-xs font-semibold hover:bg-brand-green/90 transition-colors flex items-center gap-1"
                  >
                    <Save className="w-3.5 h-3.5 text-brand-gold" />
                    <span>Save Notes</span>
                  </button>
                </div>

                {/* Requirement Specifications */}
                <div className="bg-white border border-brand-cream-dark/30 p-4 rounded-xl space-y-3">
                  <h4 className="text-[10px] text-brand-muted font-bold block uppercase tracking-wider">
                    RFQ Requirements
                  </h4>
                  <div className="space-y-2 text-xs text-brand-green">
                    <div className="flex justify-between border-b border-brand-cream-light pb-1">
                      <span>Occasion / Family</span>
                      <span className="font-bold">{selectedEnquiry.occasion}</span>
                    </div>
                    <div className="flex justify-between border-b border-brand-cream-light pb-1">
                      <span>Approx Qty</span>
                      <span className="font-bold">{selectedEnquiry.quantity || "Custom"} hampers</span>
                    </div>
                    <div className="flex justify-between border-b border-brand-cream-light pb-1">
                      <span>Budget / Hamper</span>
                      <span className="font-bold">₹{selectedEnquiry.budgetPerHamper || "Custom"}</span>
                    </div>
                    <div className="flex justify-between border-b border-brand-cream-light pb-1">
                      <span>Delivery Target Date</span>
                      <span className="font-bold flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-brand-gold" />
                        {selectedEnquiry.requiredDeliveryDate
                          ? new Date(selectedEnquiry.requiredDeliveryDate).toLocaleDateString()
                          : "Flexible"}
                      </span>
                    </div>
                    {selectedEnquiry.customizationDetails && (
                      <div className="pt-2">
                        <span className="font-bold text-brand-gold">Customization Requirements:</span>
                        <p className="text-[11px] text-brand-muted mt-0.5 leading-relaxed bg-brand-cream-light/35 p-2 rounded-lg border border-brand-cream-dark/20">
                          {selectedEnquiry.customizationDetails}
                        </p>
                      </div>
                    )}
                    {selectedEnquiry.message && (
                      <div className="pt-2">
                        <span className="font-bold text-brand-gold">Client Extra Message:</span>
                        <p className="text-[11px] text-brand-muted mt-0.5 leading-relaxed bg-brand-cream-light/35 p-2 rounded-lg border border-brand-cream-dark/20">
                          {selectedEnquiry.message}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
