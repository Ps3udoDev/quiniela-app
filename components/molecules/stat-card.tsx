import { CountUp } from "@/components/atoms/count-up";

export function StatCard({
  value,
  label,
  suffix,
}: {
  value: number;
  label: string;
  suffix?: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card/60 p-6">
      <CountUp
        to={value}
        suffix={suffix}
        className="font-display text-4xl text-turf md:text-5xl"
      />
      <p className="mt-1.5 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
