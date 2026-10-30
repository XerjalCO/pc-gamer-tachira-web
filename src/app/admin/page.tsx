"use client";
import { useCallback, useState } from "react";
import type { Product } from "@/data/inventario";
import { useProducts } from "@/hooks/useProducts";
import { useAdminStock } from "@/hooks/useAdminStock";
import { createProduct, deleteProduct, updateProduct } from "@/lib/adminProducts";
import { saveStock, type ProductFormData } from "@/lib/adminStock";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminProductTable } from "@/components/admin/AdminProductTable";
import { AdminToast, type ToastMessage } from "@/components/admin/AdminToast";
import { AdminProductForm } from "@/components/AdminProductForm";

export default function AdminPage() {
  // La contraseña solo vive en memoria: se envía al servidor en cada llamada de stock
  const [adminPass, setAdminPass] = useState<string | null>(null);
  if (!adminPass) return <AdminLogin onSuccess={setAdminPass} />;
  return <AdminDashboard adminPass={adminPass} onLogout={() => setAdminPass(null)} />;
}

function AdminDashboard({ adminPass, onLogout }: { adminPass: string; onLogout: () => void }) {
  const { products, loading, error, reload } = useProducts();
  const { stockById, reload: reloadStock } = useAdminStock(adminPass);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Product | null>(null);
  const closeToast = useCallback(() => setToast(null), []);

  // Entra en modo edición y lleva el formulario a la vista
  function handleEdit(product: Product) {
    setEditing(product);
    document.getElementById("product-form")?.scrollIntoView({ behavior: "smooth" });
  }

  // Guarda el producto (insert o update) y luego su stock por la ruta admin; relanza el error para no limpiar el formulario
  async function handleSave({ stock, ...data }: ProductFormData, files: File[]) {
    let id: string;
    try {
      if (editing) await updateProduct(editing, data, files);
      id = editing ? editing.id : await createProduct(data, files);
    } catch (err) {
      setToast({ type: "error", text: err instanceof Error ? err.message : "Error al guardar." });
      throw err;
    }
    // El producto ya quedó guardado: si falla el stock no se relanza, para no duplicarlo al reintentar
    const stockError = await saveStock(adminPass, id, stock).then(() => null, (err: Error) => err.message);
    setToast(stockError
      ? { type: "error", text: `"${data.name}" se guardó, pero no su stock: ${stockError}. Edítalo para reintentar.` }
      : { type: "success", text: `"${data.name}" se ${editing ? "actualizó" : "guardó"} correctamente.` });
    setEditing(null);
    reload();
    reloadStock();
  }

  // Pide confirmación y elimina el producto de la base de datos
  async function handleDelete(product: Product) {
    if (!confirm(`¿Eliminar "${product.name}"? Esta acción no se puede deshacer.`)) return;
    setDeletingId(product.id);
    try {
      await deleteProduct(product);
      if (editing?.id === product.id) setEditing(null);
      setToast({ type: "success", text: `"${product.name}" fue eliminado.` });
      reload();
    } catch (err) {
      setToast({ type: "error", text: err instanceof Error ? err.message : "Error al eliminar." });
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 font-sans text-zinc-100">
      <AdminHeader onLogout={onLogout} />

      <main className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[minmax(0,1fr)_420px]">
        <AdminProductTable
          products={products}
          stockById={stockById}
          loading={loading}
          error={error}
          deletingId={deletingId}
          editingId={editing?.id ?? null}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
        <AdminProductForm
          key={editing?.id ?? "new"}
          productToEdit={editing}
          initialStock={editing ? stockById[editing.id] : undefined}
          onSubmit={handleSave}
          onCancelEdit={() => setEditing(null)}
        />
      </main>

      <AdminToast toast={toast} onClose={closeToast} />
    </div>
  );
}
