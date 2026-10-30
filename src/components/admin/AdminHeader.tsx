import Link from "next/link";

/** Barra superior del panel con enlace a la tienda y botón de salir */
export function AdminHeader({ onLogout }: { onLogout: () => void }) {
  return (
    <header className="border-b border-zinc-800 bg-zinc-950/80 px-6 py-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <h1 className="text-xl font-bold">
          Panel de <span className="text-violet-400">Administrador</span>
        </h1>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/" className="text-zinc-400 hover:text-zinc-100">Ver tienda</Link>
          <button type="button" onClick={onLogout} className="rounded-lg border border-zinc-700 px-3 py-1.5 text-zinc-300 hover:bg-zinc-800">
            Salir
          </button>
        </div>
      </div>
    </header>
  );
}
