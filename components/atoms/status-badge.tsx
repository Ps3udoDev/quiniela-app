import { cn } from "@/lib/utils";
import type { MatchStatus } from "@/lib/mock-data";

const MAP: Record<MatchStatus, { label: string; dot: string; cls: string }> = {
  pending: {
    label: "Por jugar",
    dot: "bg-muted-foreground",
    cls: "text-muted-foreground border-border",
  },
  live: {
    label: "En vivo",
    dot: "bg-turf animate-pulse",
    cls: "text-turf border-turf/30",
  },
  finished: {
    label: "Final",
    dot: "bg-foreground/50",
    cls: "text-foreground/70 border-border",
  },
};

export function StatusBadge({
  status,
  className,
}: {
  status: MatchStatus;
  className?: string;
}) {
  const s = MAP[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em]",
        s.cls,
        className
      )}
    >
      <span className={cn("size-1.5 rounded-full", s.dot)} />
      {s.label}
    </span>
  );
}
