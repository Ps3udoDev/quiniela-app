import { ShieldCheck } from "lucide-react";
import { PageShell } from "@/components/templates/page-shell";
import { AdminPanel } from "@/components/organisms/admin-panel";

export default function AdminPage() {
  return (
    <PageShell>
      <section className="mx-auto w-full max-w-4xl px-5 py-12 md:py-16">
        <span className="inline-flex items-center gap-2 rounded-full border border-turf/30 bg-turf/10 px-3 py-1 text-xs font-medium text-turf">
          <ShieldCheck className="size-3.5" />
          Solo administradores
        </span>
        <h1 className="mt-4 font-display text-4xl uppercase tracking-tight md:text-5xl">
          Panel admin
        </h1>
        <p className="mt-2 max-w-xl text-muted-foreground">
          Crea partidos y carga los resultados. Al finalizar un partido, los
          puntos de todos los pronósticos se recalculan automáticamente.
        </p>

        <div className="mt-10">
          <AdminPanel />
        </div>
      </section>
    </PageShell>
  );
}
