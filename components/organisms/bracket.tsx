"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { motion } from "motion/react";
import { MoveHorizontal } from "lucide-react";
import {
  ROUNDS,
  matchesByRound,
  type RoundId,
} from "@/lib/mock-data";
import { RoundPill } from "@/components/atoms/round-pill";
import { BracketMatchCard } from "@/components/molecules/bracket-match-card";
import { cn } from "@/lib/utils";

const EMPTY_LANES: Record<RoundId, HTMLDivElement | null> = {
  r16: null,
  qf: null,
  sf: null,
  final: null,
};

export function Bracket({ className }: { className?: string }) {
  const [active, setActive] = useState<RoundId>("r16");
  const viewportRef = useRef<HTMLDivElement>(null);
  const laneRefs = useRef<Record<RoundId, HTMLDivElement | null>>({
    ...EMPTY_LANES,
  });
  const [x, setX] = useState(0);

  // Centra horizontalmente el carril activo dentro del viewport.
  const recompute = useCallback(() => {
    const vp = viewportRef.current;
    const lane = laneRefs.current[active];
    if (!vp || !lane) return;
    const center = lane.offsetLeft + lane.offsetWidth / 2;
    setX(vp.clientWidth / 2 - center);
  }, [active]);

  useLayoutEffect(() => {
    recompute();
  }, [recompute]);

  useEffect(() => {
    window.addEventListener("resize", recompute);
    return () => window.removeEventListener("resize", recompute);
  }, [recompute]);

  const activeIndex = ROUNDS.findIndex((r) => r.id === active);

  return (
    <div className={cn("w-full", className)}>
      {/* Controles de ronda */}
      <div className="mb-10 flex justify-center">
        <div className="flex gap-1 rounded-full border border-border bg-card/60 p-1 backdrop-blur-sm">
          {ROUNDS.map((r) => (
            <RoundPill
              key={r.id}
              label={r.short}
              sub={String(r.count)}
              active={active === r.id}
              onClick={() => setActive(r.id)}
            />
          ))}
        </div>
      </div>

      {/* Viewport con carriles */}
      <div
        ref={viewportRef}
        className="relative overflow-hidden"
        style={{ perspective: 1400 }}
      >
        <motion.div
          className="flex items-center gap-6"
          style={{ paddingInline: "12vw" }}
          animate={{ x }}
          transition={{ type: "spring", stiffness: 85, damping: 18, mass: 0.9 }}
        >
          {ROUNDS.map((round, i) => {
            const isActive = round.id === active;
            const dist = Math.abs(i - activeIndex);
            const matches = matchesByRound(round.id);
            return (
              <motion.div
                key={round.id}
                ref={(el) => {
                  laneRefs.current[round.id] = el;
                }}
                onClick={() => !isActive && setActive(round.id)}
                animate={{
                  scale: isActive ? 1 : Math.max(0.78, 0.9 - dist * 0.04),
                  opacity: isActive ? 1 : Math.max(0.28, 0.55 - dist * 0.1),
                }}
                transition={{ type: "spring", stiffness: 120, damping: 20 }}
                className={cn(
                  "w-[296px] shrink-0 origin-center",
                  !isActive && "cursor-pointer"
                )}
                style={{ filter: isActive ? "none" : "saturate(0.65)" }}
              >
                <div className="mb-4 flex items-baseline justify-between px-1">
                  <h3 className="font-display text-xl uppercase tracking-wide">
                    {round.label}
                  </h3>
                  <span className="text-xs text-muted-foreground tabular">
                    {matches.length}
                    {matches.length === 1 ? " partido" : " partidos"}
                  </span>
                </div>
                <div className="flex flex-col justify-center gap-3">
                  {matches.map((m) => (
                    <BracketMatchCard key={m.id} match={m} />
                  ))}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Difuminado en los bordes para el efecto de profundidad */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />
      </div>

      <p className="mt-8 flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <MoveHorizontal className="size-3.5" />
        Toca una ronda o un carril para acercarte
      </p>
    </div>
  );
}
