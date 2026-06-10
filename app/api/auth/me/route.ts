import { getCurrentUser } from "@/lib/services/auth.service";

export async function GET() {
  // Siempre 200: { user: null } significa "no hay sesión" (cómodo para SWR).
  const result = await getCurrentUser();
  return Response.json(result, { status: 200 });
}
