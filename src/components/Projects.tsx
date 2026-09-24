"use client";

import { projects as staticProjects } from "@/lib/site";
import { Icons } from "@/lib/site";
import { Landmark } from "lucide-react";
import { useBarangay } from "@/lib/barangay-context";
import { usePublicList } from "@/lib/use-public";
import Reveal from "./Reveal";

interface ApiProject {
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
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long" });
}

export default function Projects() {
  const { name } = useBarangay();
  const { data } = usePublicList<ApiProject>(
    "announcements",
    "?category=project&limit=9&sort=-published_at",
    []
  );

  const items =
    data.length > 0
      ? data
          .filter((p) => p.is_published !== false)
          .map((p) => ({
            key: p._id,
            date: formatDate(p.published_at),
            title: p.title,
            description: p.body,
          }))
      : staticProjects.map((p) => ({
          key: p.title,
          date: p.date,
          title: p.title,
          description: p.description,
        }));

  return (
    <section id="projects" className="bg-slate-50 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="section-title">
            <span className="inline-block bg-primary-50 text-primary-600 px-4 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
              Development · {name}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800">
              Barangay Projects
            </h2>
            <p className="mt-3 text-slate-500">
              Ongoing and upcoming development projects in our community
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((p, i) => (
            <Reveal key={p.key} delay={i * 100}>
              <article className="bg-white rounded-xl border-t-4 border-t-secondary-500 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 p-6 h-full">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-50 text-secondary-600">
                  <Landmark className="w-3.5 h-3.5" />
                  Project
                </span>
                <h4 className="mt-3 text-lg font-semibold text-slate-800">
                  {p.title}
                </h4>
                <p className="mt-1 text-sm text-slate-500 flex items-center gap-1.5">
                  <Icons.CalendarDays className="w-3.5 h-3.5" />
                  {p.date}
                </p>
                <p className="mt-3 text-sm text-slate-500 leading-relaxed">
                  {p.description}
                </p>
              </article>
            </Reveal>
          ))}
        </div>

        {items.length === 0 && (
          <p className="text-center text-slate-400 mt-10">No projects to display.</p>
        )}
      </div>
    </section>
  );
}
