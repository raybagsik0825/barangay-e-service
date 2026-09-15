"use client";

import { FileSignature } from "lucide-react";
import { useState } from "react";
import Reveal from "./Reveal";

export default function PnpPortal() {
  const [loading, setLoading] = useState(false);

  const handleRequest = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert("Redirecting to secure PNP Portal authentication...");
    }, 800);
  };

  return (
    <section id="pnp-portal" className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="section-title">
            <span className="inline-block bg-primary-50 text-primary-600 px-4 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
              Law Enforcement
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
            <button
              onClick={handleRequest}
              disabled={loading}
              className="btn-primary mt-6 justify-center disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <FileSignature className="w-4 h-4" />
              {loading ? "Redirecting..." : "Request PDF Records"}
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
