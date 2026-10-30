type Props = {
  total: number;
  isEmpty: boolean;
  onCheckout: () => void;
  onClear: () => void;
};

export function CartDrawerFooter({ total, isEmpty, onCheckout, onClear }: Props) {
  return (
    <footer className="flex flex-col gap-3 border-t border-zinc-800 px-5 py-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Total</span>
        <span className="text-2xl font-bold text-white">${total.toLocaleString("en-US")}</span>
      </div>
      <button
        type="button"
        disabled={isEmpty}
        onClick={onCheckout}
        className="w-full rounded-xl bg-violet-600 px-6 py-3.5 text-base font-bold text-white shadow-[0_0_14px_rgba(139,92,246,0.45)] transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Ir a Pagar
      </button>
      {!isEmpty && (
        <button type="button" onClick={onClear} className="text-sm text-zinc-500 hover:text-red-400 transition">
          Vaciar carrito
        </button>
      )}
    </footer>
  );
}
