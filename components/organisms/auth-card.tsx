"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AuthCard({ mode }: { mode: "login" | "register" }) {
  const isRegister = mode === "register";
  const { login, register } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ username: "", email: "", password: "" });

  function update(key: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (isRegister) {
        const res = await register({
          email: form.email,
          password: form.password,
          username: form.username || null,
        });
        if (!res.hasSession) {
          toast.success("Cuenta creada", {
            description: "Revisa tu correo para confirmar el acceso.",
          });
          router.push("/login");
          return;
        }
      } else {
        await login({ email: form.email, password: form.password });
      }
      toast.success(isRegister ? "¡Listo, a pronosticar!" : "Sesión iniciada");
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Algo salió mal");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm rounded-3xl border border-border bg-card/80 p-7 backdrop-blur-sm glow-turf">
      <h1 className="font-display text-3xl uppercase tracking-tight">
        {isRegister ? "Crear cuenta" : "Entrar"}
      </h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        {isRegister
          ? "Únete y empieza a sumar puntos."
          : "Bienvenido de vuelta al banquillo."}
      </p>

      <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
        {isRegister && (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="username">Usuario</Label>
            <Input
              id="username"
              placeholder="la_garra"
              autoComplete="username"
              value={form.username}
              onChange={update("username")}
            />
          </div>
        )}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            required
            placeholder="tu@correo.com"
            autoComplete="email"
            value={form.email}
            onChange={update("email")}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password"
            type="password"
            required
            minLength={6}
            placeholder="Mínimo 6 caracteres"
            autoComplete={isRegister ? "new-password" : "current-password"}
            value={form.password}
            onChange={update("password")}
          />
        </div>

        <Button type="submit" className="mt-2 w-full" disabled={loading}>
          {loading && <Loader2 className="size-4 animate-spin" />}
          {isRegister ? "Crear cuenta" : "Entrar"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {isRegister ? "¿Ya tienes cuenta? " : "¿Aún no tienes cuenta? "}
        <Link
          href={isRegister ? "/login" : "/register"}
          className="font-medium text-turf hover:underline"
        >
          {isRegister ? "Entrar" : "Crear cuenta"}
        </Link>
      </p>
    </div>
  );
}
