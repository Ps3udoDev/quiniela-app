"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { animate, stagger } from "animejs";
import { motion } from "motion/react";
import { ArrowRight, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FieldBackdrop } from "@/components/atoms/field-backdrop";
import type { ReactNode } from "react";

function Word({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block overflow-hidden align-bottom">
      <span
        data-word
        className="inline-block will-change-transform"
        style={{ transform: "translateY(110%)", opacity: 0 }}
      >
        {children}
      </span>
    </span>
  );
}

export function Hero() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const words = el.querySelectorAll<HTMLElement>("[data-word]");
    animate(words, {
      translateY: ["110%", "0%"],
      opacity: [0, 1],
      duration: 1000,
      delay: stagger(70, { start: 200 }),
      ease: "out(4)",
    });
  }, []);

  return (
    <section className="relative overflow-hidden">
      <FieldBackdrop />
      <div
        ref={rootRef}
        className="relative mx-auto w-full max-w-6xl px-5 pb-20 pt-20 md:pb-28 md:pt-28"
      >
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full border border-turf/30 bg-turf/10 px-3 py-1 text-xs font-medium text-turf"
        >
          <Sparkles className="size-3.5" />
          Mundial 2026 · Fase eliminatoria
        </motion.span>

        <h1 className="mt-6 font-display text-[clamp(2.75rem,9vw,6.5rem)] uppercase leading-[0.92] tracking-tight">
          <span className="block">
            <Word>Pronostica</Word>
          </span>
          <span className="block text-turf">
            <Word>cada</Word> <Word>cruce</Word>
          </span>
          <span className="block">
            <Word>del</Word> <Word>Mundial</Word>
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.7 }}
          className="mt-7 max-w-xl text-pretty text-base text-muted-foreground md:text-lg"
        >
          Apunta el marcador de octavos a la final. Marcador exacto suma{" "}
          <span className="font-semibold text-foreground">3 puntos</span>, acertar
          al ganador suma <span className="font-semibold text-foreground">1</span>.
          Escala el leaderboard y gánale a tu oficina.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.7 }}
          className="mt-9 flex flex-wrap items-center gap-3"
        >
          <Link
            href="/register"
            className={cn(buttonVariants({ size: "lg" }), "group")}
          >
            Crear cuenta
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/bracket"
            className={buttonVariants({ size: "lg", variant: "secondary" })}
          >
            Ver el bracket
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
