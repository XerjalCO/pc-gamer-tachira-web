import type { Product } from "@/data/inventario";

export type CartItem = {
  product: Product;
  quantity: number;
};

export type CartAction =
  | { type: "add"; product: Product }
  | { type: "remove"; name: string }
  | { type: "increase"; name: string }
  | { type: "decrease"; name: string }
  | { type: "clear" }
  | { type: "hydrate"; items: CartItem[] };

// Suma (o resta) una cantidad al producto indicado; elimina el item si llega a 0
function changeQuantity(items: CartItem[], name: string, delta: number): CartItem[] {
  return items
    .map((item) =>
      item.product.name === name
        ? { ...item, quantity: item.quantity + delta }
        : item
    )
    .filter((item) => item.quantity > 0);
}

// Aplica cada acción del carrito sobre la lista de items y devuelve el nuevo estado
export function cartReducer(items: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case "add": {
      const exists = items.some((i) => i.product.name === action.product.name);
      if (exists) return changeQuantity(items, action.product.name, 1);
      return [...items, { product: action.product, quantity: 1 }];
    }
    case "remove":
      return items.filter((i) => i.product.name !== action.name);
    case "increase":
      return changeQuantity(items, action.name, 1);
    case "decrease":
      return changeQuantity(items, action.name, -1);
    case "clear":
      return [];
    case "hydrate":
      return action.items;
  }
}

// Calcula el total en dólares (precio × cantidad de cada item)
export function getCartTotal(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
}

// Cuenta la cantidad total de unidades en el carrito
export function getCartCount(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.quantity, 0);
}
