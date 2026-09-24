"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Bell,
  Users,
  Scale,
  ShieldAlert,
  Package,
  FileText,
  LogOut,
  Building2,
  Stamp,
  Siren,
} from "lucide-react";
import { getToken, getStoredUser, clearSession, DEFAULT_BARANGAY } from "@/lib/api-client";
import { getBarangay } from "@/lib/barangays";
import BarangayPicker from "@/components/admin/BarangayPicker";

const modules = [
  { label: "Announcements", path: "announcements", icon: Bell },
  { label: "Residents", path: "residents", icon: Users },
  { label: "Cases", path: "cases", icon: Scale },
  { label: "Hearings", path: "hearings", icon: Scale },
  { label: "Crime Reports", path: "crime-reports", icon: ShieldAlert },
  { label: "Wanted Persons", path: "wanted-persons", icon: ShieldAlert },
  { label: "Lost & Found", path: "lost-found", icon: Package },
  { label: "Documents", path: "documents", icon: FileText },
  { label: "CFA Files", path: "cfa", icon: Stamp },
  { label: "Police Files", path: "police", icon: Siren },
];

const PICK_KEY = "brgy_admin_pick";

export default function AdminPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<ReturnType<typeof getStoredUser>>(null);
  const [barangay, setBarangay] = useState(DEFAULT_BARANGAY);

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }
    setUser(getStoredUser());
    try {
      const saved = window.localStorage.getItem(PICK_KEY);
      if (saved && getBarangay(saved)) setBarangay(saved);
    } catch {
      /* ignore */
    }
    setReady(true);
  }, [router]);

  if (!ready) return null;

  function handleLogout() {
    clearSession();
    router.replace("/login");
  }

  function pickBarangay(next: string) {
    setBarangay(next);
    try {
      window.localStorage.setItem(PICK_KEY, next);
    } catch {
      /* ignore */
    }
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-800 to-primary-600 flex items-center justify-center text-white shadow-md shadow-primary-900/20">
            <Building2 className="w-6 h-6" />
          </span>
          <div>
            <h1 className="text-2xl font-extrabold text-primary-900">Admin Panel</h1>
            <p className="text-sm text-slate-500">
              {user ? `Signed in as ${user.fullName} (${user.role})` : "Barangay E-Services"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <BarangayPicker value={barangay} onChange={pickBarangay} />
          <button onClick={handleLogout} className="btn-outline">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </div>

      <p className="mt-4 text-sm text-slate-500">
        Managing records for barangay:{" "}
        <span className="font-semibold text-slate-700">
          {getBarangay(barangay)?.name ?? barangay}
        </span>
        . All actions go through the authenticated API (
        <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded">/api/:barangay/…</code>).
      </p>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {modules.map((m) => (
          <Link
            key={m.path + m.label}
            href={`/admin/${m.path}?barangay=${barangay}`}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 p-6 flex items-center gap-4"
          >
            <span className="w-11 h-11 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
              <m.icon className="w-5 h-5" />
            </span>
            <span className="font-semibold text-slate-800">{m.label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
