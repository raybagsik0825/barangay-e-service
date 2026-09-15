"use client";

import { stats } from "@/lib/site";
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

export default function Stats() {
  return (
    <section id="stats" className="bg-white -mt-12 relative z-20 pb-2">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <StatItem key={stat.label} {...stat} delay={i * 100} />
          ))}
        </div>
      </div>
    </section>
  );
}
