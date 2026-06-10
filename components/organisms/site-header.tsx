"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Menu, LogOut, ShieldCheck } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { WordMark } from "@/components/atoms/word-mark";
import { UserAvatar } from "@/components/atoms/user-avatar";
import { NavLink } from "@/components/molecules/nav-link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NAV = [
  { href: "/bracket", label: "Bracket" },
  { href: "/dashboard", label: "Partidos" },
  { href: "/leaderboard", label: "Tabla" },
];

export function SiteHeader() {
  const { user, profile, isAuthenticated, isAdmin, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const nav = isAdmin ? [...NAV, { href: "/admin", label: "Admin" }] : NAV;
  const displayName = profile?.username ?? user?.email?.split("@")[0] ?? "tú";

  async function handleLogout() {
    try {
      await logout();
      toast.success("Sesión cerrada");
      router.refresh();
    } catch {
      toast.error("No se pudo cerrar la sesión");
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-5">
        <Link href="/" className="flex items-center">
          <WordMark />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((item) => (
            <NavLink key={item.href} href={item.href}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 rounded-full outline-none">
                <UserAvatar name={displayName} hue={profile?.role === "admin" ? 130 : 95} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <div className="flex flex-col gap-0.5 px-1.5 py-1">
                  <span className="truncate text-sm">@{displayName}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {user?.email}
                  </span>
                </div>
                <DropdownMenuSeparator />
                {isAdmin && (
                  <DropdownMenuItem onClick={() => router.push("/admin")}>
                    <ShieldCheck className="size-4" /> Panel admin
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={handleLogout} variant="destructive">
                  <LogOut className="size-4" /> Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link
                href="/login"
                className={buttonVariants({ variant: "ghost", size: "sm" })}
              >
                Entrar
              </Link>
              <Link href="/register" className={buttonVariants({ size: "sm" })}>
                Crear cuenta
              </Link>
            </>
          )}
        </div>

        {/* Móvil */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            aria-label="Abrir menú"
            className={cn(
              "md:hidden",
              buttonVariants({ variant: "ghost", size: "icon" })
            )}
          >
            <Menu className="size-5" />
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <SheetHeader>
              <SheetTitle>
                <WordMark />
              </SheetTitle>
            </SheetHeader>
            <nav className="mt-2 flex flex-col gap-1 px-4">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-auto flex flex-col gap-2 border-t border-border p-4">
              {isAuthenticated ? (
                <Button variant="secondary" onClick={handleLogout}>
                  <LogOut className="size-4" /> Cerrar sesión
                </Button>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className={buttonVariants({ variant: "ghost" })}
                  >
                    Entrar
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setOpen(false)}
                    className={buttonVariants()}
                  >
                    Crear cuenta
                  </Link>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
