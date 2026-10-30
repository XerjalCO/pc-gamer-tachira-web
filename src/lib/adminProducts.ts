import { supabase } from "@/lib/supabase";
import type { NewProduct, Product } from "@/data/inventario";

export const PRODUCT_IMAGES_BUCKET = "product-images";
const PUBLIC_PREFIX = `/storage/v1/object/public/${PRODUCT_IMAGES_BUCKET}/`;

// Sube cada archivo al bucket con un nombre único y devuelve sus rutas internas
async function uploadImages(files: File[]): Promise<string[]> {
  const paths: string[] = [];
  for (const file of files) {
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage
      .from(PRODUCT_IMAGES_BUCKET)
      .upload(path, file, { contentType: file.type, upsert: false });
    if (error) {
      await removeImagePaths(paths);
      throw new Error(`No se pudo subir "${file.name}": ${error.message}`);
    }
    paths.push(path);
  }
  return paths;
}

// Convierte rutas del bucket en URLs públicas
function toPublicUrls(paths: string[]): string[] {
  return paths.map(
    (path) => supabase.storage.from(PRODUCT_IMAGES_BUCKET).getPublicUrl(path).data.publicUrl
  );
}

// Borra archivos del bucket ignorando errores (limpieza best-effort)
async function removeImagePaths(paths: string[]) {
  if (paths.length) await supabase.storage.from(PRODUCT_IMAGES_BUCKET).remove(paths);
}

// Extrae la ruta interna del bucket a partir de una URL pública (null si es imagen local)
function pathFromPublicUrl(url: string): string | null {
  const i = url.indexOf(PUBLIC_PREFIX);
  return i === -1 ? null : decodeURIComponent(url.slice(i + PUBLIC_PREFIX.length));
}

/** Sube las imágenes, inserta el producto en la tabla y devuelve su id */
export async function createProduct(
  data: Omit<NewProduct, "images">,
  files: File[]
): Promise<string> {
  const paths = await uploadImages(files);
  const { data: row, error } = await supabase
    .from("products")
    .insert({ ...data, images: toPublicUrls(paths) })
    .select("id")
    .single();
  if (error) {
    // Si falla la inserción no dejamos imágenes huérfanas en Storage
    await removeImagePaths(paths);
    throw toFriendlyError(error, data.name);
  }
  return row.id;
}

/**
 * Actualiza el producto por id. Sin archivos nuevos conserva el array de imágenes actual;
 * con archivos nuevos los sube, reemplaza el array y borra del bucket las imágenes anteriores.
 */
export async function updateProduct(
  product: Product,
  data: Omit<NewProduct, "images">,
  files: File[]
): Promise<void> {
  const paths = files.length ? await uploadImages(files) : [];
  const images = files.length ? toPublicUrls(paths) : product.images;
  const { error } = await supabase.from("products").update({ ...data, images }).eq("id", product.id);
  if (error) {
    await removeImagePaths(paths);
    throw toFriendlyError(error, data.name);
  }
  if (files.length) await removeImagePaths(bucketPaths(product.images));
}

// Traduce errores conocidos de Postgres a mensajes legibles
function toFriendlyError(error: { code?: string; message: string }, name: string): Error {
  return new Error(error.code === "23505" ? `Ya existe un producto llamado "${name}".` : error.message);
}

// Filtra las URLs que pertenecen al bucket y devuelve sus rutas internas
function bucketPaths(urls: string[]): string[] {
  return urls.map(pathFromPublicUrl).filter((p): p is string => p !== null);
}

/** Elimina el producto de la tabla y sus imágenes alojadas en Storage */
export async function deleteProduct(product: Product): Promise<void> {
  const { error } = await supabase.from("products").delete().eq("id", product.id);
  if (error) throw new Error(error.message);
  await removeImagePaths(bucketPaths(product.images));
}
