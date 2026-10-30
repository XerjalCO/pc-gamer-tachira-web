import Image from "next/image";
import { PAGO_MOVIL_INFO } from "@/data/pagos";

const ROWS: { label: string; value: string }[] = [
  { label: "Banco", value: PAGO_MOVIL_INFO.banco },
  { label: "Cédula", value: PAGO_MOVIL_INFO.cedula },
  { label: "Teléfono", value: PAGO_MOVIL_INFO.telefono },
];

export function PagoMovilBox() {
  return (
    <div className="rounded-xl border border-violet-600/60 bg-violet-950/30 p-4 text-center">
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-violet-300">Datos para Pago Móvil</p>
      <div className="grid grid-cols-2 items-center gap-3">
        <dl className="flex flex-col items-center gap-2 text-sm">
          {ROWS.map(({ label, value }) => (
            <div key={label} className="flex flex-col items-center">
              <dt className="text-xs text-zinc-500">{label}</dt>
              <dd className="font-semibold text-zinc-100 select-all">{value}</dd>
            </div>
          ))}
        </dl>
        <div className="flex flex-col items-center gap-1">
          <Image
            src={PAGO_MOVIL_INFO.qrSrc}
            alt="Código QR con los datos de Pago Móvil"
            width={1024}
            height={1024}
            className="h-28 w-28 rounded-lg bg-white p-1.5 sm:h-32 sm:w-32"
          />
          <span className="text-[10px] uppercase tracking-widest text-zinc-500">Escanea y paga</span>
        </div>
      </div>
    </div>
  );
}
