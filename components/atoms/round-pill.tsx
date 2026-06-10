"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export function RoundPill({
  label,
  sub,
  active,
  onClick,
}: {
  label: string;
  sub?: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative shrink-0 rounded-full px-4 py-2 transition-colors",
        active
          ? "text-turf-foreground"
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      {active && (
        <motion.span
          layoutId="round-pill"
          className="absolute inset-0 rounded-full bg-turf"
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
        />
      )}
      <span className="relative z-10 flex items-center gap-2">
        <span className="font-display text-sm uppercase tracking-wide">
          {label}
        </span>
        {sub && (
          <span
            className={cn(
              "text-[10px] tabular",
              active ? "text-turf-foreground/70" : "text-muted-foreground/70"
            )}
          >
            {sub}
          </span>
        )}
      </span>
    </button>
  );
}
