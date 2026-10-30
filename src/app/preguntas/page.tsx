import { TopBar } from "@/components/TopBar";
import { FaqSection } from "@/components/FaqSection";

export const metadata = {
  title: "Preguntas Frecuentes | PCG Táchira",
  description:
    "Resuelve tus dudas sobre pagos, garantías, envíos y equipos en PCG Táchira.",
};

export default function PreguntasPage() {
  return (
    <div className="bg-zinc-950 min-h-screen flex flex-col font-sans text-zinc-100">
      <header className="w-full bg-zinc-950">
        <TopBar />
      </header>

      <main className="flex-1 w-full flex flex-col items-center py-10">
        <FaqSection />
      </main>

      <footer className="w-full text-center py-8 text-zinc-500 text-sm bg-zinc-950 mt-auto">
        &copy; {new Date().getFullYear()} PCGTachira - Todos los derechos reservados.
      </footer>
    </div>
  );
}
