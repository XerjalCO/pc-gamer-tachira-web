import { PUBLIC_PRODUCT_COLUMNS } from "@/lib/supabase";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

const NO_STORE = { "Cache-Control": "no-store" };

/** Catálogo público. anon no tiene GRANT sobre "categoria"; esta ruta no devuelve "stock". */
export async function GET() {
  try {
    const admin = getSupabaseAdmin();
    const visible = await admin.from("products").select(PUBLIC_PRODUCT_COLUMNS).eq("is_visible", true).order("name");
    if (!visible.error) return Response.json(visible.data ?? [], { headers: NO_STORE });
    // La columna aún no existe: se muestra todo el catálogo hasta aplicar el SQL de schema.sql
    if (visible.error.code !== "42703") return Response.json({ error: visible.error.message }, { status: 500 });
    const { data, error } = await admin.from("products").select(PUBLIC_PRODUCT_COLUMNS).order("name");
    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json(data ?? [], { headers: NO_STORE });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error";
    return Response.json({ error: message }, { status: 500 });
  }
}
