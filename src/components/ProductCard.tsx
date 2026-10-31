import Image from "next/image";
import type { Product } from "@/data/inventario";

export function ProductCard({
  product,
  onSelect,
}: {
  product: Product;
  onSelect: (product: Product) => void;
}) {
  return (
    <button
      onClick={() => onSelect(product)}
      className={[
        "group w-full overflow-hidden rounded-3xl relative",
        "bg-gradient-to-b from-zinc-900 to-zinc-950",
        "border border-zinc-800/80",
        "transition-all duration-300",
        // Base shadow
        "shadow-[0_18px_55px_rgba(0,0,0,0.55)]",
        // Hover: lift + violet/cyan glow layers
        "hover:-translate-y-1",
        "hover:border-violet-500/60",
        "hover:shadow-[0_0_0_1px_rgba(139,92,246,0.45),0_0_18px_rgba(139,92,246,0.35),0_0_40px_rgba(34,211,238,0.18),0_22px_70px_rgba(0,0,0,0.65)]",
        "focus:outline-none focus:ring-2 focus:ring-violet-400",
      ].join(" ")}
      tabIndex={0}
      aria-label={`Ver detalles de ${product.name}`}
    >
      {/* Panel superior blanco — isolation: isolate evita que el glow externo sangre aquí */}
      <div className="relative w-full bg-white isolate">
        <div className="relative w-full aspect-[4/3] p-5 sm:p-6 flex items-center justify-center">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            style={{ objectFit: "contain" }}
            className="!static scale-[1.1]"
            sizes="(max-width: 768px) 90vw, 350px"
          />
        </div>
        {product.categoria ? (
          <span className="absolute top-3 right-3 max-w-[70%] truncate bg-violet-600 text-white text-xs font-bold rounded-lg px-3 py-1 shadow-md pointer-events-none">
            {product.categoria}
          </span>
        ) : null}
      </div>

      {/* Información y precio */}
      <div className="flex flex-col items-center text-center px-6 pt-4 pb-5">
        <h3 className="text-xl font-extrabold tracking-wide text-white">
          {product.name}
        </h3>
        <p className="mt-1.5 text-zinc-300/90 text-sm leading-relaxed">
          {product.desc}
        </p>
        <div className="mt-4 flex items-center justify-center">
          <span className="inline-flex rounded-xl bg-gradient-to-r from-lime-400 to-cyan-400 p-px shadow-[0_0_0_1px_rgba(34,211,238,0.11),0_0_9px_rgba(163,230,53,0.21),0_0_13px_rgba(34,211,238,0.13)]">
            <span className="rounded-[11px] bg-zinc-950/90 px-[calc(0.75rem*1.1)] py-[calc(0.125rem*1.1)]">
              <span className="font-sans text-2xl sm:text-3xl font-bold tracking-normal text-white drop-shadow-[0_0_6px_rgba(34,211,238,0.26)]">
                ${product.price}
              </span>
            </span>
          </span>
        </div>
      </div>
    </button>
  );
}
