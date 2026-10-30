"use client";
import type { Product } from "@/data/inventario";
import { formatUsd } from "@/lib/currency";
import { CARD_CLASS } from "./adminStyles";
import { StockBadge } from "./StockBadge";

type Props = {
  products: Product[];
  stockById: Record<string, number>;
  loading: boolean;
  error: string | null;
  deletingId: string | null;
  editingId: string | null;
  onDelete: (product: Product) => void;
  onEdit: (product: Product) => void;
};

export function AdminProductTable({ products, stockById, loading, error, deletingId, editingId, onDelete, onEdit }: Props) {
  return (
    <section className={CARD_CLASS}>
      <h2 className="mb-4 text-lg font-bold">
        Inventario <span className="text-sm font-normal text-zinc-500">({products.length})</span>
      </h2>

      {error && <p className="text-sm text-red-400">Error al cargar productos: {error}</p>}
      {loading && <p className="text-sm text-zinc-400">Cargando productos...</p>}
      {!loading && !error && products.length === 0 && (
        <p className="text-sm text-zinc-400">No hay productos registrados.</p>
      )}

      {products.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-zinc-800 text-xs uppercase tracking-widest text-zinc-500">
              <tr>
                <th className="py-3 pr-4">Imagen</th>
                <th className="py-3 pr-4">Nombre</th>
                <th className="py-3 pr-4">Precio</th>
                <th className="py-3 pr-4">Stock</th>
                <th className="py-3 pr-4">Garantía</th>
                <th className="py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {products.map((p) => (
                <tr key={p.id} className={editingId === p.id ? "bg-amber-500/5" : "hover:bg-zinc-800/40"}>
                  <td className="py-3 pr-4">
                    {p.images[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.images[0]} alt={p.name} className="h-12 w-12 rounded-lg bg-zinc-800 object-contain" />
                    ) : (
                      <div className="h-12 w-12 rounded-lg bg-zinc-800" />
                    )}
                  </td>
                  <td className="py-3 pr-4">
                    <p className="font-semibold text-zinc-100">{p.name}</p>
                    <p className="line-clamp-1 text-xs text-zinc-500">{p.desc}</p>
                  </td>
                  <td className="py-3 pr-4 font-mono text-violet-300">{formatUsd(p.price)}</td>
                  <td className="whitespace-nowrap py-3 pr-4"><StockBadge stock={stockById[p.id]} /></td>
                  <td className="py-3 pr-4 text-zinc-300">{p.garantia}</td>
                  <td className="space-x-2 whitespace-nowrap py-3 text-right">
                    <button
                      type="button"
                      onClick={() => onEdit(p)}
                      disabled={deletingId !== null}
                      className="rounded-lg border border-amber-500/40 px-3 py-1.5 text-xs font-semibold text-amber-300 transition hover:bg-amber-500/10 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {editingId === p.id ? "Editando" : "Editar"}
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(p)}
                      disabled={deletingId !== null}
                      className="rounded-lg border border-red-500/40 px-3 py-1.5 text-xs font-semibold text-red-300 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {deletingId === p.id ? "Eliminando..." : "Eliminar"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
