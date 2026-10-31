"use client";
import { useEffect, useRef, useState } from "react";
import type { Product } from "@/data/inventario";
import { useProducts } from "@/hooks/useProducts";
import { TopBar } from "@/components/TopBar";
import { HeroSection } from "@/components/HeroSection";
import { CatalogGrid } from "@/components/CatalogGrid";
import { ProductModal } from "@/components/ProductModal";
export default function Home() {
  const { products, loading, error } = useProducts();
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalProduct, setModalProduct] = useState<Product | null>(null);
  const historyPushed = useRef(false);

  // Deja el modal cerrado y limpia el producto tras la transición
  function dismissModal() {
    setModalOpen(false);
    setTimeout(() => setModalProduct(null), 200);
  }

  // Filtra por nombre, descripción o categoría según el texto ingresado
  const filteredProducts = products.filter((prod) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      prod.name.toLowerCase().includes(q) ||
      (prod.desc ?? "").toLowerCase().includes(q) ||
      (prod.categoria ?? "").toLowerCase().includes(q)
    );
  });

  // Abre el detalle y empuja el historial para que "atrás" no salga de la página
  function openModal(prod: Product) {
    setModalProduct(prod);
    setModalOpen(true);
    if (historyPushed.current) return;
    window.history.pushState(null, "", window.location.href);
    historyPushed.current = true;
  }

  // Cierra desde la UI y deshace la entrada de historial creada al abrir
  function closeModal() {
    dismissModal();
    if (!historyPushed.current) return;
    historyPushed.current = false;
    window.history.back();
  }

  // El botón atrás cierra el modal sin navegar fuera de la tienda
  useEffect(() => {
    function onPopState(e: PopStateEvent) {
      if (!historyPushed.current) return;
      e.preventDefault();
      historyPushed.current = false;
      setModalOpen(false);
      setTimeout(() => setModalProduct(null), 200);
    }
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  return (
    <div className="bg-zinc-950 min-h-screen flex flex-col font-sans text-zinc-100">
      <header className="w-full bg-zinc-950">
        <TopBar />
        <HeroSection search={search} onSearchChange={setSearch} />
      </header>

      <main className="flex-1 w-full flex flex-col items-center px-4 py-10">
        <CatalogGrid
          products={filteredProducts}
          loading={loading}
          error={error}
          onSelect={openModal}
        />
      </main>

      <ProductModal open={modalOpen} product={modalProduct} onClose={closeModal} />

      <footer className="w-full text-center py-8 text-zinc-500 text-sm bg-zinc-950 mt-auto">
        &copy; {new Date().getFullYear()} PCGTachira - Todos los derechos reservados.
      </footer>
    </div>
  );
}
