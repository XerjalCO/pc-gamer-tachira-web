"use client";
import { useCallback, useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { CartItemRow } from "@/components/CartItemRow";
import { CheckoutModal } from "@/components/CheckoutModal";
import { CartDrawerFooter } from "@/components/CartDrawerFooter";

export function CartDrawer() {
  const { items, total, count, isOpen, closeCart, clearCart } = useCart();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const closeCheckout = useCallback(() => setCheckoutOpen(false), []);

  // Pedido enviado: vacía el carrito y cierra tanto el modal como el panel
  const handleOrderSent = useCallback(() => {
    clearCart();
    setCheckoutOpen(false);
    closeCart();
  }, [clearCart, closeCart]);

  // Cierra el panel con Escape (si el checkout no está encima) y bloquea el scroll de la página
  useEffect(() => {
    if (!isOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && !checkoutOpen) closeCart();
    }
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, checkoutOpen, closeCart]);

  return (
    <>
    <div className={`fixed inset-0 z-[60] ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`} aria-hidden={!isOpen}>
      {/* Fondo oscuro: clic fuera del panel lo cierra */}
      <div
        onClick={closeCart}
        className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Carrito de compras"
        inert={!isOpen}
        className={`absolute right-0 top-0 flex h-full w-full max-w-sm flex-col border-l border-violet-600 bg-zinc-950 text-zinc-100 shadow-[0_0_40px_rgba(139,92,246,0.25)] transition-transform duration-300 ease-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <header className="flex items-center justify-between border-b border-violet-600/60 px-5 py-4">
          <h2 className="text-lg font-extrabold tracking-wide text-violet-200">
            TU CARRITO <span className="text-zinc-500">({count})</span>
          </h2>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Cerrar carrito"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-700 text-zinc-300 hover:border-violet-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-violet-400 transition"
          >
            ✕
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center text-zinc-400">
            <p className="text-lg font-semibold">Tu carrito está vacío</p>
            <p className="text-sm text-zinc-500">Agrega productos desde el catálogo.</p>
          </div>
        ) : (
          <ul className="flex flex-1 flex-col gap-3 overflow-y-auto px-5 py-4">
            {items.map((item) => (
              <CartItemRow key={item.product.name} item={item} />
            ))}
          </ul>
        )}

        <CartDrawerFooter
          total={total}
          isEmpty={items.length === 0}
          onCheckout={() => setCheckoutOpen(true)}
          onClear={clearCart}
        />
      </aside>
    </div>

    {isOpen && checkoutOpen && (
      <CheckoutModal items={items} totalUsd={total} onClose={closeCheckout} onSuccess={handleOrderSent} />
    )}
    </>
  );
}
