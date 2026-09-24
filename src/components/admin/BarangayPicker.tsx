"use client";

import { barangays } from "@/lib/barangays";

interface Props {
  value: string;
  onChange: (slug: string) => void;
}

export default function BarangayPicker({ value, onChange }: Props) {
  return (
    <label className="inline-flex items-center gap-2 text-sm">
      <span className="font-medium text-slate-600">Barangay:</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        {barangays.map((b) => (
          <option key={b.slug} value={b.slug}>
            {b.name}
          </option>
        ))}
      </select>
    </label>
  );
}
