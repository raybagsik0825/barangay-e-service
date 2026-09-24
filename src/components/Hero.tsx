"use client";

import { CheckCircle2, CalendarCheck, ArrowDown, ChevronDown, MapPin } from "lucide-react";
import { useBarangay } from "@/lib/barangay-context";

export default function Hero() {
  const { name } = useBarangay();
  return (
    <section className="relative isolate overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1350&q=80')",
        }}
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary-900/90 to-primary-700/85" />
      <div
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 30% 50%, rgba(37,99,235,0.3) 0%, transparent 60%), radial-gradient(circle at 70% 80%, rgba(5,150,105,0.2) 0%, transparent 50%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-40 md:pt-48 pb-32 md:pb-36 text-center relative z-10">
        <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/25 rounded-full px-4 py-1.5 text-sm font-medium text-white animate-fade-down">
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          Official Barangay Digital Platform
        </div>

        <div className="mt-4 inline-flex items-center gap-1.5 text-white/90 text-sm font-semibold tracking-wide uppercase animate-fade-down">
          <MapPin className="w-4 h-4 text-emerald-300" />
          Barangay {name}
        </div>

        <h1 className="mt-6 text-4xl md:text-6xl font-extrabold leading-tight tracking-tight text-white animate-fade-up">
          Smart <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-emerald-300">Barangay</span> Services
          <br />& Public Safety
        </h1>

        <p className="mt-6 max-w-2xl mx-auto text-lg text-white/90 animate-fade-up" style={{ animationDelay: "0.2s" }}>
          Transparent community updates, streamlined Lupon Tagapamayapa hearing
          schedules, and enhanced public safety — all in one portal.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 animate-fade-up" style={{ animationDelay: "0.4s" }}>
          <a href="#hearings" className="btn bg-white text-primary-900 hover:-translate-y-0.5 hover:shadow-2xl shadow-xl px-7 py-3.5 text-base">
            <CalendarCheck className="w-5 h-5" /> Check Hearing Schedule
          </a>
          <a href="#features" className="btn border-2 border-white/40 text-white hover:bg-white hover:text-primary-900 px-7 py-3.5 text-base">
            <ArrowDown className="w-5 h-5" /> Explore Services
          </a>
        </div>
      </div>

      <a
        href="#stats"
        onClick={(e) => {
          e.preventDefault();
          document.querySelector("#stats")?.scrollIntoView({ behavior: "smooth" });
        }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 hover:text-white transition-colors animate-bounce z-10"
      >
        <ChevronDown className="w-7 h-7" />
      </a>
    </section>
  );
}
