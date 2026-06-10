import type { Match } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

function TeamRow({
  flag,
  label,
  score,
  winner,
  defined,
}: {
  flag: string;
  label: string;
  score: number | null;
  winner: boolean;
  defined: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 px-3.5 py-2.5",
        winner ? "text-foreground" : "text-muted-foreground",
        !defined && "text-muted-foreground/50"
      )}
    >
      <span className="flex min-w-0 items-center gap-2.5">
        <span className="text-base leading-none">{flag}</span>
        <span
          className={cn(
            "truncate text-sm",
            winner ? "font-semibold" : "font-medium"
          )}
        >
          {label}
        </span>
      </span>
      <span
        className={cn(
          "grid size-6 shrink-0 place-items-center rounded font-display text-sm tabular",
          score === null
            ? "text-muted-foreground/50"
            : winner
              ? "bg-turf text-turf-foreground"
              : "bg-secondary text-foreground"
        )}
      >
        {score === null ? "–" : score}
      </span>
    </div>
  );
}

export function BracketMatchCard({ match }: { match: Match }) {
  const decided =
    match.status === "finished" &&
    match.homeScore !== null &&
    match.awayScore !== null;
  const homeWins = decided && (match.homeScore ?? 0) > (match.awayScore ?? 0);
  const awayWins = decided && (match.awayScore ?? 0) > (match.homeScore ?? 0);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border bg-card/80 backdrop-blur-sm",
        match.status === "live" ? "border-turf/40" : "border-border"
      )}
    >
      <TeamRow
        flag={match.home?.flag ?? "🏳️"}
        label={match.home?.name ?? "Por definir"}
        score={match.homeScore}
        winner={homeWins}
        defined={!!match.home}
      />
      <div className="h-px bg-border" />
      <TeamRow
        flag={match.away?.flag ?? "🏳️"}
        label={match.away?.name ?? "Por definir"}
        score={match.awayScore}
        winner={awayWins}
        defined={!!match.away}
      />
      <div className="flex items-center justify-between border-t border-border bg-background/40 px-3.5 py-1.5">
        <span className="text-[10px] text-muted-foreground">{match.kickoff}</span>
        {match.status === "live" && (
          <span className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-turf">
            <span className="size-1.5 animate-pulse rounded-full bg-turf" />
            En vivo
          </span>
        )}
      </div>
    </div>
  );
}
