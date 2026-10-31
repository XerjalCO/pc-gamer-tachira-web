"use client";
import { useCallback, useEffect, useState } from "react";
import { PUBLIC_PRODUCT_COLUMNS, supabase } from "@/lib/supabase";
import type { Product } from "@/data/inventario";

/** Obtiene el catálogo desde la tabla products de Supabase; `reload` vuelve a consultarlo */
export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;

    supabase
      .from("products")
      .select(PUBLIC_PRODUCT_COLUMNS)
      .order("name")
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          setError(error.message);
        } else {
          setError(null);
          // numeric de Postgres puede llegar como string: se normaliza a number
          setProducts(
            (data ?? []).map((p) => ({
              ...p,
              price: Number(p.price),
              categoria: p.categoria ?? "",
            }))
          );
        }
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [version]);

  // Fuerza una nueva consulta (ej. tras crear o eliminar un producto)
  const reload = useCallback(() => setVersion((v) => v + 1), []);

  return { products, loading, error, reload };
}
