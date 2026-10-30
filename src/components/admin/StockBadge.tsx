import { LOW_STOCK_THRESHOLD } from "@/data/admin";

// Elige el color según la cantidad: rojo agotado, ámbar bajo, verde disponible
function stockClass(stock: number): string {
  if (stock <= 0) return "bg-red-500/15 text-red-300";
  if (stock <= LOW_STOCK_THRESHOLD) return "bg-amber-500/15 text-amber-300";
  return "bg-emerald-500/15 text-emerald-300";
}

/** Indicador de stock del panel admin; muestra "…" mientras aún no se ha cargado */
export function StockBadge({ stock }: { stock?: number }) {
  if (stock === undefined) return <span className="text-xs text-zinc-500">…</span>;
  return (
    <span className={`inline-block rounded-full px-2.5 py-1 font-mono text-xs font-semibold ${stockClass(stock)}`}>
      {stock <= 0 ? "Agotado" : `${stock} ud.`}
    </span>
  );
}
