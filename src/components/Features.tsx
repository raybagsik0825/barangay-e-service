"use client";

import { features } from "@/lib/site";
import Reveal from "./Reveal";

export default function Features() {
  return (
    <section id="features" className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="section-title">
            <span className="inline-block bg-primary-50 text-primary-600 px-4 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
              Our Services
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800">
              Everything Your Barangay Needs
            </h2>
            <p className="mt-3 text-slate-500 max-w-xl mx-auto">
              Digital tools designed to improve governance, transparency, and
              community safety.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <Reveal key={feature.title} delay={i * 100}>
              <div className="group h-full bg-white rounded-2xl p-7 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 border border-slate-100 relative overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100/50 text-primary-600 group-hover:from-primary-600 group-hover:to-primary-500 group-hover:text-white transition-all duration-300">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-800">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
