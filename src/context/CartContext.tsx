"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from "react";
import type { Product } from "@/data/inventario";
import { cartReducer, getCartCount, getCartTotal, type CartItem } from "@/context/cartReducer";

type CartContextValue = {
  items: CartItem[];
  total: number;
  count: number;
  isOpen: boolean;
  addItem: (product: Product) => void;
  removeItem: (name: string) => void;
  increaseQty: (name: string) => void;
  decreaseQty: (name: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "mi-tienda-pcs:cart";

// Lee el carrito guardado en localStorage (devuelve [] en el servidor o si los datos son inválidos)
function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as CartItem[]) : [];
  } catch {
    return [];
  }
}

// Guarda el carrito en localStorage (no hace nada en el servidor)
function saveCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Almacenamiento lleno o bloqueado: el carrito sigue funcionando en memoria
  }
}

// Proveedor global: guarda los items del carrito y si el panel lateral está abierto
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, []);
  const [isOpen, setIsOpen] = useState(false);
  const hydrated = useRef(false);

  // Restaura el carrito guardado tras montar en el cliente (evita desajustes de hidratación SSR)
  useEffect(() => {
    const saved = loadCart();
    if (saved.length > 0) dispatch({ type: "hydrate", items: saved });
  }, []);

  // Sincroniza localStorage cada vez que cambian los items (omite el primer render vacío)
  useEffect(() => {
    if (!hydrated.current) {
      hydrated.current = true;
      return;
    }
    saveCart(items);
  }, [items]);

  const addItem = useCallback((product: Product) => dispatch({ type: "add", product }), []);
  const removeItem = useCallback((name: string) => dispatch({ type: "remove", name }), []);
  const increaseQty = useCallback((name: string) => dispatch({ type: "increase", name }), []);
  const decreaseQty = useCallback((name: string) => dispatch({ type: "decrease", name }), []);
  const clearCart = useCallback(() => dispatch({ type: "clear" }), []);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      total: getCartTotal(items),
      count: getCartCount(items),
      isOpen,
      addItem,
      removeItem,
      increaseQty,
      decreaseQty,
      clearCart,
      openCart,
      closeCart,
    }),
    [items, isOpen, addItem, removeItem, increaseQty, decreaseQty, clearCart, openCart, closeCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// Hook para acceder al carrito desde cualquier componente cliente
export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}
