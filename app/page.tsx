import Link from "next/link";
import { Target, Calculator, Radio, Trophy, ArrowRight } from "lucide-react";
import { PageShell } from "@/components/templates/page-shell";
import { Hero } from "@/components/organisms/hero";
import { Bracket } from "@/components/organisms/bracket";
import { LeaderboardTable } from "@/components/organisms/leaderboard-table";
import { StatCard } from "@/components/molecules/stat-card";
import { FeatureCard } from "@/components/molecules/feature-card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Reveal,
  StaggerGroup,
  StaggerItem,
} from "@/components/motion/motion-primitives";
import { STATS } from "@/lib/mock-data";

export default function HomePage() {
  return (
    <PageShell>
      <Hero />

      {/* Stats */}
      <section className="mx-auto w-full max-w-6xl px-5 py-12">
        <StaggerGroup className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StaggerItem>
            <StatCard value={STATS.participants} label="Participantes" />
          </StaggerItem>
          <StaggerItem>
            <StatCard value={STATS.matches} label="Partidos en juego" />
          </StaggerItem>
          <StaggerItem>
            <StatCard value={STATS.predictions} label="Pronósticos enviados" />
          </StaggerItem>
        </StaggerGroup>
      </section>

      {/* Features */}
      <section className="mx-auto w-full max-w-6xl px-5 py-12 md:py-20">
        <Reveal>
          <p className="text-sm text-turf">Cómo funciona</p>
          <h2 className="mt-2 max-w-2xl font-display text-3xl uppercase tracking-tight md:text-4xl">
            Acierta el marcador, suma puntos, gana la quiniela
          </h2>
        </Reveal>
        <StaggerGroup className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StaggerItem className="h-full">
            <FeatureCard icon={Target} title="Pronostica" index={1}>
              Apunta el marcador de cada cruce antes del pitazo inicial. Después
              del inicio, queda cerrado.
            </FeatureCard>
          </StaggerItem>
          <StaggerItem className="h-full">
            <FeatureCard icon={Calculator} title="Puntúa" index={2}>
              Marcador exacto vale 3 puntos. Acertar solo al ganador o empate
              vale 1. Fallar, 0.
            </FeatureCard>
          </StaggerItem>
          <StaggerItem className="h-full">
            <FeatureCard icon={Radio} title="Sigue en vivo" index={3}>
              Los resultados se cargan y los puntos se recalculan al instante en
              cuanto un partido finaliza.
            </FeatureCard>
          </StaggerItem>
          <StaggerItem className="h-full">
            <FeatureCard icon={Trophy} title="Escala la tabla" index={4}>
              Compite por el primer puesto del leaderboard y presume el título de
              la oficina.
            </FeatureCard>
          </StaggerItem>
        </StaggerGroup>
      </section>

      {/* Bracket */}
      <section className="border-y border-border/70 bg-card/20 py-16 md:py-24">
        <div className="mx-auto mb-10 w-full max-w-6xl px-5">
          <Reveal>
            <p className="text-sm text-turf">Camino al título</p>
            <h2 className="mt-2 font-display text-3xl uppercase tracking-tight md:text-4xl">
              El bracket, carril por carril
            </h2>
            <p className="mt-2 max-w-xl text-muted-foreground">
              De octavos a la final. Elige una ronda y acércate con una
              transición fluida.
            </p>
          </Reveal>
        </div>
        <Bracket />
      </section>

      {/* Leaderboard */}
      <section className="mx-auto w-full max-w-6xl px-5 py-16 md:py-24">
        <Reveal>
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm text-turf">En cabeza</p>
              <h2 className="mt-2 font-display text-3xl uppercase tracking-tight md:text-4xl">
                Leaderboard
              </h2>
            </div>
            <Link
              href="/leaderboard"
              className={buttonVariants({ variant: "ghost", size: "sm" })}
            >
              Ver completo <ArrowRight className="size-4" />
            </Link>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <LeaderboardTable limit={5} />
        </Reveal>
      </section>

      {/* CTA */}
      <section className="mx-auto w-full max-w-6xl px-5 pb-24">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-turf/30 bg-turf/[0.07] p-10 text-center md:p-16">
            <h2 className="mx-auto max-w-2xl font-display text-3xl uppercase tracking-tight md:text-5xl">
              ¿Listo para armar tu quiniela?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-muted-foreground">
              Crea tu cuenta gratis y empieza a pronosticar en menos de un
              minuto.
            </p>
            <Link
              href="/register"
              className={cn(buttonVariants({ size: "lg" }), "mt-7")}
            >
              Crear cuenta <ArrowRight className="size-4" />
            </Link>
          </div>
        </Reveal>
      </section>
    </PageShell>
  );
}
