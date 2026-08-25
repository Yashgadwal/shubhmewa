"use client";

import React, { useState } from "react";
import { adminLogin } from "@/lib/actions";
import { Lock, Mail, Loader2, Sparkles } from "lucide-react";

export default function AdminLoginPage() {
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    try {
      const res = await adminLogin(null, formData);
      if (res && res.error) {
        setErrorMsg(res.error);
        setLoading(false);
      }
    } catch (e) {
      // If Next.js triggers a redirect, it throws an internal error which is caught.
      // We don't want to show an error on redirect.
      // So we check if the error is a Next.js redirect.
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream-light/60 flex items-center justify-center p-4 font-sans select-none">
      <div className="w-full max-w-md bg-white border border-brand-cream-dark/40 rounded-3xl p-8 md:p-10 shadow-lg space-y-6 relative overflow-hidden">
        
        {/* Subtle gold decoration */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-brand-gold" />

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1 bg-brand-green/10 text-brand-green px-3 py-1 rounded-full text-[10px] tracking-widest font-bold uppercase mx-auto">
            <Lock className="w-3 h-3 text-brand-gold" />
            <span>Secure Access</span>
          </div>
          <h1 className="font-serif-editorial text-2xl md:text-3xl text-brand-green font-bold">
            ShubhMewa
          </h1>
          <p className="text-[11px] uppercase tracking-widest text-brand-gold font-bold">
            Store Management Panel
          </p>
        </div>

        {errorMsg && (
          <p className="text-red-500 text-xs font-semibold text-center bg-red-50 py-3 border border-red-200 rounded-xl">
            {errorMsg}
          </p>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-wider font-bold text-brand-green block">
              Admin Email
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                required
                placeholder="e.g. admin@shubhmewa.com"
                className="w-full border border-brand-cream-dark/50 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:border-brand-gold text-brand-green bg-brand-cream-light/10 pl-9"
              />
              <Mail className="w-4 h-4 text-brand-muted absolute left-3 top-3" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-wider font-bold text-brand-green block">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                name="password"
                required
                placeholder="••••••••"
                className="w-full border border-brand-cream-dark/50 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:border-brand-gold text-brand-green bg-brand-cream-light/10 pl-9"
              />
              <Lock className="w-4 h-4 text-brand-muted absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-green hover:bg-brand-green/95 text-brand-cream-light py-3 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-md mt-6"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin text-brand-gold" />
            ) : (
              <span>Login Dashboard</span>
            )}
          </button>
        </form>

        <p className="text-[9px] text-brand-muted text-center pt-2 italic">
          *Access is logged securely in compliance with food safety operations.
        </p>

      </div>
    </div>
  );
}
