"use client";
import { useCallback, useState } from "react";
import type { Product } from "@/data/inventario";
import { createProduct, deleteProduct, setProductVisibility, updateProduct } from "@/lib/adminProducts";
import { saveStock, type ProductFormData } from "@/lib/adminStock";
import type { ToastMessage } from "@/components/admin/AdminToast";

/** Guardar, eliminar, ocultar y preparar una copia en el formulario de alta */
export function useAdminMutations(adminPass: string, reload: () => void, reloadStock: () => void) {
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Product | null>(null);
  const [draft, setDraft] = useState<Product | null>(null);
  const closeToast = useCallback(() => setToast(null), []);

  function focusForm() {
    document.getElementById("product-form")?.scrollIntoView({ behavior: "smooth" });
  }

  function handleEdit(product: Product) {
    setDraft(null);
    setEditing(product);
    focusForm();
  }

  // Precarga el alta con los datos del equipo y un nombre nuevo, sin conservar el id
  function handleDuplicate(product: Product) {
    setEditing(null);
    setDraft({ ...product, name: `${product.name} (copia)` });
    focusForm();
  }

  function cancelForm() {
    setEditing(null);
    setDraft(null);
  }

  async function handleSave({ stock, ...data }: ProductFormData, files: File[], reuseImages?: string[]) {
    let id: string;
    try {
      if (editing) await updateProduct(adminPass, editing, data, files);
      id = editing ? editing.id : await createProduct(adminPass, data, files, reuseImages);
    } catch (err) {
      setToast({ type: "error", text: err instanceof Error ? err.message : "Error al guardar." });
      throw err;
    }
    const stockError = await saveStock(adminPass, id, stock).then(() => null, (err: Error) => err.message);
    const verb = editing ? "actualizó" : "guardó";
    setToast(stockError
      ? { type: "error", text: `"${data.name}" se guardó, pero no su stock: ${stockError}. Edítalo para reintentar.` }
      : { type: "success", text: `"${data.name}" se ${verb} correctamente.` });
    cancelForm();
    reload();
    reloadStock();
  }

  async function handleDelete(product: Product) {
    if (!confirm(`¿Eliminar "${product.name}"? Esta acción no se puede deshacer.`)) return;
    setDeletingId(product.id);
    try {
      await deleteProduct(adminPass, product);
      if (editing?.id === product.id) setEditing(null);
      if (draft?.id === product.id) setDraft(null);
      setToast({ type: "success", text: `"${product.name}" fue eliminado.` });
      reload();
    } catch (err) {
      setToast({ type: "error", text: err instanceof Error ? err.message : "Error al eliminar." });
    } finally {
      setDeletingId(null);
    }
  }

  // Pone is_visible en false para ocultarlo, o en true para devolverlo al catálogo
  async function handleToggleVisible(product: Product) {
    const isVisible = product.is_visible === false;
    setTogglingId(product.id);
    try {
      await setProductVisibility(adminPass, product.id, isVisible);
      const text = isVisible ? `"${product.name}" volvió al catálogo.` : `"${product.name}" quedó oculto en la tienda.`;
      setToast({ type: "success", text });
      reload();
    } catch (err) {
      setToast({ type: "error", text: err instanceof Error ? err.message : "Error al cambiar la visibilidad." });
    } finally {
      setTogglingId(null);
    }
  }

  return {
    toast, closeToast, deletingId, togglingId, editing, draft,
    handleEdit, handleDuplicate, handleSave, handleDelete, handleToggleVisible, cancelForm,
  };
}
