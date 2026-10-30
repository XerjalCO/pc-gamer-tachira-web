"use client";
import { useState, type FormEvent } from "react";
import { fetchStock } from "@/lib/adminStock";
import { CARD_CLASS, INPUT_CLASS, LABEL_CLASS, PRIMARY_BUTTON_CLASS } from "./adminStyles";

type Props = { onSuccess: (adminPass: string) => void };

export function AdminLogin({ onSuccess }: Props) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);

  // Valida la contraseña en el servidor (ADMIN_PASS) usando la ruta protegida de stock
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setChecking(true);
    try {
      await fetchStock(password);
      onSuccess(password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Contraseña incorrecta.");
      setPassword("");
    } finally {
      setChecking(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 text-zinc-100">
      <form onSubmit={handleSubmit} className={`${CARD_CLASS} flex w-full max-w-sm flex-col gap-5`}>
        <div>
          <h1 className="text-2xl font-bold">Panel de Administrador</h1>
          <p className="mt-1 text-sm text-zinc-400">Ingresa la contraseña para continuar.</p>
        </div>

        <label className={LABEL_CLASS}>
          Contraseña
          <input
            type="password"
            required
            autoFocus
            autoComplete="current-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(null);
            }}
            className={INPUT_CLASS}
          />
        </label>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button type="submit" disabled={checking} className={PRIMARY_BUTTON_CLASS}>
          {checking ? "Verificando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
