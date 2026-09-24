"use client";

import { useEffect, useState } from "react";
import { useBarangay } from "@/lib/barangay-context";

interface PublicState<T> {
  data: T[];
  live: boolean;
  loading: boolean;
}

/**
 * Fetch a public list endpoint for the currently selected barangay.
 * Falls back to the provided static data when the API is unreachable or empty.
 */
export function usePublicList<T>(resource: string, query: string, fallback: T[]): PublicState<T> {
  const { slug } = useBarangay();
  const [data, setData] = useState<T[]>(fallback);
  const [live, setLive] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`/api/${slug}/${resource}${query}`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((json: unknown) => {
        if (cancelled) return;
        const items = (Array.isArray(json) ? json : (json as { items?: T[] }).items ?? []) as T[];
        if (items.length > 0) {
          setData(items);
          setLive(true);
        } else {
          setData(fallback);
          setLive(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setData(fallback);
          setLive(false);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, resource, query]);

  return { data, live, loading };
}
