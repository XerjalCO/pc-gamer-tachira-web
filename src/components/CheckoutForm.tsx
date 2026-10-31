"use client";
import { useState, type FormEvent } from "react";
import { PAYMENT_METHODS, type PaymentMethod } from "@/data/pagos";
import type { OrderDetails } from "@/lib/whatsappOrder";
import { PagoMovilBox } from "@/components/PagoMovilBox";
import { SocialIconWhatsApp } from "@/components/SocialIcons";

const LABEL_CLASS = "flex flex-col gap-1.5 text-xs font-semibold uppercase tracking-widest text-zinc-400";
const INPUT_CLASS =
  "w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-base font-normal normal-case tracking-normal text-zinc-100 placeholder:text-zinc-600 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition";

  type Props = {
    disabled: boolean;
    cartTotal: number;
    onSubmit: (details: OrderDetails) => void;
  };

export function CheckoutForm({ disabled, cartTotal, onSubmit }: Props) {
  const [fullName, setFullName] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PAYMENT_METHODS[0]);
  const [reference, setReference] = useState("");
  const isPagoMovil = paymentMethod === "Pago Móvil";

  // Envía los datos limpios; la referencia solo se incluye si el método es Pago Móvil
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
  
    // Disparar el evento de Compra en el Píxel
    if (typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq('track', 'Purchase', {
        currency: 'USD',
        value: cartTotal
      });
    }
  
    // Continuar con el flujo original hacia WhatsApp
    onSubmit({
      fullName: fullName.trim(),
      idNumber: idNumber.trim().toUpperCase(),
      paymentMethod,
      reference: isPagoMovil ? reference.trim() : undefined,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label className={LABEL_CLASS}>
        Nombre completo
        <input
          required
          autoComplete="name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Ej. María Pérez"
          className={INPUT_CLASS}
        />
      </label>

      <label className={LABEL_CLASS}>
        Cédula / RIF
        <input
          required
          value={idNumber}
          onChange={(e) => setIdNumber(e.target.value)}
          pattern="^[VvEeJjGgPp]?-?\d{6,10}(-?\d)?$"
          title="Ej. V-12345678 o J-123456789"
          placeholder="Ej. V-12345678"
          className={INPUT_CLASS}
        />
      </label>

      <label className={LABEL_CLASS}>
        Método de pago
        <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)} className={INPUT_CLASS}>
          {PAYMENT_METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
      </label>

      {isPagoMovil && (
        <>
          <PagoMovilBox />
          <label className={LABEL_CLASS}>
            Referencia (últimos 4 dígitos)
            <input
              required
              inputMode="numeric"
              pattern="\d{4}"
              maxLength={4}
              title="Ingresa los últimos 4 dígitos de la referencia"
              value={reference}
              onChange={(e) => setReference(e.target.value.replace(/\D/g, ""))}
              placeholder="Ej. 1234"
              className={INPUT_CLASS}
            />
          </label>
        </>
      )}

      <button
        type="submit"
        disabled={disabled}
        className="mt-1 flex w-full items-center justify-center gap-2.5 rounded-xl bg-[#25D366] px-6 py-3.5 text-base font-bold text-white shadow-[0_0_14px_rgba(37,211,102,0.45)] transition hover:bg-[#1EBE5A] disabled:cursor-not-allowed disabled:opacity-40"
      >
        <SocialIconWhatsApp className="h-5 w-5" />
        Enviar pedido por WhatsApp
      </button>
    </form>
  );
}
