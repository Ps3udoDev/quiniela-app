import { cn } from "@/lib/utils";

export function UserAvatar({
  name,
  hue = 130,
  className,
}: {
  name: string;
  hue?: number;
  className?: string;
}) {
  const initials =
    name.replace(/[^a-zA-Z0-9]/g, "").slice(0, 2).toUpperCase() || "??";
  return (
    <span
      className={cn(
        "grid size-9 shrink-0 place-items-center rounded-full font-display text-xs text-black/80",
        className
      )}
      style={{ background: `oklch(0.82 0.15 ${hue})` }}
    >
      {initials}
    </span>
  );
}
