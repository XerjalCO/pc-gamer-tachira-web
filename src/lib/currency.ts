// Formatea un monto en dólares (ej. "$1,250.00")
export function formatUsd(amount: number): string {
  return `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// Formatea un monto en bolívares con notación venezolana (ej. "Bs. 56.875,00")
export function formatVes(amount: number): string {
  return `Bs. ${amount.toLocaleString("es-VE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// Calcula el precio en Bs a partir del monto en USD y la tasa USDT/VES
export function toVes(usd: number, rate: number): number {
  return usd * rate;
}
