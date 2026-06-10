"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Minus, Plus, Lock, Check } from "lucide-react";
import type { Match } from "@/lib/mock-data";
import { TeamBadge } from "@/components/atoms/team-badge";
import { StatusBadge } from "@/components/atoms/status-badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function Stepper({
  value,
  onChange,
  disabled,
}: {
  value: number;
  onChange: (n: number) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange(Math.min(value + 1, 20))}
        className="grid size-7 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:opacity-30"
        aria-label="Sumar gol"
      >
        <Plus className="size-4" />
      </button>
      <span className="grid h-11 w-12 place-items-center rounded-lg border border-border bg-background font-display text-2xl tabular">
        {value}
      </span>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange(Math.max(value - 1, 0))}
        className="grid size-7 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:opacity-30"
        aria-label="Restar gol"
      >
        <Minus className="size-4" />
      </button>
    </div>
  );
}

export function PredictionCard({ match }: { match: Match }) {
  const locked = match.status !== "pending" || !match.home || !match.away;
  const [home, setHome] = useState(0);
  const [away, setAway] = useState(0);
  const [saved, setSaved] = useState(false);

  function save() {
    setSaved(true);
    toast.success("Pronóstico guardado", {
      description: `${match.home?.code} ${home} – ${away} ${match.away?.code}`,
    });
  }

  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-5 transition-colors",
        !locked && "hover:border-turf/30",
        saved && "border-turf/40"
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{match.kickoff}</span>
        <StatusBadge status={match.status} />
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <TeamBadge team={match.home} className="min-w-0" />
        <div className="flex items-center gap-2">
          <Stepper value={home} onChange={setHome} disabled={locked} />
          <span className="font-display text-muted-foreground">:</span>
          <Stepper value={away} onChange={setAway} disabled={locked} />
        </div>
        <TeamBadge team={match.away} align="right" className="min-w-0" />
      </div>

      <div className="mt-4">
        {locked ? (
          <div className="flex items-center justify-center gap-2 rounded-lg bg-muted/40 py-2 text-xs text-muted-foreground">
            <Lock className="size-3.5" />
            Pronóstico cerrado
          </div>
        ) : (
          <Button
            onClick={save}
            className="w-full"
            variant={saved ? "secondary" : "default"}
          >
            {saved ? (
              <>
                <Check className="size-4" /> Guardado — editar
              </>
            ) : (
              "Guardar pronóstico"
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
