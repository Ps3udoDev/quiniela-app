/**
 * Tipos compartidos de autenticación.
 * IMPORTANTE: este archivo NO importa código server-only (solo tipos de la BD),
 * por eso puede usarse tanto en el service (server) como en el hook (client).
 */
import type { Tables } from "@/types/supabase";

export type Profile = Tables<"profiles">;

/** Forma reducida del usuario que viaja al cliente (sin datos sensibles). */
export interface AuthUser {
  id: string;
  email: string | null;
}

export interface RegisterInput {
  email: string;
  password: string;
  username?: string | null;
  fullName?: string | null;
}

export interface LoginInput {
  email: string;
  password: string;
}

/** Respuesta de register/login. */
export interface AuthResponse {
  user: AuthUser;
  profile: Profile | null;
  /** false cuando Supabase exige confirmación por email (aún no hay sesión). */
  hasSession: boolean;
}

/** Respuesta de GET /api/auth/me. */
export interface MeResponse {
  user: AuthUser | null;
  profile: Profile | null;
}
