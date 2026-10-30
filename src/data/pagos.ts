/** API pública con la tasa P2P USDT/VES de Binance (campo `price`). No envía cabeceras CORS: se consulta desde el servidor */
export const USDT_API_URL = "https://fx.vexwallet.co/api/v1/fx/latest?pair=USDT/VES&source=binance";

/** Ruta interna que reenvía la respuesta de USDT_API_URL al navegador */
export const USDT_RATE_ENDPOINT = "/api/usdt-rate";

export const PAYMENT_METHODS = ["Pago Móvil", "Efectivo USD", "Binance Pay"] as const;

export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

/** Datos de Pago Móvil del negocio — reemplazar por los reales */
export const PAGO_MOVIL_INFO = {
  banco: "VENEZUELA",
  cedula: "V-21002257",
  telefono: "0424-7199760",
  qrSrc: "/qr-pago-movil.jpg",
} as const;
