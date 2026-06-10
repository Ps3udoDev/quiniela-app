# Prompt exacto — efecto de árbol/bracket con acercamiento horizontal

Copia y pega este prompt (ajusta nombres si tu stack difiere). Está pensado para
**Next + React + Tailwind + Motion (`motion/react`)**, pero el algoritmo del
efecto sirve en cualquier React.

---

## Prompt (cópialo tal cual)

> Crea un componente cliente `Bracket` en React + TypeScript que muestre un
> cuadro de eliminatorias **en carriles horizontales** (una columna por ronda:
> Octavos → Cuartos → Semifinal → Final) con un efecto de **acercamiento/zoom
> fluido en horizontal** al seleccionar una ronda.
>
> **Comportamiento exacto:**
> 1. Arriba, una fila de "pills" (una por ronda) actúa como control. Hay un
>    estado `active` (la ronda enfocada), por defecto la primera.
> 2. Los carriles se renderizan en una sola fila flex horizontal dentro de un
>    **viewport con `overflow-hidden`**. La fila completa es un `motion.div`
>    ("track") con padding lateral grande (`paddingInline: "12vw"`) para que el
>    primer y último carril puedan quedar centrados.
> 3. Al cambiar `active`, el track se **traslada en X** para **centrar el carril
>    activo** dentro del viewport, animado con un **spring** (no easing lineal).
> 4. Cada carril es a su vez un `motion.div` que anima `scale` y `opacity` según
>    su distancia al carril activo: el activo va a `scale 1 / opacity 1`; los
>    demás se **encogen y atenúan** proporcionalmente a la distancia (efecto de
>    profundidad). Los carriles no activos son **clicables** para enfocarlos.
> 5. Difuminado (`gradient` de `background` a transparente) en los bordes
>    izquierdo/derecho del viewport para reforzar la profundidad.
> 6. El pill activo usa un fondo que se desliza con `layoutId` (shared layout de
>    Motion) entre pills.
>
> **Cómo calcular el centrado (clave del efecto):**
> - Pon un `ref` en el viewport y un `ref` por carril.
> - En un `useLayoutEffect` que dependa de `active` (y en `resize`), mide:
>   `laneCenter = lane.offsetLeft + lane.offsetWidth / 2` y
>   `x = viewport.clientWidth / 2 - laneCenter`. Guarda `x` en estado y pásalo a
>   `animate={{ x }}` del track. Usar `offsetLeft`/`offsetWidth` (layout, no
>   afectado por `transform`) hace que la medición sea estable aunque los
>   carriles estén escalados.
>
> **Transiciones (valores que funcionan):**
> - Track: `{ type: "spring", stiffness: 85, damping: 18, mass: 0.9 }`.
> - Carril (scale/opacity): `{ type: "spring", stiffness: 120, damping: 20 }`.
> - Pill activo: `{ type: "spring", stiffness: 380, damping: 32 }`.
> - Carril no activo: `scale = max(0.78, 0.9 - distancia*0.04)`,
>   `opacity = max(0.28, 0.55 - distancia*0.1)`, y `filter: saturate(0.65)`.
>
> **Accesibilidad / UX:** los pills y carriles son `<button>`; muestra una pista
> tipo "Toca una ronda o un carril para acercarte".
>
> Recibe los datos por props/módulo: una lista de rondas
> `{ id, label, count }` y los partidos por ronda. Mantén el componente
> presentacional; sin lógica de negocio dentro.

---

## Esqueleto de referencia (lo esencial del efecto)

```tsx
"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { motion } from "motion/react";

const ROUNDS = [
  { id: "r16", label: "Octavos" },
  { id: "qf", label: "Cuartos" },
  { id: "sf", label: "Semifinal" },
  { id: "final", label: "Final" },
] as const;

type RoundId = (typeof ROUNDS)[number]["id"];

export function Bracket() {
  const [active, setActive] = useState<RoundId>("r16");
  const viewportRef = useRef<HTMLDivElement>(null);
  const laneRefs = useRef<Record<RoundId, HTMLDivElement | null>>({
    r16: null,
    qf: null,
    sf: null,
    final: null,
  });
  const [x, setX] = useState(0);

  // Centra el carril activo dentro del viewport.
  const recompute = useCallback(() => {
    const vp = viewportRef.current;
    const lane = laneRefs.current[active];
    if (!vp || !lane) return;
    const center = lane.offsetLeft + lane.offsetWidth / 2;
    setX(vp.clientWidth / 2 - center);
  }, [active]);

  useLayoutEffect(() => recompute(), [recompute]);
  useEffect(() => {
    window.addEventListener("resize", recompute);
    return () => window.removeEventListener("resize", recompute);
  }, [recompute]);

  const activeIndex = ROUNDS.findIndex((r) => r.id === active);

  return (
    <div>
      {/* Controles con pill deslizante (layoutId) */}
      <div className="mb-10 flex justify-center">
        <div className="flex gap-1 rounded-full border p-1">
          {ROUNDS.map((r) => {
            const isActive = r.id === active;
            return (
              <button
                key={r.id}
                onClick={() => setActive(r.id)}
                className="relative rounded-full px-4 py-2"
              >
                {isActive && (
                  <motion.span
                    layoutId="round-pill"
                    className="absolute inset-0 rounded-full bg-lime-400"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{r.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Viewport + track */}
      <div ref={viewportRef} className="relative overflow-hidden">
        <motion.div
          className="flex items-center gap-6"
          style={{ paddingInline: "12vw" }}
          animate={{ x }}
          transition={{ type: "spring", stiffness: 85, damping: 18, mass: 0.9 }}
        >
          {ROUNDS.map((round, i) => {
            const isActive = round.id === active;
            const dist = Math.abs(i - activeIndex);
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
                className="w-[296px] shrink-0 origin-center"
                style={{ filter: isActive ? "none" : "saturate(0.65)" }}
              >
                <h3 className="mb-4">{round.label}</h3>
                <div className="flex flex-col gap-3">
                  {/* ...tarjetas de partido de esta ronda... */}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Difuminado de bordes */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />
      </div>
    </div>
  );
}
```

---

## Por qué funciona (las 3 ideas)

1. **Centrar = traducir X.** Todo el efecto de "acercamiento" es trasladar el
   track para que el centro del carril activo coincida con el centro del
   viewport. La cámara no se mueve; se mueve el contenido.
2. **Medir con `offsetLeft`/`offsetWidth`.** Son medidas de *layout*: no las
   altera el `transform: scale` de los carriles, así que el cálculo del centro
   es estable aunque los carriles estén encogidos.
3. **Spring, no easing.** El `type: "spring"` de Motion da el "peso" y el leve
   asentamiento que hace que el acercamiento se sienta fluido y físico.

> Implementación real en el repo: `components/organisms/bracket.tsx`
> (con `RoundPill` en `components/atoms/round-pill.tsx`).
