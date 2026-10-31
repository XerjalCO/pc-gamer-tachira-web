"use client";
import { useProducts } from "@/hooks/useProducts";
import { useAdminStock } from "@/hooks/useAdminStock";
import { useAdminMutations } from "@/hooks/useAdminMutations";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminProductTable } from "@/components/admin/AdminProductTable";
import { AdminToast } from "@/components/admin/AdminToast";
import { AdminProductForm } from "@/components/AdminProductForm";

export function AdminDashboard({ adminPass, onLogout }: { adminPass: string; onLogout: () => void }) {
  const { products, loading, error, reload } = useProducts(adminPass);
  const { stockById, reload: reloadStock } = useAdminStock(adminPass);
  const m = useAdminMutations(adminPass, reload, reloadStock);
  const activeId = m.editing?.id ?? m.draft?.id;

  return (
    <div className="min-h-screen bg-zinc-950 font-sans text-zinc-100">
      <AdminHeader onLogout={onLogout} />
      <main className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[minmax(0,1fr)_420px]">
        <AdminProductTable
          products={products}
          stockById={stockById}
          loading={loading}
          error={error}
          deletingId={m.deletingId}
          togglingId={m.togglingId}
          editingId={m.editing?.id ?? null}
          onDelete={m.handleDelete}
          onEdit={m.handleEdit}
          onDuplicate={m.handleDuplicate}
          onToggleVisible={m.handleToggleVisible}
        />
        <AdminProductForm
          key={m.editing?.id ?? (m.draft ? `copy-${m.draft.id}` : "new")}
          productToEdit={m.editing}
          seedProduct={m.editing ? null : m.draft}
          initialStock={activeId ? stockById[activeId] : undefined}
          onSubmit={m.handleSave}
          onCancelEdit={m.cancelForm}
        />
      </main>
      <AdminToast toast={m.toast} onClose={m.closeToast} />
    </div>
  );
}
