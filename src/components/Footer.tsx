"use client";

import Link from "next/link";
import { Building2, Facebook, Twitter, Mail, Phone, Clock, ShieldAlert } from "lucide-react";
import { siteConfig } from "@/lib/site";

const quickLinks = [
  { label: "Features", href: "#features" },
  { label: "Announcements", href: "#announcements" },
  { label: "Hearing Schedules", href: "#hearings" },
  { label: "Crime Registry", href: "#crime-db" },
];

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12">
          <div>
            <div className="flex items-center gap-2.5 font-bold text-lg">
              <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-700 to-primary-500 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </span>
              Barangay System
            </div>
            <p className="mt-4 text-sm text-slate-400 leading-relaxed">
              Committed to efficient public governance, safety, and community
              justice through digital innovation.
            </p>
            <div className="flex gap-3 mt-5">
              {[
                { icon: Facebook, label: "Facebook" },
                { icon: Twitter, label: "Twitter" },
                { icon: Mail, label: "Email" },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  aria-label={label}
                  className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:bg-primary-600 hover:text-white transition-all duration-300 hover:-translate-y-0.5"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-200 mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-all flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-500 group-hover:translate-x-1 transition-transform" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-200 mb-4">
              Emergency
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <a href="tel:+63281234567" className="flex items-center gap-2.5 hover:text-white transition-colors">
                  <Phone className="w-4 h-4 text-primary-400" /> Barangay Hotline: {siteConfig.hotline}
                </a>
              </li>
              <li>
                <a href="tel:+63289876543" className="flex items-center gap-2.5 hover:text-white transition-colors">
                  <ShieldAlert className="w-4 h-4 text-primary-400" /> Local PNP: {siteConfig.pnp}
                </a>
              </li>
              <li>
                <a href="tel:911" className="flex items-center gap-2.5 hover:text-white transition-colors">
                  <Phone className="w-4 h-4 text-danger-400" /> Emergency: {siteConfig.emergency}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-200 mb-4">
              Office Hours
            </h4>
            <div className="space-y-3 text-sm text-slate-400">
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-primary-400 mt-0.5" />
                <div>
                  <p className="font-medium text-slate-300">Monday – Friday</p>
                  <p>8:00 AM – 5:00 PM</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-primary-400 mt-0.5" />
                <div>
                  <p className="font-medium text-slate-300">Saturday</p>
                  <p>8:00 AM – 12:00 PM</p>
                </div>
              </div>
              <p className="text-slate-500">Sunday & Holidays — Closed</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 text-center text-sm text-slate-500">
          &copy; 2026 Barangay Management & Lupon Hearing System. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
