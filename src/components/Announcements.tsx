"use client";

import { announcements } from "@/lib/site";
import { Icons } from "@/lib/site";
import Reveal from "./Reveal";

export default function Announcements() {
  return (
    <section id="announcements" className="bg-white py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="section-title">
            <span className="inline-block bg-primary-50 text-primary-600 px-4 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
              Stay Informed
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800">
              Announcements & Updates
            </h2>
            <p className="mt-3 text-slate-500">
              Latest updates aimed at improving our barangay community
            </p>
          </div>
        </Reveal>

        <div className="space-y-4">
          {announcements.map((ann, i) => (
            <Reveal key={ann.title} delay={i * 100}>
              <article className="bg-slate-50 border-l-4 border-secondary-500 rounded-r-xl px-6 py-5 transition-all duration-300 hover:translate-x-1.5 hover:bg-white hover:shadow-md">
                <div className="flex items-center gap-2 text-sm font-semibold text-secondary-600">
                  <Icons.CalendarDays className="w-4 h-4" />
                  {ann.date}
                </div>
                <h3 className="mt-1.5 text-lg font-semibold text-slate-800">
                  {ann.title}
                </h3>
                <p className="mt-1 text-sm text-slate-500">{ann.description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
