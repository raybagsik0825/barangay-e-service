"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getToken, DEFAULT_BARANGAY } from "@/lib/api-client";
import { getBarangay } from "@/lib/barangays";
import { getAdminModule, CFA_DOC_TYPES, POLICE_DOC_TYPES } from "@/lib/admin-config";
import BarangayPicker from "@/components/admin/BarangayPicker";
import RecordTable from "@/components/admin/RecordTable";
import MediaUploader from "@/components/admin/MediaUploader";
import FileList from "@/components/admin/FileList";
import RequestQueue from "@/components/admin/RequestQueue";

const SPECIAL: Record<string, { label: string }> = {
  cfa: { label: "CFA Files" },
  police: { label: "Police Files" },
  documents: { label: "Documents" },
};

export default function ModuleView({ module }: { module: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState("records");
  const [refreshKey, setRefreshKey] = useState(0);

  const qp = searchParams.get("barangay");
  const barangay = qp && getBarangay(qp) ? qp : DEFAULT_BARANGAY;

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }
    setReady(true);
  }, [router]);

  if (!ready) return null;

  const mod = getAdminModule(module);
  const special = SPECIAL[module];
  if (!mod && !special) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-slate-500">Unknown module “{module}”.</p>
        <Link href="/admin" className="text-primary-600 hover:underline text-sm">
          Back to admin panel
        </Link>
      </section>
    );
  }

  const title = mod ? mod.label : special.label;

  function switchBarangay(next: string) {
    router.replace(`/admin/${module}?barangay=${next}`);
  }

  const tabs: { key: string; label: string }[] = (() => {
    if (module === "cfa") return [
      { key: "upload", label: "Upload CFA" },
      { key: "files", label: "CFA Files" },
      { key: "requests", label: "PNP Requests" },
    ];
    if (module === "police") return [
      { key: "files", label: "Police Files" },
      { key: "upload", label: "Upload" },
      { key: "requests", label: "PNP Requests" },
    ];
    if (module === "documents") return [
      { key: "upload", label: "Upload" },
      { key: "all", label: "All Files" },
      { key: "photos", label: "Pictures" },
      { key: "videos", label: "Videos" },
      { key: "files", label: "Other Media" },
    ];
    if (module === "hearings") return [
      { key: "records", label: "Schedule" },
      { key: "media", label: "Media Files" },
      { key: "minutes", label: "Minutes & Subpoenas" },
    ];
    return [
      { key: "records", label: "Records" },
      { key: "media", label: "Media Files" },
    ];
  })();

  const activeTab = tabs.some((t) => t.key === tab) ? tab : tabs[0].key;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary-600">
        <ArrowLeft className="w-4 h-4" /> Admin panel
      </Link>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold text-primary-900">{title}</h1>
        <BarangayPicker value={barangay} onChange={switchBarangay} />
      </div>

      <div className="mt-6 flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === t.key
                ? "bg-primary-600 text-white shadow-md shadow-primary-600/20"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {/* Generic record modules */}
        {mod && activeTab === "records" && (
          <RecordTable barangay={barangay} mod={mod} refreshKey={refreshKey} />
        )}
        {mod && activeTab === "media" && (
          <div className="flex flex-col gap-5">
            <MediaUploader
              barangay={barangay}
              entityType={mod.entityType}
              defaultDocType="photo"
              onUploaded={() => setRefreshKey((k) => k + 1)}
            />
            <FileList barangay={barangay} entityType={mod.entityType} refreshKey={refreshKey} />
          </div>
        )}
        {mod && module === "hearings" && activeTab === "minutes" && (
          <div className="flex flex-col gap-5">
            <MediaUploader
              barangay={barangay}
              entityType="hearing"
              defaultDocType="hearing_log"
              onUploaded={() => setRefreshKey((k) => k + 1)}
            />
            <FileList
              barangay={barangay}
              entityType="hearing"
              docTypes={["hearing_log", "subpoena", "settlement"]}
              refreshKey={refreshKey}
            />
          </div>
        )}

        {/* Documents library */}
        {module === "documents" && activeTab === "upload" && (
          <MediaUploader barangay={barangay} defaultDocType="misc" onUploaded={() => setRefreshKey((k) => k + 1)} />
        )}
        {module === "documents" && activeTab !== "upload" && (
          <FileList
            barangay={barangay}
            kind={activeTab as "all" | "photos" | "videos" | "files"}
            refreshKey={refreshKey}
          />
        )}

        {/* CFA section */}
        {module === "cfa" && activeTab === "upload" && (
          <MediaUploader barangay={barangay} defaultDocType="cfa" onUploaded={() => setRefreshKey((k) => k + 1)} />
        )}
        {module === "cfa" && activeTab === "files" && (
          <FileList barangay={barangay} docTypes={CFA_DOC_TYPES} refreshKey={refreshKey} />
        )}
        {module === "cfa" && activeTab === "requests" && (
          <RequestQueue barangay={barangay} />
        )}

        {/* Police files section */}
        {module === "police" && activeTab === "upload" && (
          <MediaUploader barangay={barangay} defaultDocType="subpoena" onUploaded={() => setRefreshKey((k) => k + 1)} />
        )}
        {module === "police" && activeTab === "files" && (
          <FileList barangay={barangay} docTypes={POLICE_DOC_TYPES} refreshKey={refreshKey} />
        )}
        {module === "police" && activeTab === "requests" && (
          <RequestQueue barangay={barangay} />
        )}
      </div>
    </section>
  );
}
