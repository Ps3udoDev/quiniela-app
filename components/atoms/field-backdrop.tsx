import { cn } from "@/lib/utils";

/** Fondo decorativo: líneas de campo + halos del acento. */
export function FieldBackdrop({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className
      )}
    >
      <div className="field-grid absolute inset-0 opacity-60" />
      <div className="absolute -top-48 left-1/2 h-[460px] w-[860px] -translate-x-1/2 rounded-full bg-turf/10 blur-[130px]" />
      <div className="absolute bottom-[-120px] left-[-80px] h-[320px] w-[320px] rounded-full bg-turf/[0.06] blur-[110px]" />
    </div>
  );
}
