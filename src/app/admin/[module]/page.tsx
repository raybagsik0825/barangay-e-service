import { Suspense } from "react";
import Link from "next/link";
import ModuleView from "./ModuleView";

export default function ModulePage({ params }: { params: { module: string } }) {
  return (
    <Suspense
      fallback={
        <section className="max-w-7xl mx-auto px-4 py-16">
          <p className="text-sm text-slate-400">Loading…</p>
        </section>
      }
    >
      <ModuleView module={params.module} />
    </Suspense>
  );
}

export function ModuleNotFound() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16 text-center">
      <p className="text-slate-500">Unknown module.</p>
      <Link href="/admin" className="text-primary-600 hover:underline text-sm">
        Back to admin panel
      </Link>
    </section>
  );
}
