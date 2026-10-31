import { PUBLIC_PRODUCT_COLUMNS } from "@/lib/supabase";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

const NO_STORE = { "Cache-Control": "no-store" };

/** Catálogo público. anon no tiene GRANT sobre "categoria"; esta ruta no devuelve "stock". */
export async function GET() {
  try {
    const { data, error } = await getSupabaseAdmin()
      .from("products")
      .select(PUBLIC_PRODUCT_COLUMNS)
      .order("name");
    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json(data ?? [], { headers: NO_STORE });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error";
    return Response.json({ error: message }, { status: 500 });
  }
}
