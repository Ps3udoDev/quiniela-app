import { PageShell } from "@/components/templates/page-shell";
import { LeaderboardTable } from "@/components/organisms/leaderboard-table";
import { StatCard } from "@/components/molecules/stat-card";
import { Reveal } from "@/components/motion/motion-primitives";
import { STATS } from "@/lib/mock-data";

export default function LeaderboardPage() {
  return (
    <PageShell>
      <section className="mx-auto w-full max-w-4xl px-5 py-12 md:py-16">
        <p className="text-sm text-turf">Clasificación general</p>
        <h1 className="mt-2 font-display text-4xl uppercase tracking-tight md:text-5xl">
          Leaderboard
        </h1>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <StatCard value={STATS.participants} label="Participantes" />
          <StatCard value={STATS.predictions} label="Pronósticos" />
          <StatCard value={STATS.matches} label="Partidos" />
        </div>

        <Reveal delay={0.1}>
          <div className="mt-10">
            <LeaderboardTable />
          </div>
        </Reveal>
      </section>
    </PageShell>
  );
}
