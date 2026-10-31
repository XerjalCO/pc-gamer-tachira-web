"use client";
import { useCallback, useEffect, useState } from "react";
import type { Product } from "@/data/inventario";

type ProductRow = Omit<Product, "price" | "categoria"> & {
  price: number | string;
  categoria?: string | null;
};

/** Obtiene el catálogo desde /api/products; `reload` vuelve a consultarlo */
export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;

    // La consulta directa con la anon key falla: no hay GRANT de "categoria"
    fetch("/api/products")
      .then(async (response) => {
        const body: unknown = await response.json().catch(() => null);
        if (!response.ok) {
          const message =
            body && typeof body === "object" && "error" in body && typeof body.error === "string"
              ? body.error
              : "No se pudieron cargar los productos";
          throw new Error(message);
        }
        return (Array.isArray(body) ? body : []) as ProductRow[];
      })
      .then((data) => {
        if (cancelled) return;
        setError(null);
        // numeric de Postgres puede llegar como string: se normaliza a number
        setProducts(
          data.map((p) => ({
            ...p,
            price: Number(p.price),
            categoria: p.categoria ?? "",
          }))
        );
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "No se pudieron cargar los productos");
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
