import type { Product } from "@/data/inventario";
import { ProductCard } from "@/components/ProductCard";
import { ProductCardSkeleton } from "@/components/ProductCardSkeleton";

const SKELETON_COUNT = 3;

/** Muestra el catálogo según su estado: cargando, error, vacío o lista de productos */
export function CatalogGrid({
  products,
  loading,
  error,
  onSelect,
}: {
  products: Product[];
  loading: boolean;
  error: string | null;
  onSelect: (product: Product) => void;
}) {
  let content;
  if (loading) {
    content = Array.from({ length: SKELETON_COUNT }, (_, i) => <ProductCardSkeleton key={i} />);
  } else if (error) {
    content = (
      <div className="col-span-full text-red-400 text-lg py-10 text-center">
        No se pudo cargar el catálogo. Intenta de nuevo más tarde.
      </div>
    );
  } else if (products.length === 0) {
    content = (
      <div className="col-span-full text-zinc-400 text-lg py-10 text-center">
        No se encontraron productos.
      </div>
    );
  } else {
    content = products.map((prod) => (
      <ProductCard key={prod.id} product={prod} onSelect={onSelect} />
    ));
  }

  return (
    <section
      id="catalogo"
      aria-busy={loading}
      className="grid grid-cols-1 md:grid-cols-3 gap-7 w-full max-w-5xl"
    >
      {content}
    </section>
  );
}
