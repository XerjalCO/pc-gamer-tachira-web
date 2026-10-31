import { checkAdmin, getSupabaseAdmin } from "@/lib/supabaseAdmin";

const NO_STORE = { "Cache-Control": "no-store" };

/** Cambia is_visible para sacar o devolver un equipo del catálogo. */
export async function PATCH(request: Request) {
  const denied = checkAdmin(request);
  if (denied) return denied;
  const body = await request.json().catch(() => null);
  const { id, is_visible } = (body ?? {}) as { id?: unknown; is_visible?: unknown };
  if (typeof id !== "string" || typeof is_visible !== "boolean") {
    return Response.json({ error: "Datos de visibilidad inválidos." }, { status: 400 });
  }
  try {
    const { error } = await getSupabaseAdmin().from("products").update({ is_visible }).eq("id", id);
    if (error) {
      const missing = error.code === "42703" || error.code === "PGRST204";
      const message = missing
        ? "Falta is_visible. Ejecuta en Supabase: alter table public.products add column if not exists is_visible boolean not null default true;"
        : error.message;
      throw new Error(message);
    }
    return Response.json({ ok: true }, { headers: NO_STORE });
  } catch (err) {
    return Response.json({ error: err instanceof Error ? err.message : "Error" }, { status: 500 });
  }
}
