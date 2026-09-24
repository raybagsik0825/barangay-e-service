"use client";

import { useEffect, useState, useCallback } from "react";
import { Loader2, CheckCircle2, XCircle, Trash2 } from "lucide-react";
import { api } from "@/lib/api-client";

interface DocRequest {
  _id: string;
  request_code: string;
  requesting_office: string;
  purpose: string;
  status: string;
  requested_at?: string;
}

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  approved: "bg-blue-50 text-blue-700 border-blue-200",
  rejected: "bg-red-50 text-red-600 border-red-200",
  fulfilled: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

export default function RequestQueue({ barangay, refreshKey = 0 }: { barangay: string; refreshKey?: number }) {
  const [items, setItems] = useState<DocRequest[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.documentRequests.list(barangay, { limit: 100 });
      const list: DocRequest[] = Array.isArray(res) ? res : (res as unknown as { items: DocRequest[] }).items ?? [];
      setItems(list);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load requests");
    } finally {
      setLoading(false);
    }
  }, [barangay]);

  useEffect(() => {
    load();
  }, [load, refreshKey]);

  async function setStatus(id: string, status: string) {
    try {
      await api.documentRequests.update(barangay, id, { status });
      setItems((prev) => prev.map((r) => (r._id === id ? { ...r, status } : r)));
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "Update failed");
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this request?")) return;
    try {
      await api.documentRequests.remove(barangay, id);
      setItems((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "Delete failed");
    }
  }

  const shown = filter === "all" ? items : items.filter((r) => r.status === filter);

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm font-medium text-slate-600">Status:</span>
        {["all", "pending", "approved", "rejected", "fulfilled"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === s ? "bg-primary-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="flex items-center gap-2 text-sm text-slate-400 py-6">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading requests…
        </p>
      ) : error ? (
        <p className="text-sm text-red-600 py-4">{error}</p>
      ) : shown.length === 0 ? (
        <p className="text-sm text-slate-400 py-6">No requests.</p>
      ) : (
        <ul className="space-y-3">
          {shown.map((r) => (
            <li key={r._id} className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-bold text-slate-800">{r.request_code}</p>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-md border ${STATUS_STYLES[r.status] ?? "bg-slate-100 text-slate-600"}`}>
                  {r.status}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-600">{r.requesting_office}</p>
              <p className="text-sm text-slate-500">{r.purpose}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {r.status === "pending" && (
                  <>
                    <button onClick={() => setStatus(r._id, "approved")} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                    </button>
                    <button onClick={() => setStatus(r._id, "rejected")} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-600 hover:bg-slate-50">
                      <XCircle className="w-3.5 h-3.5" /> Reject
                    </button>
                  </>
                )}
                {r.status === "approved" && (
                  <button onClick={() => setStatus(r._id, "fulfilled")} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Mark fulfilled
                  </button>
                )}
                <button onClick={() => handleDelete(r._id)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-500 hover:bg-red-50">
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
