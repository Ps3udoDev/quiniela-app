import type { NextRequest } from "next/server";
import { registerUser, AuthError } from "@/lib/services/auth.service";
import { isEmail, isValidPassword, optionalText, MIN_PASSWORD_LENGTH } from "@/lib/validators";

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
  if (!isValidPassword(password)) {
    return Response.json(
      { error: `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres` },
      { status: 400 }
    );
  }

  try {
    const result = await registerUser({
      email,
      password,
      username: optionalText(body.username),
      fullName: optionalText(body.fullName),
    });
    return Response.json(result, { status: 201 });
  } catch (e) {
    if (e instanceof AuthError) {
      return Response.json({ error: e.message }, { status: e.status });
    }
    return Response.json({ error: "Error al registrar el usuario" }, { status: 500 });
  }
}
