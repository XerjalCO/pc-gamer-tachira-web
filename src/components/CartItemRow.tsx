"use client";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import type { CartItem } from "@/context/cartReducer";

const QTY_BUTTON_CLASS =
  "flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-700 text-zinc-200 hover:border-violet-500 hover:text-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-400 transition";

export function CartItemRow({ item }: { item: CartItem }) {
  const { increaseQty, decreaseQty, removeItem } = useCart();
  const { product, quantity } = item;

  return (
    <li className="flex gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-3">
      <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl bg-white">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          style={{ objectFit: "contain" }}
          className="p-1.5"
          sizes="80px"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-bold leading-tight text-white">{product.name}</h3>
          <button
            type="button"
            onClick={() => removeItem(product.name)}
            aria-label={`Eliminar ${product.name} del carrito`}
            className="shrink-0 text-xs text-zinc-500 hover:text-red-400 transition"
          >
            Eliminar
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => decreaseQty(product.name)} aria-label="Disminuir cantidad" className={QTY_BUTTON_CLASS}>
              −
            </button>
            <span className="w-6 text-center text-sm font-semibold">{quantity}</span>
            <button type="button" onClick={() => increaseQty(product.name)} aria-label="Aumentar cantidad" className={QTY_BUTTON_CLASS}>
              +
            </button>
          </div>
          <span className="text-base font-bold text-violet-200">
            ${(product.price * quantity).toLocaleString("en-US")}
          </span>
        </div>
      </div>
    </li>
  );
}
