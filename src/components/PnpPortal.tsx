"use client";

import { FileSignature, Loader2, CheckCircle2, AlertCircle, Building2 } from "lucide-react";
import { useState } from "react";
import { useBarangay } from "@/lib/barangay-context";
import Reveal from "./Reveal";

export default function PnpPortal() {
  const { slug, name } = useBarangay();
  const [office, setOffice] = useState("");
  const [purpose, setPurpose] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleRequest(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setDone(null);
    setError(null);
    try {
      const requestCode = `REQ-${Date.now().toString().slice(-8)}`;
      const r = await fetch(`/api/${slug}/document-requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          request_code: requestCode,
          requesting_office: office.trim(),
          purpose: purpose.trim(),
        }),
      });
      if (!r.ok) {
        const j = await r.json().catch(() => ({}));
        throw new Error((j as { error?: string }).error || `HTTP ${r.status}`);
      }
      setDone(`Request ${requestCode} submitted to ${name}. The barangay will review and fulfill it.`);
      setOffice("");
      setPurpose("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="pnp-portal" className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="section-title">
            <span className="inline-block bg-primary-50 text-primary-600 px-4 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
              Law Enforcement · {name}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800">
              PNP Document Portal
            </h2>
            <p className="mt-3 text-slate-500">
              Official documentation access for authorized PNP personnel
            </p>
          </div>
        </Reveal>

        <Reveal>
          <div className="max-w-2xl mx-auto bg-white rounded-2xl p-8 md:p-12 text-center border-2 border-dashed border-primary-400 hover:border-primary-500 hover:shadow-lg transition-all duration-300">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100/50 flex items-center justify-center">
              <FileSignature className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="mt-5 text-xl font-semibold text-slate-800">
              Certificate to File Action (CFA) & Official Files
            </h3>
            <p className="mt-3 text-slate-500 max-w-md mx-auto">
              Authorized personnel from the local Philippine National Police (PNP)
              office can access and request generated PDF files (CFA, hearing logs,
              and complaint records) for further legal actions.
            </p>

            <form onSubmit={handleRequest} className="mt-6 text-left flex flex-col gap-3">
              <label className="block text-sm">
                <span className="font-medium text-slate-700 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-slate-400" /> Requesting office
                </span>
                <input
                  value={office}
                  onChange={(e) => setOffice(e.target.value)}
                  required
                  placeholder="e.g. Navotas City Police Station"
                  className="mt-1 w-full rounded-xl border-2 border-slate-200 px-4 py-2.5 text-sm focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all"
                />
              </label>
              <label className="block text-sm">
                <span className="font-medium text-slate-700">Purpose / files needed</span>
                <textarea
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  required
                  rows={3}
                  placeholder="e.g. CFA copy for case CF-2026-0891"
                  className="mt-1 w-full rounded-xl border-2 border-slate-200 px-4 py-2.5 text-sm focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all"
                />
              </label>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary mt-2 justify-center disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</>
                ) : (
                  <><FileSignature className="w-4 h-4" /> Request PDF Records</>
                )}
              </button>
            </form>

            {done && (
              <p className="mt-4 flex items-start gap-2 text-sm text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-left">
                <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" /> {done}
              </p>
            )}
            {error && (
              <p className="mt-4 flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-left">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" /> {error}
              </p>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
