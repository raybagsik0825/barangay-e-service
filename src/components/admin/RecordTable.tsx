"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Trash2, Loader2, X } from "lucide-react";
import { api } from "@/lib/api-client";
import type { AdminModule } from "@/lib/admin-config";

interface Props {
  barangay: string;
  mod: AdminModule;
  refreshKey?: number;
}

type Row = Record<string, unknown> & { _id: string };

function cell(v: unknown): string {
  if (v === null || v === undefined) return "—";
  if (typeof v === "boolean") return v ? "Yes" : "No";
  return String(v);
}

export default function RecordTable({ barangay, mod, refreshKey = 0 }: Props) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const columns = mod.fields.filter((f) => f.column);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Generic list via the module collection endpoint
      const url = `/api/${barangay}/${mod.path}?limit=100`;
      const r = await fetch(url, {
        headers: { Authorization: `Bearer ${window.localStorage.getItem("brgy_token") ?? ""}` },
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data = await r.json();
      setRows(Array.isArray(data) ? data : data.items ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [barangay, mod.path]);

  useEffect(() => {
    load();
  }, [load, refreshKey]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: Record<string, unknown> = {};
      for (const f of mod.fields) {
        const v = (form[f.key] ?? "").trim();
        if (v !== "") payload[f.key] = v;
      }
      await api.create(barangay, mod.path, payload);
      setForm({});
      setShowForm(false);
      load();
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "Create failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this record? Attached files are kept.")) return;
    try {
      await api.remove(barangay, mod.path, id);
      setRows((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "Delete failed");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-slate-500">{rows.length} record{rows.length === 1 ? "" : "s"}</p>
        <button onClick={() => setShowForm((s) => !s)} className="btn-primary !px-4 !py-2 text-sm">
          {showForm ? <><X className="w-4 h-4" /> Cancel</> : <><Plus className="w-4 h-4" /> New {mod.label.slice(0, -1) || mod.label}</>}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="mb-5 grid grid-cols-1 md:grid-cols-2 gap-3 rounded-2xl border border-slate-200 bg-white p-5">
          {mod.fields.map((f) => (
            <label key={f.key} className={`block text-sm ${f.type === "textarea" ? "md:col-span-2" : ""}`}>
              <span className="font-medium text-slate-600">
                {f.label} {f.required && <span className="text-red-500">*</span>}
              </span>
              {f.type === "textarea" ? (
                <textarea
                  value={form[f.key] ?? ""}
                  onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                  required={f.required}
                  rows={3}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              ) : f.type === "select" ? (
                <select
                  value={form[f.key] ?? ""}
                  onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                  required={f.required}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">—</option>
                  {(f.options ?? []).map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={f.type === "number" ? "number" : f.type === "date" ? "date" : f.type === "datetime" ? "datetime-local" : "text"}
                  value={form[f.key] ?? ""}
                  onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                  required={f.required}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              )}
            </label>
          ))}
          <div className="md:col-span-2">
            <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
              {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : "Save record"}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="flex items-center gap-2 text-sm text-slate-400 py-6">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading records…
        </p>
      ) : error ? (
        <p className="text-sm text-red-600 py-4">{error}</p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-slate-400 py-6">No records yet. Create the first one above.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                {columns.map((c) => (
                  <th key={c.key} className="px-4 py-3 font-semibold">{c.label}</th>
                ))}
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((r) => (
                <tr key={r._id} className="hover:bg-slate-50/60">
                  {columns.map((c) => (
                    <td key={c.key} className="px-4 py-2.5 text-slate-700 max-w-[220px] truncate" title={cell(r[c.key])}>
                      {cell(r[c.key])}
                    </td>
                  ))}
                  <td className="px-4 py-2.5 text-right">
                    <button
                      onClick={() => handleDelete(r._id)}
                      className="p-1.5 rounded-lg text-red-500 hover:bg-red-50"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
