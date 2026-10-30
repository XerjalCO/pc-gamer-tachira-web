"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

interface Props {
  images: string[];
  startIndex: number;
  productName: string;
  onClose: () => void;
}

export function ImageLightbox({ images, startIndex, productName, onClose }: Props) {
  const [current, setCurrent] = useState(startIndex);

  // Navega con flechas del teclado y cierra con Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") setCurrent((c) => (c - 1 + images.length) % images.length);
      if (e.key === "ArrowRight") setCurrent((c) => (c + 1) % images.length);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [images.length, onClose]);

  function prev(e: React.MouseEvent) {
    e.stopPropagation();
    setCurrent((c) => (c - 1 + images.length) % images.length);
  }

  function next(e: React.MouseEvent) {
    e.stopPropagation();
    setCurrent((c) => (c + 1) % images.length);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Imagen principal */}
      <div
        className="relative w-full max-w-3xl mx-16 aspect-[4/3]"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={images[current]}
          alt={`${productName} - imagen ${current + 1}`}
          fill
          style={{ objectFit: "contain" }}
          sizes="(max-width: 768px) 95vw, 900px"
          priority
        />
      </div>

      {/* Botón cerrar */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 bg-zinc-800/80 hover:bg-zinc-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg transition"
        aria-label="Cerrar"
      >
        ✕
      </button>

      {/* Flechas de navegación — solo si hay más de una imagen */}
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 sm:left-5 bg-zinc-800/80 hover:bg-violet-600 text-white rounded-full w-11 h-11 flex items-center justify-center text-3xl leading-none transition"
            aria-label="Imagen anterior"
          >
            ‹
          </button>
          <button
            onClick={next}
            className="absolute right-3 sm:right-5 bg-zinc-800/80 hover:bg-violet-600 text-white rounded-full w-11 h-11 flex items-center justify-center text-3xl leading-none transition"
            aria-label="Siguiente imagen"
          >
            ›
          </button>
        </>
      )}

      {/* Contador */}
      <span className="absolute bottom-5 text-zinc-400 text-sm select-none">
        {current + 1} / {images.length}
      </span>
    </div>
  );
}
