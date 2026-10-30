"use client";
import { useEffect } from "react";

export type ToastMessage = { type: "success" | "error"; text: string };

type Props = { toast: ToastMessage | null; onClose: () => void };

const TOAST_DURATION_MS = 4500;

export function AdminToast({ toast, onClose }: Props) {
  // Cierra la notificación automáticamente tras unos segundos
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(onClose, TOAST_DURATION_MS);
    return () => clearTimeout(id);
  }, [toast, onClose]);

  if (!toast) return null;
  const isSuccess = toast.type === "success";

  return (
    <div
      role={isSuccess ? "status" : "alert"}
      className={`fixed right-4 top-4 z-50 flex max-w-sm items-start gap-3 rounded-xl border px-4 py-3 text-sm shadow-2xl backdrop-blur ${
        isSuccess
          ? "border-emerald-500/40 bg-emerald-950/90 text-emerald-200"
          : "border-red-500/40 bg-red-950/90 text-red-200"
      }`}
    >
      <span className="text-lg leading-none">{isSuccess ? "✓" : "✕"}</span>
      <p className="flex-1">{toast.text}</p>
      <button type="button" onClick={onClose} aria-label="Cerrar" className="opacity-70 hover:opacity-100">
        ×
      </button>
    </div>
  );
}
