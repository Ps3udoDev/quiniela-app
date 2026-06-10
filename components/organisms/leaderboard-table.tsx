import { LEADERBOARD } from "@/lib/mock-data";
import { UserAvatar } from "@/components/atoms/user-avatar";
import { cn } from "@/lib/utils";

export function LeaderboardTable({ limit }: { limit?: number }) {
  const rows = limit ? LEADERBOARD.slice(0, limit) : LEADERBOARD;

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="grid grid-cols-[2rem_1fr_auto] items-center gap-4 border-b border-border px-5 py-3 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
        <span>#</span>
        <span>Participante</span>
        <span>Puntos</span>
      </div>
      <ul>
        {rows.map((row) => (
          <li
            key={row.rank}
            className={cn(
              "grid grid-cols-[2rem_1fr_auto] items-center gap-4 border-b border-border/60 px-5 py-3.5 transition-colors last:border-0 hover:bg-accent/40",
              row.rank <= 3 && "bg-gradient-to-r from-turf/[0.06] to-transparent"
            )}
          >
            <span
              className={cn(
                "font-display text-lg tabular",
                row.rank === 1 ? "text-turf" : "text-muted-foreground"
              )}
            >
              {row.rank}
            </span>
            <div className="flex min-w-0 items-center gap-3">
              <UserAvatar name={row.username} hue={row.hue} />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">@{row.username}</p>
                <p className="text-xs tabular text-muted-foreground">
                  {row.exact} exactos · {row.trend} tendencia
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="font-display text-2xl tabular text-turf">
                {row.points}
              </span>
              <span className="ml-1 text-xs text-muted-foreground">pts</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
