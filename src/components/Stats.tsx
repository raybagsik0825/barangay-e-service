"use client";

import { useEffect, useState } from "react";
import { stats as staticStats } from "@/lib/site";
import { Bell, Scale, ShieldAlert, Package } from "lucide-react";
import { useBarangay } from "@/lib/barangay-context";
import { useInView, useCountUp } from "@/lib/hooks";
import Reveal from "./Reveal";
import type { LucideIcon } from "lucide-react";

const toneMap: Record<
  string,
  { wrap: string; icon: string }
> = {
  blue: { wrap: "bg-blue-50", icon: "text-primary-600" },
  green: { wrap: "bg-emerald-50", icon: "text-secondary-600" },
  red: { wrap: "bg-red-50", icon: "text-danger-600" },
  yellow: { wrap: "bg-amber-50", icon: "text-amber-600" },
};

function StatItem({
  icon: Icon,
  value,
  label,
  tone,
  delay,
}: {
  icon: LucideIcon;
  value: number;
  label: string;
  tone: string;
  delay: number;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const count = useCountUp(value, inView);
  const toneCls = toneMap[tone] ?? toneMap.blue;

  return (
    <Reveal delay={delay}>
      <div ref={ref} className="text-center p-6">
        <div
          className={`w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 ${toneCls.wrap}`}
        >
          <Icon className={`w-6 h-6 ${toneCls.icon}`} />
        </div>
        <div className="text-3xl font-extrabold text-slate-800">{count}</div>
        <div className="mt-1 text-sm text-slate-500">{label}</div>
      </div>
    </Reveal>
  );
}

async function fetchTotal(url: string): Promise<number | null> {
  try {
    const r = await fetch(url);
    if (!r.ok) return null;
    const json = await r.json();
    if (typeof json.total === "number") return json.total;
    if (Array.isArray(json)) return json.length;
    return null;
  } catch {
    return null;
  }
}

export default function Stats() {
  const { slug } = useBarangay();
  const [live, setLive] = useState<number[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetchTotal(`/api/${slug}/announcements?limit=1`),
      fetchTotal(`/api/${slug}/cases?limit=1`),
      fetchTotal(`/api/${slug}/crime-reports?status=active&limit=1`),
      fetchTotal(`/api/${slug}/lost-found?status=open&limit=1`),
    ]).then((totals) => {
      if (cancelled) return;
      if (totals.every((t) => t !== null)) {
        setLive(totals as number[]);
      } else {
        setLive(null);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const items =
    live !== null
      ? [
          { icon: Bell, value: live[0], label: "Announcements", tone: "blue" },
          { icon: Scale, value: live[1], label: "Cases Filed", tone: "green" },
          { icon: ShieldAlert, value: live[2], label: "Active Alerts", tone: "red" },
          { icon: Package, value: live[3], label: "Open Lost & Found", tone: "yellow" },
        ]
      : staticStats.map((s) => ({ icon: s.icon, value: s.value, label: s.label, tone: s.tone }));

  return (
    <section id="stats" className="bg-white -mt-12 relative z-20 pb-2">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map((stat, i) => (
            <StatItem key={stat.label} {...stat} delay={i * 100} />
          ))}
        </div>
      </div>
    </section>
  );
}
