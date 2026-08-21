"use client";

import React, { useState } from "react";
import { Send, CheckCircle, MessageSquare } from "lucide-react";
import { createEnquiry } from "@/lib/actions";

interface BulkOrderFormProps {
  whatsappNumber: string;
}

export default function BulkOrderForm({ whatsappNumber }: BulkOrderFormProps) {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [occasion, setOccasion] = useState("Wedding Gifting");
  const [quantity, setQuantity] = useState("50");
  const [budget, setBudget] = useState("1000");
  const [date, setDate] = useState("");
  const [details, setDetails] = useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await createEnquiry({
        customerName: name,
        phone,
        whatsapp: whatsapp || phone,
        email: email || undefined,
        occasion: company ? `${occasion} (${company})` : occasion,
        quantity: Number(quantity),
        budgetPerHamper: Number(budget),
        requiredDeliveryDate: date || undefined,
        customizationDetails: details,
        message: notes,
      });

      if (res.success) {
        setSuccess(true);
      } else {
        setErrorMsg(res.error || "Failed to submit enquiry. Please try again.");
      }
    } catch (e) {
      setErrorMsg("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppInstantSubmit = () => {
    // Generate pre-filled bulk enquiry message
    let message = `*BULK GIFTING QUOTE REQUEST*\n`;
    message += `-----------------------------\n`;
    message += `*Contact:* ${name}\n`;
    if (company) message += `*Company/Family:* ${company}\n`;
    message += `*Phone:* ${phone}\n`;
    message += `*Occasion:* ${occasion}\n`;
    message += `*Approx Quantity:* ${quantity} hampers\n`;
    message += `*Target Budget:* ₹${budget} per hamper\n`;
    if (date) message += `*Delivery Date:* ${date}\n`;
    if (details) message += `*Customization:* ${details}\n`;
    if (notes) message += `*Message:* ${notes}\n`;
    message += `-----------------------------\n`;
    message += `Please share catalog options and pricing details.`;

    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/${whatsappNumber}?text=${encoded}`;
    window.open(url, "_blank");
  };

  return (
    <div className="w-full bg-white border border-brand-cream-dark/30 p-6 md:p-10 rounded-3xl shadow-sm font-sans">
      {success ? (
        <div className="text-center py-8 space-y-4">
          <div className="w-16 h-16 bg-brand-green/10 text-brand-green rounded-full flex items-center justify-center mx-auto mb-2">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h3 className="font-serif-editorial text-2xl text-brand-green font-bold">
            Enquiry Received
          </h3>
          <p className="text-sm text-brand-muted max-w-sm mx-auto leading-relaxed">
            Thank you! Your bulk order requirement has been stored securely in our database. An advisor will contact you within 24 hours.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
            <button
              onClick={() => setSuccess(false)}
              className="px-6 py-2.5 border border-brand-green text-brand-green hover:border-brand-gold hover:text-brand-gold text-xs font-semibold uppercase tracking-wider rounded-full transition-all"
            >
              Submit Another Request
            </button>
            <button
              onClick={handleWhatsAppInstantSubmit}
              className="px-6 py-2.5 bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-semibold uppercase tracking-wider rounded-full transition-all flex items-center justify-center gap-1.5 shadow-sm"
            >
              <MessageSquare className="w-4 h-4 fill-current" />
              <span>Discuss on WhatsApp</span>
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <h3 className="font-serif-editorial text-2xl text-brand-green font-bold border-b border-brand-cream-dark/20 pb-4">
            Request Gifting Proposal
          </h3>
          {errorMsg && <p className="text-red-500 text-xs font-semibold">{errorMsg}</p>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] tracking-wider uppercase font-semibold text-brand-green block mb-1">
                Your Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rajesh Sharma"
                className="w-full border border-brand-cream-dark/50 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:border-brand-gold text-brand-green bg-brand-cream-light/10"
              />
            </div>
            <div>
              <label className="text-[10px] tracking-wider uppercase font-semibold text-brand-green block mb-1">
                Family or Company Name
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Sharma Family / Nexora Corp"
                className="w-full border border-brand-cream-dark/50 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:border-brand-gold text-brand-green bg-brand-cream-light/10"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] tracking-wider uppercase font-semibold text-brand-green block mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                placeholder="10-digit number"
                className="w-full border border-brand-cream-dark/50 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:border-brand-gold text-brand-green bg-brand-cream-light/10"
              />
            </div>
            <div>
              <label className="text-[10px] tracking-wider uppercase font-semibold text-brand-green block mb-1">
                WhatsApp Number
              </label>
              <input
                type="tel"
                maxLength={10}
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, ""))}
                placeholder="Same as phone if blank"
                className="w-full border border-brand-cream-dark/50 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:border-brand-gold text-brand-green bg-brand-cream-light/10"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] tracking-wider uppercase font-semibold text-brand-green block mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. name@example.com"
                className="w-full border border-brand-cream-dark/50 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:border-brand-gold text-brand-green bg-brand-cream-light/10"
              />
            </div>
            <div>
              <label className="text-[10px] tracking-wider uppercase font-semibold text-brand-green block mb-1">
                Occasion Type
              </label>
              <select
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                className="w-full border border-brand-cream-dark/50 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:border-brand-gold text-brand-green bg-brand-cream-light/10"
              >
                <option value="Wedding Gifting">Wedding Gifting</option>
                <option value="Corporate Gifting">Corporate Gifting</option>
                <option value="Diwali Hampers">Diwali Hampers</option>
                <option value="Festival Gifting">Festival Gifting</option>
                <option value="Custom Family Event">Custom Family Event</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-[10px] tracking-wider uppercase font-semibold text-brand-green block mb-1">
                Approx Quantity *
              </label>
              <select
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full border border-brand-cream-dark/50 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:border-brand-gold text-brand-green bg-brand-cream-light/10"
              >
                <option value="25">25 - 50 units</option>
                <option value="50">50 - 100 units</option>
                <option value="100">100 - 200 units</option>
                <option value="200">200 - 500 units</option>
                <option value="500">500+ units</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] tracking-wider uppercase font-semibold text-brand-green block mb-1">
                Budget Per Hamper (₹) *
              </label>
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full border border-brand-cream-dark/50 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:border-brand-gold text-brand-green bg-brand-cream-light/10"
              >
                <option value="500">₹300 - ₹500</option>
                <option value="1000">₹500 - ₹1000</option>
                <option value="1500">₹1000 - ₹1500</option>
                <option value="2500">₹1500 - ₹2500</option>
                <option value="5000">₹2500 - ₹5000</option>
                <option value="7500">₹5000+ Premium</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] tracking-wider uppercase font-semibold text-brand-green block mb-1">
                Required Delivery Date *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border border-brand-cream-dark/50 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:border-brand-gold text-brand-green bg-brand-cream-light/10"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] tracking-wider uppercase font-semibold text-brand-green block mb-1">
              Customization Requirements (Logo, Card message, Engraving)
            </label>
            <input
              type="text"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="e.g. Custom laser engraving on wood, brand greeting card slot"
              className="w-full border border-brand-cream-dark/50 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:border-brand-gold text-brand-green bg-brand-cream-light/10"
            />
          </div>

          <div>
            <label className="text-[10px] tracking-wider uppercase font-semibold text-brand-green block mb-1">
              Additional Details / Message
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any specific dry fruit assortments, packaging boxes colors, or notes..."
              className="w-full border border-brand-cream-dark/50 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:border-brand-gold text-brand-green bg-brand-cream-light/10"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-brand-green hover:bg-brand-green/95 text-brand-cream-light py-3.5 px-6 rounded-xl text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-md"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-brand-cream-light border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4 text-brand-gold" />
                  <span>Submit Requirement</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleWhatsAppInstantSubmit}
              className="bg-[#25D366] hover:bg-[#20ba5a] text-white py-3.5 px-6 rounded-xl text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <MessageSquare className="w-4 h-4 fill-current" />
              <span>Discuss via WhatsApp</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
