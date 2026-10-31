import "server-only";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

const BUCKET = "product-images";

// Prefijo de las URLs públicas de este proyecto, para recuperar la ruta interna al borrar
function publicPrefix(): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "") ?? "";
  return `${base}/storage/v1/object/public/${BUCKET}/`;
}

// Extrae la ruta del bucket a partir de una URL pública (null si la imagen es local)
function pathFromPublicUrl(url: string): string | null {
  const prefix = publicPrefix();
  const index = url.indexOf(prefix);
  return index === -1 ? null : decodeURIComponent(url.slice(index + prefix.length));
}

/** Sube cada archivo con un nombre único y devuelve sus URLs públicas. */
export async function uploadProductImages(files: File[]): Promise<string[]> {
  const admin = getSupabaseAdmin();
  const paths: string[] = [];
  try {
    for (const file of files) {
      const ext = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error } = await admin.storage.from(BUCKET).upload(path, file, {
        contentType: file.type,
        upsert: false,
      });
      if (error) throw new Error(`No se pudo subir "${file.name}": ${error.message}`);
      paths.push(path);
    }
  } catch (err) {
    if (paths.length) await admin.storage.from(BUCKET).remove(paths);
    throw err;
  }
  return paths.map((path) => admin.storage.from(BUCKET).getPublicUrl(path).data.publicUrl);
}

/** Copia las fotos para que el duplicado no comparta archivos con el original. */
export async function copyProductImages(urls: string[]): Promise<string[]> {
  const admin = getSupabaseAdmin();
  const stored: string[] = [];
  const result: string[] = [];
  try {
    for (const url of urls) {
      const from = pathFromPublicUrl(url);
      if (!from) {
        result.push(url);
        continue;
      }
      const ext = from.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
      const to = `${crypto.randomUUID()}.${ext}`;
      const { error } = await admin.storage.from(BUCKET).copy(from, to);
      if (error) throw new Error(`No se pudo copiar una imagen: ${error.message}`);
      stored.push(to);
      result.push(admin.storage.from(BUCKET).getPublicUrl(to).data.publicUrl);
    }
  } catch (err) {
    if (stored.length) await admin.storage.from(BUCKET).remove(stored);
    throw err;
  }
  return result;
}

/** Borra del bucket las URLs que pertenecen a product-images. Ignora fotos locales. */
export async function removeProductImages(urls: string[]) {
  const paths = urls.map(pathFromPublicUrl).filter((path): path is string => path !== null);
  if (paths.length) await getSupabaseAdmin().storage.from(BUCKET).remove(paths);
}
