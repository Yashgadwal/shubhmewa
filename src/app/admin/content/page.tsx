import React from "react";
import { prisma } from "@/lib/prisma";
import { updateWebsiteSetting } from "@/lib/actions";
import { revalidatePath } from "next/cache";
import { FileText, Save, CheckCircle } from "lucide-react";

export const revalidate = 0; // Dynamic server-side rendering

export default async function AdminContentPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const settingsList = await prisma.websiteSetting.findMany();
  const settings: Record<string, string> = {};
  settingsList.forEach((s) => {
    settings[s.key] = s.value;
  });

  const params = await searchParams;
  const showSuccess = params.success === "true";

  // Server action to handle settings form save
  const handleSaveSettings = async (formData: FormData) => {
    "use server";

    const keys = [
      "announcement_text",
      "announcement_active",
      "whatsapp_number",
      "contact_phone",
      "contact_email",
      "store_address",
      "store_timings",
      "google_maps_link",
      "instagram_link",
      "footer_credit",
      "online_checkout_active",
      "hero_title",
      "hero_subtitle",
    ];

    for (const key of keys) {
      const val = formData.get(key) as string;
      if (val !== null) {
        await updateWebsiteSetting(key, val);
      }
    }

    revalidatePath("/");
    revalidatePath("/admin/content");
  };

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className="font-serif-editorial text-3xl text-brand-green font-bold">
          CMS Settings
        </h1>
        <p className="text-xs text-brand-muted mt-1 leading-relaxed">
          Manage landing text, announcement bars, WhatsApp numbers, timings, checkout parameters, and footer credits.
        </p>
      </div>

      {showSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-center gap-2 text-xs font-semibold">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>Website configurations saved and synchronized successfully!</span>
        </div>
      )}

      <form action={handleSaveSettings} className="bg-white border border-brand-cream-dark/30 rounded-2xl p-6 md:p-8 space-y-6 shadow-xs">
        
        {/* Announcement Section */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold tracking-wider text-brand-gold uppercase border-b border-brand-cream-light pb-2 flex items-center gap-1.5">
            <FileText className="w-4 h-4" />
            Announcement Bar
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-8 space-y-1">
              <label className="text-[10px] uppercase tracking-wider font-bold text-brand-green">
                Offer Bar Text
              </label>
              <input
                type="text"
                name="announcement_text"
                defaultValue={settings["announcement_text"] || ""}
                className="w-full border border-brand-cream-dark/50 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:border-brand-gold text-brand-green"
              />
            </div>
            <div className="md:col-span-4 space-y-1">
              <label className="text-[10px] uppercase tracking-wider font-bold text-brand-green">
                Announcement Active
              </label>
              <select
                name="announcement_active"
                defaultValue={settings["announcement_active"] || "true"}
                className="w-full border border-brand-cream-dark/50 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:border-brand-gold text-brand-green bg-brand-cream-light/15 font-semibold"
              >
                <option value="true">Active (Visible)</option>
                <option value="false">Inactive (Hidden)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Hero Landing Text */}
        <div className="space-y-4 pt-4">
          <h3 className="text-xs font-bold tracking-wider text-brand-gold uppercase border-b border-brand-cream-light pb-2 flex items-center gap-1.5">
            <FileText className="w-4 h-4" />
            Hero Banner Typography
          </h3>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wider font-bold text-brand-green">
                Main Headline Title
              </label>
              <input
                type="text"
                name="hero_title"
                defaultValue={settings["hero_title"] || ""}
                className="w-full border border-brand-cream-dark/50 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:border-brand-gold text-brand-green font-bold"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wider font-bold text-brand-green">
                Supporting Subtitle
              </label>
              <textarea
                name="hero_subtitle"
                rows={2}
                defaultValue={settings["hero_subtitle"] || ""}
                className="w-full border border-brand-cream-dark/50 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:border-brand-gold text-brand-green"
              />
            </div>
          </div>
        </div>

        {/* Contacts & Channels */}
        <div className="space-y-4 pt-4">
          <h3 className="text-xs font-bold tracking-wider text-brand-gold uppercase border-b border-brand-cream-light pb-2 flex items-center gap-1.5">
            <FileText className="w-4 h-4" />
            Store Contact Channels
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wider font-bold text-brand-green">
                WhatsApp Sourced Num * (Prefix only, e.g. 919876543210)
              </label>
              <input
                type="text"
                name="whatsapp_number"
                defaultValue={settings["whatsapp_number"] || ""}
                className="w-full border border-brand-cream-dark/50 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:border-brand-gold text-brand-green font-semibold"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wider font-bold text-brand-green">
                Contact Phone Text
              </label>
              <input
                type="text"
                name="contact_phone"
                defaultValue={settings["contact_phone"] || ""}
                className="w-full border border-brand-cream-dark/50 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:border-brand-gold text-brand-green"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wider font-bold text-brand-green">
                Contact Email
              </label>
              <input
                type="email"
                name="contact_email"
                defaultValue={settings["contact_email"] || ""}
                className="w-full border border-brand-cream-dark/50 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:border-brand-gold text-brand-green"
              />
            </div>
          </div>
        </div>

        {/* Mappings & Locations */}
        <div className="space-y-4 pt-4">
          <h3 className="text-xs font-bold tracking-wider text-brand-gold uppercase border-b border-brand-cream-light pb-2 flex items-center gap-1.5">
            <FileText className="w-4 h-4" />
            Shop Information & Coordinates
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-bold text-brand-green">
                  Operating Timings
                </label>
                <input
                  type="text"
                  name="store_timings"
                  defaultValue={settings["store_timings"] || ""}
                  className="w-full border border-brand-cream-dark/50 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:border-brand-gold text-brand-green"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-bold text-brand-green">
                  Google Maps URL link
                </label>
                <input
                  type="text"
                  name="google_maps_link"
                  defaultValue={settings["google_maps_link"] || ""}
                  className="w-full border border-brand-cream-dark/50 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:border-brand-gold text-brand-green"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-bold text-brand-green">
                  Boutique Street Address
                </label>
                <input
                  type="text"
                  name="store_address"
                  defaultValue={settings["store_address"] || ""}
                  className="w-full border border-brand-cream-dark/50 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:border-brand-gold text-brand-green"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-bold text-brand-green">
                  Instagram Link
                </label>
                <input
                  type="text"
                  name="instagram_link"
                  defaultValue={settings["instagram_link"] || ""}
                  className="w-full border border-brand-cream-dark/50 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:border-brand-gold text-brand-green"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Global Parameters */}
        <div className="space-y-4 pt-4">
          <h3 className="text-xs font-bold tracking-wider text-brand-gold uppercase border-b border-brand-cream-light pb-2 flex items-center gap-1.5">
            <FileText className="w-4 h-4" />
            Global Parameters & Checkout Toggles
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wider font-bold text-brand-green">
                Online Checkout Support (COD)
              </label>
              <select
                name="online_checkout_active"
                defaultValue={settings["online_checkout_active"] || "true"}
                className="w-full border border-brand-cream-dark/50 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:border-brand-gold text-brand-green bg-brand-cream-light/15 font-semibold"
              >
                <option value="true">Enabled (Allow standard online cart order)</option>
                <option value="false">Disabled (Only WhatsApp ordering redirects)</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wider font-bold text-brand-green">
                Footer Copyright Credit text
              </label>
              <input
                type="text"
                name="footer_credit"
                defaultValue={settings["footer_credit"] || ""}
                className="w-full border border-brand-cream-dark/50 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:border-brand-gold text-brand-green"
              />
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="pt-6 border-t border-brand-cream-dark/20 flex justify-end">
          <button
            type="submit"
            className="bg-brand-green hover:bg-brand-green/95 text-brand-cream-light py-3 px-8 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md"
          >
            <Save className="w-4 h-4 text-brand-gold" />
            <span>Save configurations</span>
          </button>
        </div>

      </form>
    </div>
  );
}
