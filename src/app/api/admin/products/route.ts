import { checkAdmin, getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { friendlyDbError, readProductForm, rejectImages } from "@/lib/productPayload";
import { removeProductImages, uploadProductImages } from "@/lib/productImages";

const NO_STORE = { "Cache-Control": "no-store" };

function fail(err: unknown, status = 500) {
  const message = err instanceof Error ? err.message : "Error";
  return Response.json({ error: message }, { status: message.startsWith("Ya existe") ? 409 : status });
}

/** Crea el producto con la service role. El navegador ya no escribe en Supabase. */
export async function POST(request: Request) {
  const denied = checkAdmin(request);
  if (denied) return denied;
  try {
    const { product, files } = await readProductForm(request);
    if (!product) return Response.json({ error: "Datos del producto inválidos." }, { status: 400 });
    const imageError = rejectImages(files);
    if (imageError) return Response.json({ error: imageError }, { status: 400 });
    if (!files.length) return Response.json({ error: "Agrega al menos una imagen." }, { status: 400 });
    const images = await uploadProductImages(files);
    const { data, error } = await getSupabaseAdmin().from("products").insert({ ...product, images }).select("id").single();
    if (error) {
      await removeProductImages(images);
      throw friendlyDbError(error, product.name);
    }
    return Response.json({ id: data.id }, { headers: NO_STORE });
  } catch (err) {
    return fail(err);
  }
}

/** Actualiza el producto. Si llegan archivos nuevos, reemplaza las imágenes del bucket. */
export async function PUT(request: Request) {
  const denied = checkAdmin(request);
  if (denied) return denied;
  try {
    const { product, files, id } = await readProductForm(request);
    if (!product || !id) return Response.json({ error: "Datos del producto inválidos." }, { status: 400 });
    const imageError = rejectImages(files);
    if (imageError) return Response.json({ error: imageError }, { status: 400 });
    const admin = getSupabaseAdmin();
    const { data: current, error: readError } = await admin.from("products").select("images").eq("id", id).maybeSingle();
    if (readError) throw new Error(readError.message);
    if (!current) return Response.json({ error: "El producto ya no existe." }, { status: 404 });
    const images = files.length ? await uploadProductImages(files) : (current.images as string[]);
    const { error } = await admin.from("products").update({ ...product, images }).eq("id", id);
    if (error) {
      if (files.length) await removeProductImages(images);
      throw friendlyDbError(error, product.name);
    }
    if (files.length) await removeProductImages(current.images as string[]);
    return Response.json({ ok: true }, { headers: NO_STORE });
  } catch (err) {
    return fail(err);
  }
}

/** Elimina el producto y las fotos que estén en el bucket. */
export async function DELETE(request: Request) {
  const denied = checkAdmin(request);
  if (denied) return denied;
  const body = await request.json().catch(() => null);
  const id = body && typeof body === "object" && "id" in body && typeof body.id === "string" ? body.id : "";
  if (!id) return Response.json({ error: "Falta el id." }, { status: 400 });
  try {
    const admin = getSupabaseAdmin();
    const { data: current, error: readError } = await admin.from("products").select("images").eq("id", id).maybeSingle();
    if (readError) throw new Error(readError.message);
    if (!current) return Response.json({ error: "El producto ya no existe." }, { status: 404 });
    const { error } = await admin.from("products").delete().eq("id", id);
    if (error) throw new Error(error.message);
    await removeProductImages(current.images as string[]);
    return Response.json({ ok: true }, { headers: NO_STORE });
  } catch (err) {
    return fail(err);
  }
}
