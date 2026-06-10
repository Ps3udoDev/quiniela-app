import { cn } from "@/lib/utils";
import type { Team } from "@/lib/mock-data";

export function TeamBadge({
  team,
  align = "left",
  compact = false,
  className,
}: {
  team: Team | null;
  align?: "left" | "right";
  compact?: boolean;
  className?: string;
}) {
  const reverse = align === "right";

  if (!team) {
    return (
      <div
        className={cn(
          "flex items-center gap-2.5 text-muted-foreground",
          reverse && "flex-row-reverse text-right",
          className
        )}
      >
        <span className="grid size-7 shrink-0 place-items-center rounded-md border border-dashed border-border text-xs">
          ?
        </span>
        {!compact && <span className="text-sm font-medium">Por definir</span>}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center gap-2.5",
        reverse && "flex-row-reverse text-right",
        className
      )}
    >
      <span className="text-lg leading-none">{team.flag}</span>
      <span className="text-sm font-semibold tracking-tight">
        {compact ? team.code : team.name}
      </span>
    </div>
  );
}
