"use client";
import { useCallback, useEffect, useState } from "react";
import { fetchStock } from "@/lib/adminStock";

/** Carga el stock de todos los productos desde la ruta admin; `reload` vuelve a consultarlo */
export function useAdminStock(adminPass: string) {
  const [stockById, setStockById] = useState<Record<string, number>>({});
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetchStock(adminPass)
      .then((data) => !cancelled && setStockById(data))
      .catch(() => !cancelled && setStockById({}));
    return () => {
      cancelled = true;
    };
  }, [adminPass, version]);

  // Fuerza una nueva consulta (ej. tras guardar un producto)
  const reload = useCallback(() => setVersion((v) => v + 1), []);

  return { stockById, reload };
}
