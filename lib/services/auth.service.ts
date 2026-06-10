/**
 * Service de autenticación (SERVER ONLY).
 * Usa el cliente de @supabase/ssr que lee/escribe las cookies de sesión,
 * por lo que login/register dejan la sesión persistida automáticamente.
 *
 * El registro dispara el trigger `handle_new_user` en la BD, que crea el
 * `profile` con rol 'user'. Un admin se promueve manualmente (ver schema.sql).
 */
import { createServerSB } from "@/lib/supabase/server";
import type {
  AuthResponse,
  AuthUser,
  LoginInput,
  MeResponse,
  Profile,
  RegisterInput,
} from "./auth.types";

type ServerClient = Awaited<ReturnType<typeof createServerSB>>;

/** Error de dominio con código HTTP, para que las rutas respondan coherente. */
export class AuthError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.name = "AuthError";
    this.status = status;
  }
}

function toAuthUser(user: { id: string; email?: string | null }): AuthUser {
  return { id: user.id, email: user.email ?? null };
}

async function fetchProfile(
  supabase: ServerClient,
  userId: string
): Promise<Profile | null> {
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  return data ?? null;
}

export async function registerUser(input: RegisterInput): Promise<AuthResponse> {
  const supabase = await createServerSB();
  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      // Estos metadatos los consume el trigger handle_new_user en la BD.
      data: {
        username: input.username ?? undefined,
        full_name: input.fullName ?? undefined,
      },
    },
  });

  if (error) throw new AuthError(error.message, error.status ?? 400);
  if (!data.user) throw new AuthError("No se pudo crear el usuario", 500);

  // Si hay sesión (confirmación de email desactivada) ya podemos leer el profile
  // por RLS (id = auth.uid()). Si no, profile llega null hasta que confirme.
  const profile = data.session
    ? await fetchProfile(supabase, data.user.id)
    : null;

  return {
    user: toAuthUser(data.user),
    profile,
    hasSession: Boolean(data.session),
  };
}

export async function loginUser(input: LoginInput): Promise<AuthResponse> {
  const supabase = await createServerSB();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: input.email,
    password: input.password,
  });

  if (error) throw new AuthError(error.message, error.status ?? 401);

  const profile = await fetchProfile(supabase, data.user.id);
  return {
    user: toAuthUser(data.user),
    profile,
    hasSession: Boolean(data.session),
  };
}

export async function logoutUser(): Promise<void> {
  const supabase = await createServerSB();
  const { error } = await supabase.auth.signOut();
  if (error) throw new AuthError(error.message, 400);
}

/** Devuelve el usuario + profile de la sesión actual, o null si no hay sesión. */
export async function getCurrentUser(): Promise<MeResponse> {
  const supabase = await createServerSB();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { user: null, profile: null };

  const profile = await fetchProfile(supabase, user.id);
  return { user: toAuthUser(user), profile };
}
