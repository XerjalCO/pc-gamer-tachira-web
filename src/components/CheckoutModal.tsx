"use client";
import { useEffect } from "react";
import type { CartItem } from "@/context/cartReducer";
import { useUsdtRate } from "@/hooks/useUsdtRate";
import { buildOrderMessage, buildWhatsAppUrl, type OrderDetails } from "@/lib/whatsappOrder";
import { CheckoutSummary } from "@/components/CheckoutSummary";
import { CheckoutForm } from "@/components/CheckoutForm";

type Props = {
  items: CartItem[];
  totalUsd: number;
  onClose: () => void;
  onSuccess: () => void;
};

// Debe montarse solo cuando está abierto: así la tasa se consulta y el formulario se reinicia en cada apertura
export function CheckoutModal({ items, totalUsd, onClose, onSuccess }: Props) {
  const { rate, loading, error } = useUsdtRate();

  // Cierra el modal con Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Genera el mensaje del pedido, abre WhatsApp en otra pestaña y notifica el éxito
  function handleSubmit(details: OrderDetails) {
    const message = buildOrderMessage({ ...details, items, totalUsd, rate });
    window.open(buildWhatsAppUrl(message), "_blank", "noopener,noreferrer");
    onSuccess();
  }

  return (
    <div
      role="presentation"
      onClick={onClose}
      className="fixed inset-0 z-[70] flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-4"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-title"
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl border border-violet-600 bg-zinc-950 text-zinc-100 [color-scheme:dark] shadow-[0_0_40px_rgba(139,92,246,0.25)] sm:rounded-2xl"
      >
        <header className="flex items-center justify-between border-b border-violet-600/60 px-5 py-4">
          <h2 id="checkout-title" className="text-lg font-extrabold tracking-wide text-violet-200">
            FINALIZAR PEDIDO
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar pago"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-700 text-zinc-300 hover:border-violet-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-violet-400 transition"
          >
            ✕
          </button>
        </header>

        <div className="flex flex-col gap-5 overflow-y-auto px-5 py-5">
          <CheckoutSummary items={items} totalUsd={totalUsd} rate={rate} loading={loading} isFallback={error !== null} />
          <CheckoutForm disabled={loading || items.length === 0} onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
}
