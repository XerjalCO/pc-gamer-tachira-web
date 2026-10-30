"use client";
import { useCart } from "@/context/CartContext";

export function CartIcon() {
  const { count, openCart } = useCart();

  return (
    <button
      type="button"
      onClick={openCart}
      aria-label={`Abrir carrito (${count} productos)`}
      className="relative inline-flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-violet-500/50 bg-zinc-900/80 text-zinc-100 hover:border-cyan-400/70 hover:text-cyan-300 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-violet-400 transition"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5 sm:h-[1.35rem] sm:w-[1.35rem]"
        aria-hidden="true"
      >
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
      {count > 0 && (
        <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-violet-600 px-1 text-[11px] font-bold text-white shadow-[0_0_10px_rgba(139,92,246,0.6)]">
          {count}
        </span>
      )}
    </button>
  );
}
