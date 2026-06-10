import { PageShell } from "@/components/templates/page-shell";
import { Bracket } from "@/components/organisms/bracket";

export default function BracketPage() {
  return (
    <PageShell>
      <section className="mx-auto w-full max-w-6xl px-5 pt-12 md:pt-16">
        <p className="text-sm text-turf">Camino al título</p>
        <h1 className="mt-2 font-display text-4xl uppercase tracking-tight md:text-6xl">
          El bracket
        </h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          De octavos de final al campeón. Selecciona una ronda o toca un carril
          para acercarte con una transición horizontal.
        </p>
      </section>
      <section className="py-14 md:py-20">
        <Bracket />
      </section>
    </PageShell>
  );
}
