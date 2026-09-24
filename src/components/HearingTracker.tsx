"use client";

import { useState } from "react";
import { Search, Loader2, AlertCircle, CheckCircle2, CalendarDays, MapPin } from "lucide-react";
import { useBarangay } from "@/lib/barangay-context";
import Reveal from "./Reveal";

interface ApiCase {
  _id: string;
  case_reference: string;
  subject: string;
  status: string;
  nature?: string;
}

interface ApiHearing {
  _id: string;
  scheduled_date: string;
  start_time?: string;
  venue?: string;
  status: string;
}

async function fetchJson<T>(url: string): Promise<T> {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
}

function unwrap<T>(json: unknown): T[] {
  if (Array.isArray(json)) return json as T[];
  const items = (json as { items?: T[] }).items;
  return items ?? [];
}

export default function HearingTracker() {
  const { slug, name } = useBarangay();
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [cases, setCases] = useState<ApiCase[]>([]);
  const [hearings, setHearings] = useState<Record<string, ApiHearing[]>>({});
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ref = value.trim();
    if (!ref) return;
    setLoading(true);
    setSearched(true);
    setError(null);
    setCases([]);
    setHearings({});
    try {
      const found = unwrap<ApiCase>(
        await fetchJson(`/api/${slug}/cases?search=${encodeURIComponent(ref)}&limit=10`)
      );
      setCases(found);
      // Load hearings for each matched case
      const map: Record<string, ApiHearing[]> = {};
      await Promise.all(
        found.map(async (c) => {
          try {
            map[c._id] = unwrap<ApiHearing>(
              await fetchJson(`/api/${slug}/hearings?case_id=${encodeURIComponent(c._id)}&limit=20`)
            );
          } catch {
            map[c._id] = [];
          }
        })
      );
      setHearings(map);
    } catch {
      setError("Could not reach the barangay database. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="hearings" className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="section-title">
            <span className="inline-block bg-primary-50 text-primary-600 px-4 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
              Lupon Tagapamayapa · {name}
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
              <button type="submit" disabled={loading} className="btn-primary justify-center shrink-0 disabled:opacity-60">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />} Check
              </button>
            </form>

            {error && (
              <p className="mt-4 flex items-center gap-2 text-sm text-red-600">
                <AlertCircle className="w-4 h-4" /> {error}
              </p>
            )}

            {searched && !loading && !error && (
              <div className="mt-6 space-y-4">
                {cases.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    No case found for “{value.trim()}” in {name}.
                  </p>
                ) : (
                  cases.map((c) => (
                    <div key={c._id} className="rounded-xl border border-slate-200 p-4">
                      <p className="flex items-center gap-2 text-sm font-bold text-slate-800">
                        <CheckCircle2 className="w-4 h-4 text-secondary-500" />
                        {c.case_reference} — {c.subject}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Status: <span className="font-semibold">{c.status}</span>
                        {c.nature ? ` · ${c.nature}` : ""}
                      </p>
                      {(hearings[c._id] ?? []).length > 0 ? (
                        <ul className="mt-3 space-y-2">
                          {(hearings[c._id] ?? []).map((h) => (
                            <li key={h._id} className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 bg-slate-50 rounded-lg px-3 py-2">
                              <span className="flex items-center gap-1">
                                <CalendarDays className="w-3.5 h-3.5 text-primary-500" />
                                {h.scheduled_date}
                                {h.start_time ? ` · ${h.start_time}` : ""}
                              </span>
                              {h.venue && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3.5 h-3.5 text-primary-500" /> {h.venue}
                                </span>
                              )}
                              <span className="font-semibold">{h.status}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="mt-2 text-xs text-slate-400">No hearings scheduled yet.</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
