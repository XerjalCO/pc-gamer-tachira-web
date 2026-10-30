"use client";
import type { Product } from "@/data/inventario";
import { useCart } from "@/context/CartContext";

export function AddToCartButton({
  product,
  onAdded,
}: {
  product: Product;
  onAdded?: () => void;
}) {
  const { addItem, openCart } = useCart();

  // Agrega el producto al carrito, cierra el modal y muestra el panel lateral
  function handleClick() {
    addItem(product);
    onAdded?.();
    openCart();
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="mt-1 flex w-full items-center justify-center gap-2.5 rounded-xl bg-violet-600 px-6 py-4 text-base font-bold text-white shadow-[0_0_14px_rgba(139,92,246,0.45)] transition-transform duration-150 hover:scale-105 hover:bg-violet-500 active:scale-100"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5 shrink-0"
        aria-hidden="true"
      >
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
      Agregar al Carrito
    </button>
  );
}
