/** Validadores ligeros reutilizables (sin dependencias externas). */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isEmail(value: unknown): value is string {
  return typeof value === "string" && EMAIL_RE.test(value);
}

/** Reglas mínimas de contraseña para el MVP. */
export const MIN_PASSWORD_LENGTH = 6;

export function isValidPassword(value: unknown): value is string {
  return typeof value === "string" && value.length >= MIN_PASSWORD_LENGTH;
}

/** Normaliza un string opcional: trim y null si queda vacío. */
export function optionalText(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}
