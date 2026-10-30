import type { NewProduct } from "@/data/inventario";

/** Datos del formulario admin: el producto público más el stock (que viaja aparte) */
export type ProductFormData = Omit<NewProduct, "images"> & { stock: number };

const STOCK_API = "/api/admin/stock";

// Llama a la ruta de stock del servidor enviando la contraseña admin; lanza Error si falla
async function stockRequest<T>(adminPass: string, init?: RequestInit): Promise<T> {
  const res = await fetch(STOCK_API, {
    ...init,
    cache: "no-store",
    headers: { "Content-Type": "application/json", "x-admin-pass": adminPass },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error ?? `Error HTTP ${res.status}`);
  return body as T;
}

/** Obtiene el stock de todos los productos ({ [id]: stock }). También sirve para validar la contraseña. */
export function fetchStock(adminPass: string): Promise<Record<string, number>> {
  return stockRequest(adminPass);
}

/** Guarda el stock de un producto */
export async function saveStock(adminPass: string, id: string, stock: number): Promise<void> {
  await stockRequest(adminPass, { method: "PUT", body: JSON.stringify({ id, stock }) });
}
