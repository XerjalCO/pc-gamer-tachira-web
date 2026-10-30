"use client";
import { useState, type FormEvent } from "react";
import type { Product } from "@/data/inventario";
import type { ProductFormData } from "@/lib/adminStock";
import { useProductForm } from "@/hooks/useProductForm";
import { CARD_CLASS, INPUT_CLASS, LABEL_CLASS, PRIMARY_BUTTON_CLASS } from "./admin/adminStyles";
import { SpecsFieldset } from "./admin/SpecsFieldset";
import { ImageFilesHint } from "./admin/ImageFilesHint";

type Props = {
  /** Producto en edición; si no se pasa, el formulario crea uno nuevo */
  productToEdit?: Product | null;
  /** Stock actual del producto en edición */
  initialStock?: number;
  /** Debe lanzar un Error si falla; el formulario solo se limpia si se resuelve */
  onSubmit: (data: ProductFormData, files: File[]) => Promise<void>;
  onCancelEdit?: () => void;
};

export function AdminProductForm({ productToEdit, initialStock, onSubmit, onCancelEdit }: Props) {
  const { fields, setters, specRows, setSpecRows, files, setFiles, fileInputRef, reset, toData } = useProductForm(productToEdit, initialStock);
  const { name, desc, price, stock, garantia } = fields;
  const { setName, setDesc, setPrice, setStock, setGarantia } = setters;
  const [saving, setSaving] = useState(false);
  const editing = Boolean(productToEdit);

  // Empaqueta los datos y delega el guardado (insert o update según el modo)
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    try {
      await onSubmit(toData(), files);
      reset();
    } catch {
      // El padre ya mostró la notificación de error; se conservan los datos para reintentar
    } finally {
      setSaving(false);
    }
  }

  return (
    <form id="product-form" onSubmit={handleSubmit} className={`${CARD_CLASS} flex flex-col gap-4 ${editing ? "ring-2 ring-amber-500/50" : ""}`}>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold">{editing ? "Editar equipo" : "Agregar equipo"}</h2>
        {editing && (
          <span className="rounded-full bg-amber-500/15 px-2.5 py-1 text-xs font-semibold text-amber-300">Modo edición</span>
        )}
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
        <input ref={fileInputRef} required={!editing} type="file" accept="image/*" multiple disabled={saving} onChange={(e) => setFiles(Array.from(e.target.files ?? []))} className={`${INPUT_CLASS} file:mr-3 file:rounded-lg file:border-0 file:bg-violet-600 file:px-3 file:py-1 file:text-sm file:font-semibold file:text-white`} />
      </label>
      <ImageFilesHint files={files} editing={editing} currentCount={productToEdit?.images.length ?? 0} />

      <button type="submit" disabled={saving} className={PRIMARY_BUTTON_CLASS}>
        {saving ? "Guardando..." : editing ? "Actualizar producto" : "Guardar producto"}
      </button>
      {editing && (
        <button type="button" onClick={onCancelEdit} disabled={saving} className="rounded-xl border border-zinc-700 px-6 py-2.5 text-sm font-semibold text-zinc-300 transition hover:bg-zinc-800 disabled:opacity-50">
          Cancelar edición
        </button>
      )}
    </form>
  );
}
