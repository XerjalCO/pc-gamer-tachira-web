"use client";
import { useState } from "react";
import { FAQ_ITEMS } from "@/data/faq";

// Muestra u oculta la respuesta al hacer clic en la pregunta
function FaqItem({ question, answer }: { question: string; answer: string | string[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-violet-600/40 rounded-xl bg-zinc-900/60 overflow-hidden">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left text-zinc-100 font-semibold text-sm sm:text-base hover:bg-zinc-800/60 transition focus:outline-none focus:ring-2 focus:ring-violet-500"
        aria-expanded={open}
      >
        <span>{question}</span>
        <span
          className={`flex-shrink-0 text-violet-400 text-xl leading-none transition-transform duration-200 ${
            open ? "rotate-45" : "rotate-0"
          }`}
        >
          +
        </span>
      </button>

      {open && (
        <div className="px-5 pb-5 text-zinc-400 text-sm sm:text-base leading-relaxed border-t border-violet-600/20">
          {Array.isArray(answer) ? (
            // Renderiza respuestas con lista de ítems (ej. tabla de grados)
            <ul className="pt-3 flex flex-col gap-1.5">
              {answer.map((item) => {
                const [grade, ...rest] = item.split("—");
                return (
                  <li key={item} className="flex items-start gap-2">
                    <span className="font-bold text-violet-400 min-w-[1.5rem]">
                      {grade.trim()}
                    </span>
                    <span>— {rest.join("—")}</span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="pt-3">{answer}</p>
          )}
        </div>
      )}
    </div>
  );
}

export function FaqSection() {
  return (
    <section className="w-full max-w-3xl mx-auto px-4 pt-4 pb-12 flex flex-col items-center gap-8">
      <h2 className="w-full text-center text-2xl sm:text-3xl font-bold tracking-widest text-zinc-100 uppercase">
        Preguntas{" "}
        <span className="text-violet-400">Frecuentes</span>
      </h2>

      <div className="flex flex-col gap-3 mt-2">
        {FAQ_ITEMS.map((item) => (
          <FaqItem key={item.question} question={item.question} answer={item.answer} />
        ))}
      </div>
    </section>
  );
}
