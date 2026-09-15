"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import Reveal from "./Reveal";

export default function HearingTracker() {
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Searching system database for: ${value || "unknown case..."}`);
  };

  return (
    <section id="hearings" className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="section-title">
            <span className="inline-block bg-primary-50 text-primary-600 px-4 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
              Lupon Tagapamayapa
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800">
              Subpoena & Hearing Tracker
            </h2>
            <p className="mt-3 text-slate-500">
              Check the status of regular complaints and Lupon hearings
            </p>
          </div>
        </Reveal>

        <Reveal>
          <div className="max-w-2xl mx-auto bg-white rounded-2xl p-8 md:p-10 shadow-md border border-slate-100">
            <h3 className="flex items-center gap-3 text-xl font-semibold text-slate-800">
              <span className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
                <Search className="w-5 h-5" />
              </span>
              Track Your Hearing Schedule
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Complainants and respondents can input their Case Reference Number
              below to check approved schedules and updates.
            </p>
            <form onSubmit={handleSubmit} className="mt-6 flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Enter Case Reference Number (e.g., CF-2026-0891)"
                className="flex-1 px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all text-sm placeholder:text-slate-400"
                required
              />
              <button type="submit" className="btn-primary justify-center shrink-0">
                <Search className="w-4 h-4" /> Check
              </button>
            </form>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
