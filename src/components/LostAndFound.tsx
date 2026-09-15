"use client";

import { useState } from "react";
import { lostAndFound, Icons } from "@/lib/site";
import Reveal from "./Reveal";

const tabs = ["All", "Lost", "Found"] as const;
type Tab = (typeof tabs)[number];

const badgeStyles: Record<string, string> = {
  lost: "bg-amber-50 text-amber-700 border-amber-400",
  found: "bg-emerald-50 text-secondary-700 border-secondary-400",
};

const borderAccent: Record<string, string> = {
  lost: "border-t-amber-400",
  found: "border-t-secondary-400",
};

export default function LostAndFound() {
  const [active, setActive] = useState<Tab>("All");

  const items =
    active === "All"
      ? lostAndFound
      : lostAndFound.filter((item) => item.type === active.toLowerCase());

  return (
    <section id="lost-found" className="bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="section-title">
            <span className="inline-block bg-primary-50 text-primary-600 px-4 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
              Community Service
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800">
              Lost &amp; Found
            </h2>
            <p className="mt-3 text-slate-500">
              Report lost items or browse found belongings turned over to the
              Barangay Hall
            </p>
          </div>
        </Reveal>

        <Reveal delay={50}>
          <div className="flex justify-center gap-2 mt-8 mb-10">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActive(tab)}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  active === tab
                    ? "bg-primary-600 text-white shadow-md shadow-primary-600/20"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <Reveal key={item.title} delay={i * 100}>
              <article
                className={`bg-slate-50 rounded-xl border-t-4 ${borderAccent[item.type]} shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 p-6 h-full`}
              >
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border ${badgeStyles[item.type]}`}
                >
                  {item.type === "lost" ? (
                    <Icons.HelpCircle className="w-3.5 h-3.5" />
                  ) : (
                    <Icons.Package className="w-3.5 h-3.5" />
                  )}
                  {item.type === "lost" ? "Lost" : "Found"}
                </span>
                <h4 className="mt-3 text-lg font-semibold text-slate-800">
                  {item.title}
                </h4>
                <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Icons.MapPin className="w-3.5 h-3.5" />
                    {item.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Icons.CalendarDays className="w-3.5 h-3.5" />
                    {item.date}
                  </span>
                </div>
                <p className="mt-3 text-sm text-slate-500 leading-relaxed">
                  {item.description}
                </p>
              </article>
            </Reveal>
          ))}
        </div>

        {items.length === 0 && (
          <p className="text-center text-slate-400 mt-10">
            No items to display.
          </p>
        )}
      </div>
    </section>
  );
}
