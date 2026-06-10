import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function FeatureCard({
  icon: Icon,
  title,
  index,
  children,
}: {
  icon: LucideIcon;
  title: string;
  index?: number;
  children: ReactNode;
}) {
  return (
    <div className="group relative h-full overflow-hidden rounded-2xl border border-border bg-card p-6 transition-colors duration-300 hover:border-turf/40">
      <div className="mb-5 flex items-center justify-between">
        <span className="grid size-10 place-items-center rounded-xl bg-turf/10 text-turf transition-transform duration-300 group-hover:scale-110">
          <Icon className="size-5" />
        </span>
        {index !== undefined && (
          <span className="font-display text-xs text-muted-foreground/60 tabular">
            {String(index).padStart(2, "0")}
          </span>
        )}
      </div>
      <h3 className="font-display text-lg uppercase tracking-tight">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {children}
      </p>
    </div>
  );
}
