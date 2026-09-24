"use client";

import { announcements as staticAnnouncements } from "@/lib/site";
import { Icons } from "@/lib/site";
import { useBarangay } from "@/lib/barangay-context";
import { usePublicList } from "@/lib/use-public";
import Reveal from "./Reveal";

interface ApiAnnouncement {
  _id: string;
  title: string;
  body: string;
  published_at?: string;
  is_published?: boolean;
}

function formatDate(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default function Announcements() {
  const { name } = useBarangay();
  const { data } = usePublicList<ApiAnnouncement>(
    "announcements",
    "?limit=20&sort=-published_at",
    []
  );

  const items =
    data.length > 0
      ? data
          .filter((a) => a.is_published !== false)
          .map((a) => ({
            key: a._id,
            date: formatDate(a.published_at),
            title: a.title,
            description: a.body,
          }))
      : staticAnnouncements.map((a) => ({
          key: a.title,
          date: a.date,
          title: a.title,
          description: a.description,
        }));

  return (
    <section id="announcements" className="bg-white py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="section-title">
            <span className="inline-block bg-primary-50 text-primary-600 px-4 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
              Stay Informed · {name}
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
          {items.map((ann, i) => (
            <Reveal key={ann.key} delay={i * 100}>
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
