import Image from "next/image";

interface HeroSectionProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export function HeroSection({ search, onSearchChange }: HeroSectionProps) {
  return (
    <div
      className="relative w-full"
      style={{
        backgroundImage: "url('/hero.gif')",
        backgroundSize: "cover",
        backgroundPosition: "center center",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/30 via-zinc-950/70 to-zinc-950" />

      <div className="relative mx-auto w-full max-w-6xl px-4 pt-6 pb-8 sm:pt-8 sm:pb-10 text-center">
        <h1 className="mx-auto flex justify-center overflow-visible">
          <span className="relative block h-48 w-48 sm:h-56 sm:w-56 md:h-64 md:w-64 lg:h-72 lg:w-72 [filter:drop-shadow(0_10px_14px_rgba(0,0,0,0.35))]">
            <span className="absolute -inset-[18%] sm:-inset-[16%] md:-inset-[14%] lg:-inset-[12%]">
              <Image
                src="/logo.png"
                alt="PCG Táchira"
                fill
                sizes="(max-width: 640px) 192px, (max-width: 1024px) 256px, 288px"
                className="object-contain"
                priority
              />
            </span>
          </span>
        </h1>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="mt-3 sm:mt-4 mx-auto w-full max-w-3xl"
        >
          <div className="relative rounded-xl border border-violet-600/80 bg-zinc-950/70 backdrop-blur px-6 py-2 shadow-[0_0_0_1px_rgba(168,85,247,0.15)]">
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Busca lo que quieras ..."
              className="w-full bg-transparent text-zinc-100 placeholder-zinc-400 focus:outline-none text-base sm:text-lg"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
