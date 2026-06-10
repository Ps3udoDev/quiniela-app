import { cn } from "@/lib/utils";

export function ScoreBox({
  value,
  highlight,
  className,
}: {
  value: number | null;
  highlight?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "grid h-9 w-9 place-items-center rounded-md font-display text-lg tabular leading-none",
        value === null
          ? "bg-muted/40 text-muted-foreground"
          : "bg-secondary text-foreground",
        highlight && "bg-turf text-turf-foreground",
        className
      )}
    >
      {value === null ? "–" : value}
    </span>
  );
}
