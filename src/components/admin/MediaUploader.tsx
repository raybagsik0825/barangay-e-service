"use client";

import { useState } from "react";
import { Upload, Loader2, CheckCircle2, AlertCircle, Image as ImageIcon, Film, FileText } from "lucide-react";
import { api } from "@/lib/api-client";
import { MEDIA_KINDS, DOC_TYPE_OPTIONS, type MediaKind } from "@/lib/admin-config";

interface Props {
  barangay: string;
  /** entity the files attach to (e.g. "case", "hearing"); null = general */
  entityType?: string | null;
  entityId?: string | null;
  defaultDocType?: string;
  onUploaded?: () => void;
}

const kindIcon: Record<MediaKind, typeof ImageIcon> = {
  photos: ImageIcon,
  videos: Film,
  files: FileText,
};

export default function MediaUploader({ barangay, entityType = null, entityId = null, defaultDocType = "photo", onUploaded }: Props) {
  const [kind, setKind] = useState<MediaKind>("photos");
  const [docType, setDocType] = useState(defaultDocType);
  const [title, setTitle] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const active = MEDIA_KINDS.find((k) => k.key === kind)!;
  const Icon = kindIcon[kind];

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setBusy(true);
    setDone(null);
    setError(null);
    try {
      const arr = Array.from(files);
      for (let i = 0; i < arr.length; i++) {
        const f = arr[i];
        const stored = await api.documents.upload(barangay, f, {});
        await api.documents.register(barangay, {
          file_id: stored.file_id,
          file_name: stored.file_name,
          mime_type: stored.mime_type,
          file_size: stored.file_size,
          title: title.trim() || f.name,
          doc_type: docType,
          entity_type: entityType,
          entity_id: entityId,
          is_public: false,
        });
      }
      setDone(`${arr.length} file${arr.length > 1 ? "s" : ""} uploaded to ${barangay}`);
      setTitle("");
      onUploaded?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      {/* Kind tabs: Pictures / Videos / Other media */}
      <div className="flex flex-wrap gap-2">
        {MEDIA_KINDS.map((k) => {
          const KIcon = kindIcon[k.key];
          return (
            <button
              key={k.key}
              type="button"
              onClick={() => setKind(k.key)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                kind === k.key
                  ? "bg-primary-600 text-white shadow-md shadow-primary-600/20"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <KIcon className="w-4 h-4" /> {k.label}
            </button>
          );
        })}
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        <label className="block text-sm">
          <span className="font-medium text-slate-600">Document type</span>
          <select
            value={docType}
            onChange={(e) => setDocType(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {DOC_TYPE_OPTIONS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="font-medium text-slate-600">Title (optional)</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. CFA-2026-001 scan"
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </label>
      </div>

      <label
        className={`mt-4 flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-6 py-10 text-center cursor-pointer transition-colors ${
          busy ? "border-slate-200 bg-slate-50" : "border-primary-200 bg-primary-50/50 hover:border-primary-400 hover:bg-primary-50"
        }`}
      >
        {busy ? (
          <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
        ) : (
          <Icon className="w-8 h-8 text-primary-500" />
        )}
        <span className="text-sm font-semibold text-slate-700">
          {busy ? "Uploading…" : `Drop ${active.label.toLowerCase()} here or click to browse`}
        </span>
        <span className="text-xs text-slate-400">{active.hint}</span>
        <input
          type="file"
          accept={active.accept}
          multiple
          disabled={busy}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
      </label>

      <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
        <Upload className="w-3.5 h-3.5" />
        Stored in cloud (GridFS) under <code className="bg-slate-100 px-1 rounded">brgy_{barangay.replace(/-/g, "_")}</code>
        {entityType ? <> · linked to {entityType}{entityId ? ` ${entityId}` : ""}</> : " · general files"}
      </p>

      {done && (
        <p className="mt-3 flex items-center gap-1.5 text-sm text-emerald-600">
          <CheckCircle2 className="w-4 h-4" /> {done}
        </p>
      )}
      {error && (
        <p className="mt-3 flex items-center gap-1.5 text-sm text-red-600">
          <AlertCircle className="w-4 h-4" /> {error}
        </p>
      )}
    </div>
  );
}
