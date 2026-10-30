import type { CartItem } from "@/context/cartReducer";
import { formatUsd, formatVes, toVes } from "@/lib/currency";

type Props = {
  items: CartItem[];
  totalUsd: number;
  rate: number;
  loading: boolean;
  isFallback: boolean;
};

export function CheckoutSummary({ items, totalUsd, rate, loading, isFallback }: Props) {
  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
      <h3 className="mb-3 text-center text-xs font-semibold uppercase tracking-widest text-zinc-500">Resumen del pedido</h3>
      <ul className="flex flex-col gap-1.5 text-sm">
        {items.map(({ product, quantity }) => (
          <li key={product.name} className="flex justify-between gap-3">
            <span className="min-w-0 truncate text-zinc-300">
              {quantity} × {product.name}
            </span>
            <span className="shrink-0 font-semibold text-zinc-200">{formatUsd(product.price * quantity)}</span>
          </li>
        ))}
      </ul>

      <div className="mt-4 grid grid-cols-2 overflow-hidden rounded-xl border border-zinc-800">
        <div className="flex flex-col items-center gap-1 px-2 py-3">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">Total USD</span>
          <span className="text-lg font-bold text-white sm:text-xl">{formatUsd(totalUsd)}</span>
        </div>
        <div className="flex flex-col items-center gap-1 border-l border-zinc-800 px-2 py-3">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">Total VES</span>
          <span className="text-lg font-bold text-violet-200 sm:text-xl">
            {loading ? <span className="animate-pulse text-zinc-500">Cargando…</span> : formatVes(toVes(totalUsd, rate))}
          </span>
        </div>
      </div>
      {!loading && (
        <p className="mt-2 text-center text-xs text-zinc-500">
          Tasa del día (Binance USDT): <span className="font-semibold text-zinc-300">{formatVes(rate)}</span>
          {isFallback && <span className="block text-amber-400/80">Tasa referencial: no se pudo consultar Binance</span>}
        </p>
      )}
    </section>
  );
}
