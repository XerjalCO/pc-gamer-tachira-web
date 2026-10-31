import type { Product } from "@/data/inventario";

type Props = {
  product: Product;
  deleting: boolean;
  editing: boolean;
  toggling: boolean;
  busy: boolean;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onDuplicate: (product: Product) => void;
  onToggleVisible: (product: Product) => void;
};

const BTN =
  "rounded-lg border px-3 py-1.5 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-40";

/** Acciones de cada fila: editar, duplicar, ocultar o mostrar, y eliminar */
export function AdminRowActions({ product, deleting, editing, toggling, busy, onEdit, onDelete, onDuplicate, onToggleVisible }: Props) {
  const hidden = product.is_visible === false;
  return (
    <td className="py-3 text-right">
      <div className="flex flex-nowrap justify-end gap-2 whitespace-nowrap">
        <button type="button" onClick={() => onEdit(product)} disabled={busy} className={`${BTN} border-amber-500/40 text-amber-300 hover:bg-amber-500/10`}>
          {editing ? "Editando" : "Editar"}
        </button>
        <button type="button" onClick={() => onDuplicate(product)} disabled={busy} className={`${BTN} border-violet-500/40 text-violet-300 hover:bg-violet-500/10`}>
          Duplicar
        </button>
        <button
          type="button"
          onClick={() => onToggleVisible(product)}
          disabled={busy}
          className={`${BTN} ${hidden ? "border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10" : "border-zinc-600 text-zinc-300 hover:bg-zinc-800"}`}
        >
          {toggling ? "Guardando..." : hidden ? "Mostrar" : "Ocultar"}
        </button>
        <button type="button" onClick={() => onDelete(product)} disabled={busy} className={`${BTN} border-red-500/40 text-red-300 hover:bg-red-500/10`}>
          {deleting ? "Eliminando..." : "Eliminar"}
        </button>
      </div>
    </td>
  );
}
