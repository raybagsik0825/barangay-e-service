"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { barangays, getBarangay } from "@/lib/barangays";

const STORAGE_KEY = "brgy_selected";
export const DEFAULT_SLUG = "binuangan";

interface BarangayCtx {
  slug: string;
  name: string;
  setSlug: (slug: string) => void;
}

const Ctx = createContext<BarangayCtx>({
  slug: DEFAULT_SLUG,
  name: "Binuangan",
  setSlug: () => {},
});

export function BarangayProvider({ children }: { children: ReactNode }) {
  const [slug, setSlugState] = useState<string>(DEFAULT_SLUG);

  // Restore last choice on mount
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved && getBarangay(saved)) setSlugState(saved);
    } catch {
      /* ignore */
    }
  }, []);

  function setSlug(next: string) {
    if (!getBarangay(next)) return;
    setSlugState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }

  const found = getBarangay(slug);
  const name = found ? found.name : barangays[0].name;

  return <Ctx.Provider value={{ slug, name, setSlug }}>{children}</Ctx.Provider>;
}

export function useBarangay(): BarangayCtx {
  return useContext(Ctx);
}
