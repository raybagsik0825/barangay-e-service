"use client";

import { useEffect, useState, useCallback } from "react";
import { Download, Trash2, Image as ImageIcon, Film, FileText, Loader2 } from "lucide-react";
import { api } from "@/lib/api-client";
import { kindOfMime } from "@/lib/admin-config";

interface Doc {
  _id: string;
  title: string;
  file_name: string;
  mime_type: string;
  file_size: string | number;
  doc_type: string;
  entity_type?: string | null;
  entity_id?: string | null;
  uploaded_at?: string;
}

interface Props {
  barangay: string;
  /** filter by linked entity */
  entityType?: string;
  entityId?: string;
  /** filter by one or more doc_types */
  docTypes?: string[];
  /** filter by media kind tab */
  kind?: "photos" | "videos" | "files" | "all";
  refreshKey?: number;
}

function formatSize(v: string | number): string {
  const n = typeof v === "string" ? Number(v) : v;
  if (!n || Number.isNaN(n)) return "";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

const kindIcon = { photos: ImageIcon, videos: Film, files: FileText };

export default function FileList({ barangay, entityType, entityId, docTypes, kind = "all", refreshKey = 0 }: Props) {
  const [items, setItems] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.documents.list(barangay, {
        entity_type: entityType,
        entity_id: entityId,
      });
      let list: Doc[] = Array.isArray(res) ? res : (res as unknown as { items: Doc[] }).items ?? [];
      if (docTypes && docTypes.length > 0) {
        list = list.filter((d) => docTypes.includes(d.doc_type));
      }
      if (kind !== "all") {
        list = list.filter((d) => kindOfMime(d.mime_type || "") === kind);
      }
      setItems(list);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load files");
    } finally {
      setLoading(false);
    }
  }, [barangay, entityType, entityId, docTypes, kind]);

  useEffect(() => {
    load();
  }, [load, refreshKey]);

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this file permanently?")) return;
    try {
      await api.documents.remove(barangay, id);
      setItems((prev) => prev.filter((d) => d._id !== id));
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "Delete failed");
    }
  }

  if (loading) {
    return (
      <p className="flex items-center gap-2 text-sm text-slate-400 py-6">
        <Loader2 className="w-4 h-4 animate-spin" /> Loading files…
      </p>
    );
  }
  if (error) return <p className="text-sm text-red-600 py-4">{error}</p>;
  if (items.length === 0) return <p className="text-sm text-slate-400 py-6">No files yet.</p>;

  return (
    <ul className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white overflow-hidden">
      {items.map((d) => {
        const KIcon = kindIcon[kindOfMime(d.mime_type || "")];
        const isImage = (d.mime_type || "").startsWith("image/");
        return (
          <li key={d._id} className="flex items-center gap-3 px-4 py-3">
            {isImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={api.documents.download(barangay, d._id)}
                alt={d.title}
                className="w-12 h-12 rounded-lg object-cover bg-slate-100 shrink-0"
              />
            ) : (
              <span className="w-12 h-12 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                <KIcon className="w-5 h-5" />
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-800 truncate">{d.title}</p>
              <p className="text-xs text-slate-400 truncate">
                {d.doc_type} · {d.file_name} · {formatSize(d.file_size)}
              </p>
            </div>
            <a
              href={api.documents.download(barangay, d._id)}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-lg text-primary-600 hover:bg-primary-50"
              title="Download / view"
            >
              <Download className="w-4 h-4" />
            </a>
            <button
              onClick={() => handleDelete(d._id)}
              className="p-2 rounded-lg text-red-500 hover:bg-red-50"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </li>
        );
      })}
    </ul>
  );
}
