import { Suspense } from "react";
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
