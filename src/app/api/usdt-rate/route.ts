import { USDT_API_URL } from "@/data/pagos";

// Consulta la tasa USDT/VES desde el servidor (la API no permite CORS) y la reenvía al cliente
export async function GET() {
  try {
    const res = await fetch(USDT_API_URL, { cache: "no-store", signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data: unknown = await res.json();
    return Response.json(data, { headers: { "Cache-Control": "public, max-age=60" } });
  } catch {
    return Response.json({ error: "No se pudo obtener la tasa USDT/VES" }, { status: 502 });
  }
}
