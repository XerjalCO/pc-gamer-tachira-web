"use client";
import { useState } from "react";
import type { Product } from "@/data/inventario";
import { CARD_CLASS, INPUT_CLASS } from "./adminStyles";
import { AdminProductRow } from "./AdminProductRow";

type Props = {
  products: Product[];
  stockById: Record<string, number>;
  loading: boolean;
  error: string | null;
  deletingId: string | null;
  togglingId: string | null;
  editingId: string | null;
  onDelete: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDuplicate: (product: Product) => void;
  onToggleVisible: (product: Product) => void;
};

export function AdminProductTable(props: Props) {
  const { products, stockById, loading, error, deletingId, togglingId, editingId } = props;
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  // Filtra el inventario por nombre mientras se escribe
  const shown = q ? products.filter((p) => p.name.toLowerCase().includes(q)) : products;
  const busy = deletingId !== null || togglingId !== null;

  return (
    <section className={CARD_CLASS}>
      <h2 className="mb-4 text-lg font-bold">
        Inventario <span className="text-sm font-normal text-zinc-500">({shown.length})</span>
      </h2>
      <label className="mb-4 block">
        <span className="sr-only">Buscar equipo por nombre</span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nombre del equipo"
          className={INPUT_CLASS}
        />
      </label>

      {error && <p className="text-sm text-red-400">Error al cargar productos: {error}</p>}
      {loading && <p className="text-sm text-zinc-400">Cargando productos...</p>}
      {!loading && !error && products.length === 0 && <p className="text-sm text-zinc-400">No hay productos registrados.</p>}
      {!loading && !error && products.length > 0 && shown.length === 0 && (
        <p className="text-sm text-zinc-400">Ningún equipo coincide con la búsqueda.</p>
      )}

      {shown.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-zinc-800 text-xs uppercase tracking-widest text-zinc-500">
              <tr>
                <th className="py-3 pr-4">Imagen</th>
                <th className="py-3 pr-4">Nombre</th>
                <th className="py-3 pr-4">Precio</th>
                <th className="py-3 pr-4">Stock</th>
                <th className="py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {shown.map((p) => (
                <AdminProductRow
                  key={p.id}
                  product={p}
                  stock={stockById[p.id]}
                  deleting={deletingId === p.id}
                  editing={editingId === p.id}
                  toggling={togglingId === p.id}
                  busy={busy}
                  onEdit={props.onEdit}
                  onDelete={props.onDelete}
                  onDuplicate={props.onDuplicate}
                  onToggleVisible={props.onToggleVisible}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
