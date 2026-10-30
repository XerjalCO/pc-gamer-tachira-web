"use client";
import { useEffect, useState } from "react";
import { USDT_RATE_ENDPOINT } from "@/data/pagos";

/** Tasa de respaldo (Bs por USDT) si la API no responde, para que la tienda siga funcionando */
const FALLBACK_USDT_RATE = 990.0;

type UsdtRateState = { rate: number; loading: boolean; error: string | null };

// Extrae `price` del JSON de la API; devuelve null si no es un número válido
function parseRate(data: unknown): number | null {
  if (typeof data !== "object" || data === null || !("price" in data)) return null;
  const value = Number(data.price);
  return Number.isFinite(value) && value > 0 ? value : null;
}

// Obtiene la tasa P2P USDT/VES de Binance; si falla usa FALLBACK_USDT_RATE y reporta el error
export function useUsdtRate(): UsdtRateState {
  const [state, setState] = useState<UsdtRateState>({ rate: FALLBACK_USDT_RATE, loading: true, error: null });

  useEffect(() => {
    const controller = new AbortController();

    async function fetchRate() {
      try {
        const res = await fetch(USDT_RATE_ENDPOINT, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const rate = parseRate(await res.json());
        if (rate === null) throw new Error("Respuesta sin precio válido");
        setState({ rate, loading: false, error: null });
      } catch (err) {
        if (controller.signal.aborted) return;
        const message = err instanceof Error ? err.message : "Error desconocido";
        setState({ rate: FALLBACK_USDT_RATE, loading: false, error: message });
      }
    }

    fetchRate();
    return () => controller.abort();
  }, []);

  return state;
}
