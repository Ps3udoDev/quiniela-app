import Link from "next/link";
import { WordMark } from "@/components/atoms/word-mark";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/70">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-5 py-8 sm:flex-row">
        <div className="flex items-center gap-3">
          <WordMark className="text-base" />
          <span className="text-xs text-muted-foreground">
            Motor de quinielas · 2026
          </span>
        </div>
        <div className="flex items-center gap-6 text-xs text-muted-foreground">
          <Link href="/bracket" className="transition-colors hover:text-foreground">
            Bracket
          </Link>
          <Link href="/leaderboard" className="transition-colors hover:text-foreground">
            Tabla
          </Link>
          <Link href="/register" className="transition-colors hover:text-foreground">
            Crear cuenta
          </Link>
        </div>
      </div>
    </footer>
  );
}
