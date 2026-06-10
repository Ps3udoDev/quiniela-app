import type { NextRequest } from "next/server";
import { loginUser, AuthError } from "@/lib/services/auth.service";
import { isEmail } from "@/lib/validators";

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Cuerpo JSON inválido" }, { status: 400 });
  }

  const { email, password } = body;

  if (!isEmail(email)) {
    return Response.json({ error: "Email inválido" }, { status: 400 });
  }
  if (typeof password !== "string" || password.length === 0) {
    return Response.json({ error: "La contraseña es obligatoria" }, { status: 400 });
  }

  try {
    const result = await loginUser({ email, password });
    return Response.json(result, { status: 200 });
  } catch (e) {
    if (e instanceof AuthError) {
      return Response.json({ error: e.message }, { status: e.status });
    }
    return Response.json({ error: "Error al iniciar sesión" }, { status: 500 });
  }
}
