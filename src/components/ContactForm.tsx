"use client";

import React, { useState } from "react";
import { Send, CheckCircle } from "lucide-react";
import { createContactSubmission } from "@/lib/actions";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!name.trim() || !email.trim() || !phone.trim() || !message.trim()) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    try {
      const res = await createContactSubmission({
        name,
        email,
        phone,
        subject,
        message,
      });

      if (res.success) {
        setSuccess(true);
        setName("");
        setEmail("");
        setPhone("");
        setSubject("");
        setMessage("");
      } else {
        setErrorMsg(res.error || "Failed to send message. Please try again.");
      }
    } catch (e) {
      setErrorMsg("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white border border-brand-cream-dark/30 p-6 md:p-10 rounded-3xl shadow-xs font-sans">
      {success ? (
        <div className="text-center py-8 space-y-4">
          <div className="w-16 h-16 bg-brand-green/10 text-brand-green rounded-full flex items-center justify-center mx-auto mb-2">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h3 className="font-serif-editorial text-2xl text-brand-green font-bold">
            Message Sent Successfully
          </h3>
          <p className="text-sm text-brand-muted max-w-sm mx-auto leading-relaxed">
            Thank you for writing to ShubhMewa. Your message has been received. Our team will review it and reply within 24 hours.
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="px-6 py-2.5 bg-brand-green text-brand-cream-light text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-brand-green/90 transition-all shadow-sm"
          >
            Send Another Message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <h3 className="font-serif-editorial text-xl text-brand-green font-bold border-b border-brand-cream-dark/20 pb-3">
            Send Us a Message
          </h3>
          {errorMsg && <p className="text-red-500 text-xs font-semibold">{errorMsg}</p>}

          <div>
            <label className="text-[10px] tracking-wider uppercase font-semibold text-brand-green block mb-1">
              Your Full Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Rajesh Sharma"
              className="w-full border border-brand-cream-dark/50 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:border-brand-gold text-brand-green bg-brand-cream-light/10"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] tracking-wider uppercase font-semibold text-brand-green block mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full border border-brand-cream-dark/50 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:border-brand-gold text-brand-green bg-brand-cream-light/10"
              />
            </div>
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
                placeholder="10 Digits"
                className="w-full border border-brand-cream-dark/50 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:border-brand-gold text-brand-green bg-brand-cream-light/10"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] tracking-wider uppercase font-semibold text-brand-green block mb-1">
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Bulk dry fruits order inquiry"
              className="w-full border border-brand-cream-dark/50 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:border-brand-gold text-brand-green bg-brand-cream-light/10"
            />
          </div>

          <div>
            <label className="text-[10px] tracking-wider uppercase font-semibold text-brand-green block mb-1">
              Your Message *
            </label>
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your requirement or query here..."
              className="w-full border border-brand-cream-dark/50 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:border-brand-gold text-brand-green bg-brand-cream-light/10"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-green hover:bg-brand-green/95 text-brand-cream-light py-3 px-6 rounded-xl text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-md"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-brand-cream-light border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4 text-brand-gold" />
                <span>Send Message</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
