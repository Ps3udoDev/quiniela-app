"use client";

import useSWR from "swr";
import type {
  AuthResponse,
  LoginInput,
  MeResponse,
  RegisterInput,
} from "@/lib/services/auth.types";

const ME_KEY = "/api/auth/me";

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error("No se pudo cargar la sesión");
  return res.json() as Promise<T>;
}

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as { error?: string })?.error ?? "Error inesperado");
  }
  return data as T;
}

/**
 * Hook de sesión. Lee /api/auth/me con SWR y expone acciones que revalidan
 * la sesión automáticamente tras login/register/logout.
 */
export function useAuth() {
  const { data, error, isLoading, mutate } = useSWR<MeResponse>(
    ME_KEY,
    (url: string) => getJson<MeResponse>(url),
    { revalidateOnFocus: false }
  );

  async function register(input: RegisterInput): Promise<AuthResponse> {
    const result = await postJson<AuthResponse>("/api/auth/register", input);
    await mutate();
    return result;
  }

  async function login(input: LoginInput): Promise<AuthResponse> {
    const result = await postJson<AuthResponse>("/api/auth/login", input);
    await mutate();
    return result;
  }

  async function logout(): Promise<void> {
    await postJson("/api/auth/logout", {});
    await mutate({ user: null, profile: null }, { revalidate: false });
  }

  return {
    user: data?.user ?? null,
    profile: data?.profile ?? null,
    isAuthenticated: Boolean(data?.user),
    isAdmin: data?.profile?.role === "admin",
    isLoading,
    error,
    register,
    login,
    logout,
    refresh: mutate,
  };
}
