import { checkAdmin, getSupabaseAdmin } from "@/lib/supabaseAdmin";

const NO_STORE = { "Cache-Control": "no-store" };

// Devuelve el stock de todos los productos como { [id]: stock } (solo admin)
export async function GET(request: Request) {
  const denied = checkAdmin(request);
  if (denied) return denied;
  try {
    const { data, error } = await getSupabaseAdmin().from("products").select("id, stock");
    if (error) throw new Error(error.message);
    const stockById = Object.fromEntries(data.map((p) => [p.id, p.stock]));
    return Response.json(stockById, { headers: NO_STORE });
  } catch (err) {
    return Response.json({ error: err instanceof Error ? err.message : "Error" }, { status: 500 });
  }
}

// Actualiza el stock de un producto: body { id, stock } (solo admin)
export async function PUT(request: Request) {
  const denied = checkAdmin(request);
  if (denied) return denied;
  const body = await request.json().catch(() => null);
  const { id, stock } = (body ?? {}) as { id?: unknown; stock?: unknown };
  if (typeof id !== "string" || !Number.isInteger(stock) || (stock as number) < 0) {
    return Response.json({ error: "Datos de stock inválidos." }, { status: 400 });
  }
  try {
    const { error } = await getSupabaseAdmin().from("products").update({ stock }).eq("id", id);
    if (error) throw new Error(error.message);
    return Response.json({ ok: true }, { headers: NO_STORE });
  } catch (err) {
    return Response.json({ error: err instanceof Error ? err.message : "Error" }, { status: 500 });
  }
}
