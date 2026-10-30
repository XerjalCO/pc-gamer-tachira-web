import type { CartItem } from "@/context/cartReducer";
import type { PaymentMethod } from "@/data/pagos";
import { WHATSAPP_NUMBER } from "@/data/inventario";
import { formatUsd, formatVes, toVes } from "@/lib/currency";

export type OrderDetails = {
  fullName: string;
  idNumber: string;
  paymentMethod: PaymentMethod;
  reference?: string;
};

type OrderMessageInput = OrderDetails & {
  items: CartItem[];
  totalUsd: number;
  rate: number;
};

// Arma el texto del pedido: saludo, productos, totales en USD/VES (tasa Binance USDT) y método de pago
export function buildOrderMessage({ items, totalUsd, rate, ...order }: OrderMessageInput): string {
  const productLines = items.map(({ product, quantity }) => `- ${quantity}x ${product.name}`);
  const refSuffix = order.paymentMethod === "Pago Móvil" && order.reference ? ` (Ref: ${order.reference})` : "";

  return [
    `Hola, soy ${order.fullName}. Quiero confirmar esta orden:`,
    ...productLines,
    `Total USD: ${formatUsd(totalUsd)}`,
    `Total VES: ${formatVes(toVes(totalUsd, rate))}`,
    `Pago: ${order.paymentMethod}${refSuffix}`,
    `Cédula/RIF: ${order.idNumber}`,
  ].join("\n");
}

// Construye el enlace wa.me con el mensaje codificado para la URL
export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
