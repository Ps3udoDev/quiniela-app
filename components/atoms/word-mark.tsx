import { cn } from "@/lib/utils";

export function WordMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "font-display text-xl uppercase tracking-tight inline-flex items-center",
        className
      )}
    >
      Quiniela<span className="text-turf">.</span>
    </span>
  );
}
