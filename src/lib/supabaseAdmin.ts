import "server-only";
import { createHash, timingSafeEqual } from "node:crypto";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/** Cabecera HTTP con la que el panel envía la contraseña de administrador */
export const ADMIN_PASS_HEADER = "x-admin-pass";

let client: SupabaseClient | null = null;

/** Cliente con la service_role key: ignora los permisos de anon. Nunca importar desde el cliente. */
export function getSupabaseAdmin(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Falta SUPABASE_SERVICE_ROLE_KEY en .env.local");
  client ??= createClient(url, key, { auth: { persistSession: false } });
  return client;
}

// Compara dos textos en tiempo constante (hash previo para igualar longitudes)
function safeEqual(a: string, b: string): boolean {
  const hash = (s: string) => createHash("sha256").update(s).digest();
  return timingSafeEqual(hash(a), hash(b));
}

/**
 * Valida la contraseña enviada en la cabecera contra ADMIN_PASS (solo servidor).
 * Devuelve una Response de error si no es válida, o null si puede continuar.
 */
export function checkAdmin(request: Request): Response | null {
  const expected = process.env.ADMIN_PASS;
  if (!expected) return Response.json({ error: "Falta ADMIN_PASS en .env.local" }, { status: 500 });
  const given = request.headers.get(ADMIN_PASS_HEADER) ?? "";
  if (!safeEqual(given, expected)) return Response.json({ error: "Contraseña incorrecta." }, { status: 401 });
  return null;
}
