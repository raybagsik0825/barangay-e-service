"use client";

import { crimes as staticCrimes } from "@/lib/site";
import { Icons } from "@/lib/site";
import { ShieldAlert, CheckCircle2, Search } from "lucide-react";
import { useBarangay } from "@/lib/barangay-context";
import { usePublicList } from "@/lib/use-public";
import Reveal from "./Reveal";

const badgeMap: Record<string, { cls: string; border: string }> = {
  danger: {
    cls: "bg-red-50 text-danger-600",
    border: "border-t-danger-500",
  },
  success: {
    cls: "bg-emerald-50 text-secondary-600",
    border: "border-t-secondary-500",
  },
  warning: {
    cls: "bg-amber-50 text-amber-600",
    border: "border-t-amber-400",
  },
};

interface ApiCrime {
  _id: string;
  title: string;
  location: string;
  description: string;
  status: string;
  incident_type?: string;
}

const statusMeta: Record<string, { badge: string; label: string }> = {
  active: { badge: "danger", label: "Active Alert" },
  under_investigation: { badge: "warning", label: "Under Investigation" },
  resolved: { badge: "success", label: "Resolved" },
  closed: { badge: "success", label: "Closed" },
};

const badgeIcon: Record<string, typeof ShieldAlert> = {
  danger: ShieldAlert,
  warning: Search,
  success: CheckCircle2,
};

export default function CrimeRegistry() {
  const { name } = useBarangay();
  const { data } = usePublicList<ApiCrime>("crime-reports", "?limit=20&sort=-incident_date", []);

  const items =
    data.length > 0
      ? data.map((c) => {
          const meta = statusMeta[c.status] ?? statusMeta.active;
          const IconCmp = badgeIcon[meta.badge];
          return {
            key: c._id,
            badge: meta.badge,
            status: meta.label,
            icon: IconCmp,
            title: c.title,
            location: c.location,
            description: c.description,
          };
        })
      : staticCrimes.map((c) => ({
          key: c.title,
          badge: c.badge,
          status: c.status,
          icon: c.icon,
          title: c.title,
          location: c.location,
          description: c.description,
        }));

  return (
    <section id="crime-db" className="bg-slate-100 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="section-title">
            <span className="inline-block bg-primary-50 text-primary-600 px-4 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
              Public Awareness · {name}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800">
              Safety & Crime Registry
            </h2>
            <p className="mt-3 text-slate-500">
              Reference database maintained for public safety and community
              awareness
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((crime, i) => {
            const badge = badgeMap[crime.badge];
            return (
              <Reveal key={crime.key} delay={i * 100}>
                <article
                  className={`bg-white rounded-xl border-t-4 ${badge.border} shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 p-6 h-full`}
                >
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold ${badge.cls}`}>
                    <crime.icon className="w-3.5 h-3.5" />
                    {crime.status}
                  </span>
                  <h4 className="mt-3 text-lg font-semibold text-slate-800">
                    {crime.title}
                  </h4>
                  <p className="mt-1 text-sm text-slate-500 flex items-center gap-1.5">
                    <Icons.MapPin className="w-3.5 h-3.5" />
                    {crime.location}
                  </p>
                  <p className="mt-3 text-sm text-slate-500 leading-relaxed">
                    {crime.description}
                  </p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
