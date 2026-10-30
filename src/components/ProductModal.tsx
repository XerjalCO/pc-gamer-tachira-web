"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import type { Product } from "@/data/inventario";
import { ImageLightbox } from "@/components/ImageLightbox";
import { AddToCartButton } from "@/components/AddToCartButton";

export function ProductModal({
  open,
  onClose,
  product,
}: {
  open: boolean;
  onClose: () => void;
  product: Product | null;
}) {
  const [imgIdx, setImgIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const shownProduct = open ? product : null;
  const [prevShown, setPrevShown] = useState(shownProduct);

  // Reinicia la imagen activa cada vez que se abre un producto distinto (durante el render, sin efecto)
  if (shownProduct !== prevShown) {
    setPrevShown(shownProduct);
    setImgIdx(0);
  }

  // Cierra el modal al presionar Escape
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !product) return null;

  const safeIdx = Math.min(imgIdx, Math.max(0, product.images.length - 1));

  return (
    <>
    <div
      role="presentation"
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm transition p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-product-title"
        className="relative flex w-full max-w-md flex-col items-center bg-zinc-950 rounded-2xl px-7 pb-8 pt-5 max-h-[90vh] overflow-y-auto text-zinc-100 border border-violet-600 shadow-2xl sm:px-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex w-full min-w-0 flex-col items-center gap-4">
          {/* Carrusel de imágenes — clic abre vista completa */}
          <button
            type="button"
            aria-label="Ver imagen en tamaño completo"
            onClick={() => setLightboxOpen(true)}
            className="relative w-full aspect-[4/3] bg-white rounded-xl p-5 sm:p-6 flex items-center justify-center overflow-hidden shrink-0 cursor-zoom-in group/img"
          >
            <Image
              src={product.images[safeIdx]}
              alt={product.name}
              fill
              style={{ objectFit: "contain" }}
              className="!static scale-[1.1] transition-transform duration-200 group-hover/img:scale-[1.17]"
              sizes="(max-width: 768px) 90vw, 400px"
              priority
            />
            <span className="absolute bottom-2 right-2 bg-black/40 text-white text-xs px-2 py-0.5 rounded-full opacity-0 group-hover/img:opacity-100 transition pointer-events-none">
              🔍 Ampliar
            </span>
          </button>

          {/* Miniaturas del carrusel */}
          <div className="flex w-full flex-wrap justify-center gap-1.5">
            {product.images.map((img, i) => (
              <button
                type="button"
                key={img}
                className={`relative h-7 w-10 shrink-0 overflow-hidden rounded border-2 ${safeIdx === i ? "border-violet-400" : "border-zinc-700 opacity-60"}`}
                onClick={() => setImgIdx(i)}
                tabIndex={0}
              >
                <Image
                  src={img}
                  alt={product.name + " vista " + (i + 1)}
                  fill
                  style={{ objectFit: "cover" }}
                  className="rounded"
                  sizes="40px"
                />
              </button>
            ))}
          </div>

          <div className="flex w-full min-w-0 flex-col items-center gap-6 text-center">
            <h2
              id="modal-product-title"
              className="w-full px-1 text-2xl font-bold leading-tight text-violet-200 text-balance sm:text-3xl"
            >
              {product.name}
            </h2>

            {/* Especificaciones técnicas */}
            <ul className="grid w-full max-w-xs grid-cols-2 justify-items-center gap-x-6 gap-y-4 px-1 text-sm sm:max-w-sm sm:px-2">
              {Object.entries(product.specs).map(([k, v]) => (
                <li
                  key={k}
                  className="flex min-w-0 max-w-[9.5rem] flex-col items-center gap-1 sm:max-w-[11rem]"
                >
                  <span className="font-semibold text-xs uppercase tracking-wide text-zinc-500">
                    {k}
                  </span>
                  <span className="text-balance break-words leading-tight text-zinc-200">
                    {v}
                  </span>
                </li>
              ))}
            </ul>

            {/* PRECIO y GARANTIA */}
            <div className="flex w-full items-stretch justify-center gap-0 rounded-2xl overflow-hidden border border-zinc-800">
              <div className="flex flex-1 flex-col items-center justify-center gap-1 py-4 px-3">
                <span className="font-semibold text-xs uppercase tracking-widest text-zinc-500">
                  PRECIO
                </span>
                <span className="text-2xl font-bold text-white sm:text-3xl">
                  ${product.price}
                </span>
              </div>
              <div className="w-px bg-zinc-800" />
              <div className="flex flex-1 flex-col items-center justify-center gap-1 py-4 px-3">
                <span className="font-semibold text-xs uppercase tracking-widest text-zinc-500">
                  GARANTIA
                </span>
                <span className="text-2xl font-bold text-white sm:text-3xl">
                  {product.garantia}
                </span>
              </div>
            </div>

            <AddToCartButton product={product} onAdded={onClose} />
          </div>
        </div>
      </div>
    </div>

    {lightboxOpen && (
      <ImageLightbox
        images={product.images}
        startIndex={safeIdx}
        productName={product.name}
        onClose={() => setLightboxOpen(false)}
      />
    )}
    </>
  );
}
