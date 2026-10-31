"use client";
import { useState, type FormEvent } from "react";
import type { Product } from "@/data/inventario";
import type { ProductFormData } from "@/lib/adminStock";
import { useProductForm } from "@/hooks/useProductForm";
import { CARD_CLASS, INPUT_CLASS, LABEL_CLASS, PRIMARY_BUTTON_CLASS } from "./admin/adminStyles";
import { SpecsFieldset } from "./admin/SpecsFieldset";
import { ImageFilesHint } from "./admin/ImageFilesHint";

type Props = {
  productToEdit?: Product | null;
  seedProduct?: Product | null;
  initialStock?: number;
  onSubmit: (data: ProductFormData, files: File[], reuseImages?: string[]) => Promise<void>;
  onCancelEdit?: () => void;
};

export function AdminProductForm({ productToEdit, seedProduct, initialStock, onSubmit, onCancelEdit }: Props) {
  const source = productToEdit ?? seedProduct;
  const { fields, setters, specRows, setSpecRows, files, setFiles, fileInputRef, reset, toData } = useProductForm(source, initialStock);
  const { name, desc, categoria, price, stock, garantia } = fields;
  const { setName, setDesc, setCategoria, setPrice, setStock, setGarantia } = setters;
  const [saving, setSaving] = useState(false);
  const editing = Boolean(productToEdit);
  const copying = Boolean(seedProduct) && !editing;

  // Empaqueta los datos y delega el guardado (insert o update según el modo)
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    try {
      const reuse = copying && files.length === 0 ? seedProduct?.images : undefined;
      await onSubmit(toData(), files, reuse);
      reset();
    } catch {
      // El padre ya mostró la notificación de error; se conservan los datos para reintentar
    } finally {
      setSaving(false);
    }
  }

  return (
    <form id="product-form" onSubmit={handleSubmit} className={`${CARD_CLASS} flex flex-col gap-4 ${editing ? "ring-2 ring-amber-500/50" : copying ? "ring-2 ring-violet-500/40" : ""}`}>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold">{editing ? "Editar equipo" : "Agregar equipo"}</h2>
        {editing && <span className="rounded-full bg-amber-500/15 px-2.5 py-1 text-xs font-semibold text-amber-300">Modo edición</span>}
        {copying && <span className="rounded-full bg-violet-500/15 px-2.5 py-1 text-xs font-semibold text-violet-300">Copia</span>}
      </div>
      <fieldset disabled={saving} className="flex flex-col gap-4">
        <label className={LABEL_CLASS}>
          Nombre
          <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej. HP ELITEBOOK 840 G7" className={INPUT_CLASS} />
        </label>
        <label className={LABEL_CLASS}>
          Descripción
          <textarea required rows={2} value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Resumen corto del equipo" className={INPUT_CLASS} />
        </label>
        <label className={LABEL_CLASS}>
          Categoría
          <input required value={categoria} onChange={(e) => setCategoria(e.target.value)} placeholder="Ej. Laptop" className={INPUT_CLASS} />
        </label>
        <div className="grid grid-cols-3 gap-3">
          <label className={LABEL_CLASS}>
            Precio (USD)
            <input required type="number" min="0.01" step="0.01" inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="290" className={INPUT_CLASS} />
          </label>
          <label className={LABEL_CLASS}>
            Stock
            <input required type="number" min="0" step="1" inputMode="numeric" value={stock} onChange={(e) => setStock(e.target.value)} className={INPUT_CLASS} />
          </label>
          <label className={LABEL_CLASS}>
            Garantía
            <input required value={garantia} onChange={(e) => setGarantia(e.target.value)} className={INPUT_CLASS} />
          </label>
        </div>
      </fieldset>

      <SpecsFieldset rows={specRows} disabled={saving} onChange={setSpecRows} />

      <label className={LABEL_CLASS}>
        Imágenes
        <input ref={fileInputRef} required={!editing && !copying} type="file" accept="image/*" multiple disabled={saving} onChange={(e) => setFiles(Array.from(e.target.files ?? []))} className={`${INPUT_CLASS} file:mr-3 file:rounded-lg file:border-0 file:bg-violet-600 file:px-3 file:py-1 file:text-sm file:font-semibold file:text-white`} />
      </label>
      <ImageFilesHint files={files} editing={editing} copying={copying} currentCount={source?.images.length ?? 0} />

      <button type="submit" disabled={saving} className={PRIMARY_BUTTON_CLASS}>
        {saving ? "Guardando..." : editing ? "Actualizar producto" : "Guardar producto"}
      </button>
      {(editing || copying) && (
        <button type="button" onClick={onCancelEdit} disabled={saving} className="rounded-xl border border-zinc-700 px-6 py-2.5 text-sm font-semibold text-zinc-300 transition hover:bg-zinc-800 disabled:opacity-50">
          {editing ? "Cancelar edición" : "Cancelar copia"}
        </button>
      )}
    </form>
  );
}
