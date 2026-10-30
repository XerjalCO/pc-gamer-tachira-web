"use client";
import { DEFAULT_SPEC_KEYS } from "@/data/admin";
import { INPUT_CLASS } from "./adminStyles";

export type SpecRow = { id: string; key: string; value: string };

type Props = {
  rows: SpecRow[];
  disabled: boolean;
  onChange: (rows: SpecRow[]) => void;
};

// Crea una fila de especificación con id estable para React
export function newSpecRow(key = "", value = ""): SpecRow {
  return { id: crypto.randomUUID(), key, value };
}

// Arma las filas: primero las 6 claves principales (vacías si faltan) y luego las extra del producto
export function specsToRows(specs: Record<string, string> = {}): SpecRow[] {
  const main = DEFAULT_SPEC_KEYS.map((k) => newSpecRow(k, specs[k] ?? ""));
  const extra = Object.entries(specs)
    .filter(([k]) => !DEFAULT_SPEC_KEYS.includes(k))
    .map(([k, v]) => newSpecRow(k, v));
  return [...main, ...extra];
}

// Convierte las filas en el objeto specs, ignorando filas sin clave o valor
export function rowsToSpecs(rows: SpecRow[]): Record<string, string> {
  return Object.fromEntries(
    rows.filter((r) => r.key.trim() && r.value.trim()).map((r) => [r.key.trim(), r.value.trim()])
  );
}

export function SpecsFieldset({ rows, disabled, onChange }: Props) {
  // Actualiza un campo de una fila concreta
  function update(id: string, field: "key" | "value", text: string) {
    onChange(rows.map((r) => (r.id === id ? { ...r, [field]: text } : r)));
  }

  return (
    <fieldset disabled={disabled} className="flex flex-col gap-2">
      <legend className="mb-2 text-xs font-semibold uppercase tracking-widest text-zinc-400">
        Especificaciones
      </legend>
      {rows.map((row) => (
        <div key={row.id} className="flex gap-2">
          <input
            required
            value={row.key}
            onChange={(e) => update(row.id, "key", e.target.value)}
            placeholder="Clave (ej. CPU)"
            className={`${INPUT_CLASS} w-2/5`}
          />
          <input
            required
            value={row.value}
            onChange={(e) => update(row.id, "value", e.target.value)}
            placeholder="Valor (ej. RYZEN 5 5650U)"
            className={INPUT_CLASS}
          />
          <button
            type="button"
            onClick={() => onChange(rows.filter((r) => r.id !== row.id))}
            disabled={rows.length === 1}
            aria-label="Quitar especificación"
            className="shrink-0 rounded-xl border border-zinc-700 px-3 text-zinc-400 transition hover:border-red-500/50 hover:text-red-300 disabled:opacity-30"
          >
            ✕
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...rows, newSpecRow()])}
        className="self-start rounded-lg px-2 py-1 text-sm font-semibold text-violet-400 hover:text-violet-300"
      >
        + Agregar especificación
      </button>
    </fieldset>
  );
}
