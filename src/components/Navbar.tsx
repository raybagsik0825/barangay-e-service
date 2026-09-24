"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Building2, Menu, X, Lock, ChevronDown, MapPin, Check } from "lucide-react";
import { navLinks } from "@/lib/site";
import { barangays } from "@/lib/barangays";
import { useBarangay } from "@/lib/barangay-context";

function BarangayMenu({ onPick }: { onPick?: () => void }) {
  const { slug, setSlug } = useBarangay();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const current = barangays.find((b) => b.slug === slug) ?? barangays[0];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-primary-600 hover:bg-primary-50 transition-all"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <MapPin className="w-4 h-4 text-primary-600" />
        <span className="max-w-[130px] truncate">{current.name}</span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-64 max-h-80 overflow-y-auto rounded-xl border border-slate-100 bg-white shadow-xl z-50 py-1.5"
        >
          <p className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Select barangay
          </p>
          {barangays.map((b) => (
            <button
              key={b.slug}
              type="button"
              role="menuitem"
              onClick={() => {
                setSlug(b.slug);
                setOpen(false);
                onPick?.();
              }}
              className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${
                b.slug === slug
                  ? "bg-primary-50 text-primary-700 font-semibold"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <span className="truncate">{b.name}</span>
              {b.slug === slug && <Check className="w-4 h-4 shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleNav = (href: string) => {
    setOpen(false);
    // Allow native smooth scroll for anchor links
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/90 backdrop-blur-lg shadow-md py-3"
            : "bg-white/70 backdrop-blur-lg py-4"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex items-center gap-2.5 font-extrabold text-lg tracking-tight text-primary-900"
          >
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-800 to-primary-600 flex items-center justify-center text-white shadow-md shadow-primary-900/20">
              <Building2 className="w-5 h-5" />
            </span>
            Barangay E-Services
          </Link>

          {/* Desktop */}
          <ul className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNav(link.href);
                  }}
                  className="px-3.5 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-primary-600 hover:bg-primary-50 transition-all"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden lg:flex items-center gap-1">
            <BarangayMenu />
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <Link href="/login" className="btn-primary">
              <Lock className="w-4 h-4" /> Admin Login
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors z-50 relative"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>
      </header>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 lg:hidden ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      />

      {/* Mobile drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-[75%] max-w-xs bg-white z-50 shadow-2xl transition-transform duration-300 ease-out lg:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <span className="font-bold text-primary-900 flex items-center gap-2">
            <Building2 className="w-5 h-5" /> Barangay
          </span>
          <button
            onClick={() => setOpen(false)}
            className="p-2 rounded-lg hover:bg-slate-100"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <ul className="py-4 px-4 flex flex-col gap-1">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNav(link.href);
                }}
                className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-slate-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
              >
                {link.label}
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </a>
            </li>
          ))}
        </ul>
        <div className="px-6 pt-2">
          <p className="px-4 pb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Barangay
          </p>
          <BarangayMenu onPick={() => setOpen(false)} />
        </div>
        <div className="px-6 pb-8 mt-2">
          <Link href="/login" onClick={() => setOpen(false)} className="btn-primary w-full justify-center">
            <Lock className="w-4 h-4" /> Admin Login
          </Link>
        </div>
      </div>
    </>
  );
}
