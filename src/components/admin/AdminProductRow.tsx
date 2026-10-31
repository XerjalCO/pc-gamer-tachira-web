import type { Product } from "@/data/inventario";
import { formatUsd } from "@/lib/currency";
import { AdminRowActions } from "./AdminRowActions";
import { StockBadge } from "./StockBadge";

type Props = {
  product: Product;
  stock?: number;
  deleting: boolean;
  editing: boolean;
  toggling: boolean;
  busy: boolean;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onDuplicate: (product: Product) => void;
  onToggleVisible: (product: Product) => void;
};

/** Fila del inventario. Los ocultos se atenúan y muestran la etiqueta Oculto. */
export function AdminProductRow({ product, stock, deleting, editing, toggling, busy, onEdit, onDelete, onDuplicate, onToggleVisible }: Props) {
  const hidden = product.is_visible === false;
  return (
    <tr className={editing ? "bg-amber-500/5" : hidden ? "opacity-60 hover:bg-zinc-800/40" : "hover:bg-zinc-800/40"}>
      <td className="py-3 pr-4">
        {product.images[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.images[0]} alt={product.name} className="h-12 w-12 rounded-lg bg-zinc-800 object-contain" />
        ) : (
          <div className="h-12 w-12 rounded-lg bg-zinc-800" />
        )}
      </td>
      <td className="py-3 pr-4">
        <p className="font-semibold text-zinc-100">
          {product.name}
          {hidden && <span className="ml-2 rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Oculto</span>}
        </p>
        <p className="line-clamp-1 text-xs text-zinc-500">{product.desc}</p>
      </td>
      <td className="py-3 pr-4 font-mono text-violet-300">{formatUsd(product.price)}</td>
      <td className="whitespace-nowrap py-3 pr-4"><StockBadge stock={stock} /></td>
      <AdminRowActions
        product={product}
        deleting={deleting}
        editing={editing}
        toggling={toggling}
        busy={busy}
        onEdit={onEdit}
        onDelete={onDelete}
        onDuplicate={onDuplicate}
        onToggleVisible={onToggleVisible}
      />
    </tr>
  );
}
