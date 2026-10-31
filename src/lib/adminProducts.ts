import type { NewProduct, Product } from "@/data/inventario";

const API = "/api/admin/products";

type ProductFields = Omit<NewProduct, "images">;

// Envía la contraseña admin y lanza el mensaje de error que devuelve la ruta
async function send(adminPass: string, path: string, init: RequestInit): Promise<{ id?: string }> {
  const headers = new Headers(init.headers);
  headers.set("x-admin-pass", adminPass);
  const res = await fetch(path, { ...init, headers, cache: "no-store" });
  const body = (await res.json().catch(() => ({}))) as { error?: string; id?: string };
  if (!res.ok) throw new Error(body.error ?? `Error HTTP ${res.status}`);
  return body;
}

// Arma el formulario: datos en JSON y las fotos como archivos
function formBody(data: ProductFields, files: File[], extra?: { id?: string; images?: string[] }) {
  const body = new FormData();
  if (extra?.id) body.set("id", extra.id);
  const payload = extra?.images?.length ? { ...data, images: extra.images } : data;
  body.set("data", JSON.stringify(payload));
  for (const file of files) body.append("images", file);
  return body;
}

/** Sube las imágenes e inserta el producto. Sin archivos, reutiliza las URLs indicadas. */
export async function createProduct(adminPass: string, data: ProductFields, files: File[], reuseImages?: string[]): Promise<string> {
  const images = files.length ? undefined : reuseImages;
  const body = await send(adminPass, API, { method: "POST", body: formBody(data, files, { images }) });
  if (!body.id) throw new Error("El servidor no devolvió el id del producto.");
  return body.id;
}

/** Actualiza el producto. Sin archivos nuevos conserva las imágenes actuales. */
export async function updateProduct(adminPass: string, product: Product, data: ProductFields, files: File[]) {
  await send(adminPass, API, { method: "PUT", body: formBody(data, files, { id: product.id }) });
}

/** Elimina el producto y sus imágenes del bucket. */
export async function deleteProduct(adminPass: string, product: Product) {
  await send(adminPass, API, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: product.id }),
  });
}

/** Muestra u oculta el equipo en el catálogo público. */
export async function setProductVisibility(adminPass: string, id: string, isVisible: boolean) {
  await send(adminPass, `${API}/visibility`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, is_visible: isVisible }),
  });
}
