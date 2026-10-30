"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

// Muestra el botón solo cuando el usuario ha bajado más de 100px o no está en la página principal
const SHOW_AFTER_PX = 100;

export function BackToTop() {
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const isHome = pathname === "/";

  useEffect(() => {
    function handleScroll() {
      const y = window.scrollY || document.documentElement.scrollTop;
      setScrolled(y > SHOW_AFTER_PX);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Visible si: está en home y scrolleó, o si está en otra página
  const visible = !isHome || scrolled;

  // Si está en home, sube al tope. Si está en otra página, navega al inicio.
  function goHome() {
    if (isHome) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      router.push("/");
    }
  }

  return (
    <button
      onClick={goHome}
      aria-label="Ir a la página principal"
      className={[
        "fixed bottom-6 right-6 z-50",
        "w-11 h-11 rounded-full",
        "bg-blue-600 hover:bg-blue-500 active:bg-blue-700",
        "text-white shadow-lg shadow-blue-900/40",
        "flex items-center justify-center",
        "transition-all duration-300",
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-4 pointer-events-none",
      ].join(" ")}
    >
      {/* Ícono de casa */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5"
      >
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
        <path d="M9 21V12h6v9" />
      </svg>
    </button>
  );
}
