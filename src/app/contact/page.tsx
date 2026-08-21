import React from "react";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { prisma } from "@/lib/prisma";
import ContactForm from "@/components/ContactForm";

export const revalidate = 0; // Dynamic server-side rendering

export default async function ContactPage() {
  const settingsList = await prisma.websiteSetting.findMany();
  const settings: Record<string, string> = {};
  settingsList.forEach((s) => {
    settings[s.key] = s.value;
  });

  const address = settings["store_address"] || "12, Freeganj Main Road, Opp. Gold Gym, Ujjain, Madhya Pradesh - 456001";
  const timings = settings["store_timings"] || "10:00 AM - 09:30 PM (All Days)";
  const phone = settings["contact_phone"] || "+91 98765 43210";
  const email = settings["contact_email"] || "info@harshildryfruits.com";
  const whatsappNumber = settings["whatsapp_number"] || "919876543210";
  const mapsLink = settings["google_maps_link"] || "https://maps.google.com/?q=Freeganj+Ujjain";

  return (
    <div className="w-full bg-brand-cream-light/30 min-h-screen py-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto">
          <span className="text-[10px] tracking-widest font-bold uppercase text-brand-gold">Reach Out</span>
          <h1 className="font-serif-editorial text-4xl text-brand-green font-bold mt-2">
            Contact Harshil Dry Fruits
          </h1>
          <div className="h-[1px] w-20 bg-brand-gold mx-auto mt-3" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Info details */}
          <div className="lg:col-span-5 space-y-6">
            <h2 className="font-serif-editorial text-2xl text-brand-green font-bold">
              Ujjain Boutique Store
            </h2>
            <p className="text-xs text-brand-muted leading-relaxed">
              We welcome your visits, phone enquiries, and custom hamper meetings. Check local delivery zones or drop us a message.
            </p>

            <div className="space-y-4 text-xs text-brand-green">
              <div className="flex gap-3 bg-white p-4 rounded-xl border border-brand-cream-dark/30 shadow-xs">
                <MapPin className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Store Address</p>
                  <a href={mapsLink} target="_blank" className="hover:underline text-brand-muted mt-1 block">
                    {address}
                  </a>
                </div>
              </div>

              <div className="flex gap-3 bg-white p-4 rounded-xl border border-brand-cream-dark/30 shadow-xs">
                <Clock className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Store Timings</p>
                  <p className="text-brand-muted mt-1">{timings}</p>
                </div>
              </div>

              <div className="flex gap-3 bg-white p-4 rounded-xl border border-brand-cream-dark/30 shadow-xs">
                <Phone className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Call / WhatsApp</p>
                  <p className="text-brand-muted mt-1">Phone: {phone}</p>
                  <a href={`https://wa.me/${whatsappNumber}`} target="_blank" className="text-brand-gold hover:underline font-semibold mt-1 block">
                    WhatsApp Chat
                  </a>
                </div>
              </div>

              <div className="flex gap-3 bg-white p-4 rounded-xl border border-brand-cream-dark/30 shadow-xs">
                <Mail className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Email Communications</p>
                  <a href={`mailto:${email}`} className="text-brand-muted mt-1 block hover:underline">
                    {email}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Form container */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>

        {/* Map iframe */}
        <div className="w-full h-[400px] bg-white border border-brand-cream-dark/30 rounded-3xl overflow-hidden shadow-xs">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14686.096739414272!2d75.78018314441584!3d23.169305141014167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39637446af090b8f%3A0xe9f7b03b41d24c01!2sFreeganj%2C%20Madhya%20Pradesh%20456010!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
