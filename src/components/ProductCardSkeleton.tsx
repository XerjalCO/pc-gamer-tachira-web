/** Placeholder animado con la misma silueta que ProductCard mientras carga el catálogo */
export function ProductCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="w-full overflow-hidden rounded-3xl border border-violet-600/80 shadow-[0_0_0_1px_rgba(168,85,247,0.15)] md:border-zinc-800/80 md:shadow-none bg-gradient-to-b from-zinc-900 to-zinc-950 animate-pulse"
    >
      <div className="w-full aspect-[4/3] bg-zinc-800/70" />
      <div className="flex flex-col items-center gap-3 px-6 pt-4 pb-5">
        <div className="h-5 w-3/4 rounded-lg bg-zinc-800" />
        <div className="h-3 w-full rounded bg-zinc-800/80" />
        <div className="h-3 w-2/3 rounded bg-zinc-800/80" />
        <div className="mt-2 h-9 w-24 rounded-xl bg-zinc-800" />
      </div>
    </div>
  );
}
