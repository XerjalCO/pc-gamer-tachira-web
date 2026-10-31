/** Campos públicos que el panel puede crear o editar. El stock viaja por otra ruta. */
export type ProductWrite = {
  name: string;
  desc: string;
  categoria: string;
  price: number;
  garantia: string;
  specs: Record<string, string>;
};

// Acepta solo un objeto plano de textos; rechaza arrays y valores que no sean string
function parseSpecs(value: unknown): Record<string, string> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const specs: Record<string, string> = {};
  for (const [key, entry] of Object.entries(value)) {
    if (typeof entry !== "string") return null;
    specs[key] = entry;
  }
  return specs;
}

/** Valida el JSON del formulario. Devuelve null si falta un campo o el precio no es válido. */
export function parseProduct(raw: unknown): ProductWrite | null {
  if (!raw || typeof raw !== "object") return null;
  const row = raw as Record<string, unknown>;
  const name = typeof row.name === "string" ? row.name.trim() : "";
  const desc = typeof row.desc === "string" ? row.desc.trim() : "";
  const categoria = typeof row.categoria === "string" ? row.categoria.trim() : "";
  const garantia = typeof row.garantia === "string" ? row.garantia.trim() : "";
  const price = typeof row.price === "number" ? row.price : Number(row.price);
  const specs = parseSpecs(row.specs);
  if (!name || !desc || !categoria || !garantia || !specs) return null;
  if (!Number.isFinite(price) || price <= 0) return null;
  return { name, desc, categoria, price, garantia, specs };
}

/** Lee el FormData del panel: JSON en "data", archivos en "images" y el id al editar. */
export async function readProductForm(request: Request) {
  const form = await request.formData().catch(() => null);
  if (!form) return { product: null, files: [] as File[], images: [] as string[], id: null as string | null };
  let parsed: unknown = null;
  const dataRaw = form.get("data");
  if (typeof dataRaw === "string") {
    try {
      parsed = JSON.parse(dataRaw);
    } catch {
      parsed = null;
    }
  }
  const files = form.getAll("images").filter((item): item is File => item instanceof File && item.size > 0);
  const idField = form.get("id");
  return {
    product: parseProduct(parsed),
    files,
    images: keptImages(parsed),
    id: typeof idField === "string" && idField ? idField : null,
  };
}

// URLs que el panel reutiliza al duplicar, cuando no se suben archivos nuevos
function keptImages(parsed: unknown): string[] {
  if (!parsed || typeof parsed !== "object" || !("images" in parsed)) return [];
  const images = (parsed as { images: unknown }).images;
  if (!Array.isArray(images)) return [];
  return images.filter((item): item is string => typeof item === "string" && item.length > 0);
}

/** Rechaza archivos que no sean imagen, o que superen 8 archivos / 8 MB cada uno. */
export function rejectImages(files: File[]): string | null {
  if (files.length > 8) return "Máximo 8 imágenes.";
  for (const file of files) {
    if (!file.type.startsWith("image/")) return `"${file.name}" no es una imagen.`;
    if (file.size > 8 * 1024 * 1024) return `"${file.name}" supera 8 MB.`;
  }
  return null;
}

/** Traduce el unique de Postgres a un mensaje que el panel puede mostrar. */
export function friendlyDbError(error: { code?: string; message: string }, name: string): Error {
  return new Error(error.code === "23505" ? `Ya existe un producto llamado "${name}".` : error.message);
}
