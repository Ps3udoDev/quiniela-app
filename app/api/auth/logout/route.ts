import { logoutUser, AuthError } from "@/lib/services/auth.service";

export async function POST() {
  try {
    await logoutUser();
    return Response.json({ success: true }, { status: 200 });
  } catch (e) {
    if (e instanceof AuthError) {
      return Response.json({ error: e.message }, { status: e.status });
    }
    return Response.json({ error: "Error al cerrar sesión" }, { status: 500 });
  }
}
