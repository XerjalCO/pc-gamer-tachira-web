import type { NewProduct, Product } from "@/data/inventario";

const API = "/api/admin/products";

type ProductFields = Omit<NewProduct, "images">;

// Envía la contraseña admin y lanza el mensaje de error que devuelve la ruta
async function send(adminPass: string, init: RequestInit): Promise<{ id?: string }> {
  const headers = new Headers(init.headers);
  headers.set("x-admin-pass", adminPass);
  const res = await fetch(API, { ...init, headers, cache: "no-store" });
  const body = (await res.json().catch(() => ({}))) as { error?: string; id?: string };
  if (!res.ok) throw new Error(body.error ?? `Error HTTP ${res.status}`);
  return body;
}

// Arma el formulario: datos en JSON y las fotos como archivos
function formBody(data: ProductFields, files: File[], id?: string) {
  const body = new FormData();
  if (id) body.set("id", id);
  body.set("data", JSON.stringify(data));
  for (const file of files) body.append("images", file);
  return body;
}

/** Sube las imágenes e inserta el producto. Devuelve su id. */
export async function createProduct(adminPass: string, data: ProductFields, files: File[]): Promise<string> {
  const body = await send(adminPass, { method: "POST", body: formBody(data, files) });
  if (!body.id) throw new Error("El servidor no devolvió el id del producto.");
  return body.id;
}

/** Actualiza el producto. Sin archivos nuevos conserva las imágenes actuales. */
export async function updateProduct(adminPass: string, product: Product, data: ProductFields, files: File[]) {
  await send(adminPass, { method: "PUT", body: formBody(data, files, product.id) });
}

/** Elimina el producto y sus imágenes del bucket. */
export async function deleteProduct(adminPass: string, product: Product) {
  await send(adminPass, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: product.id }),
  });
}
