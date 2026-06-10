import { Lock } from "lucide-react";
import { PageShell } from "@/components/templates/page-shell";
import { MatchBoard } from "@/components/organisms/match-board";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function DashboardPage() {
  return (
    <PageShell>
      <section className="mx-auto w-full max-w-6xl px-5 py-12 md:py-16">
        <p className="text-sm text-turf">Tus pronósticos</p>
        <h1 className="mt-2 font-display text-4xl uppercase tracking-tight md:text-5xl">
          Partidos
        </h1>

        <Alert className="mt-6 max-w-2xl border-turf/30 bg-turf/[0.06]">
          <Lock className="size-4" />
          <AlertTitle>Juego limpio</AlertTitle>
          <AlertDescription>
            Cada pronóstico se cierra al pitazo inicial. Después no se puede
            editar y nadie ve tu marcador hasta que empieza el partido.
          </AlertDescription>
        </Alert>

        <div className="mt-10">
          <MatchBoard />
        </div>
      </section>
    </PageShell>
  );
}
