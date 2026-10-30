export type FaqItem = {
  question: string;
  answer: string | string[];
};

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "¿Cual es la descripcion de los GRADOS de los equipos usados?",
    answer: [
      "A — Excelente: Sin fallas visibles. 100% funcional.",
      "B — Bueno: Pequeñas marcas de uso. 100% funcional.",
      "C — Regular: Marcas de uso moderadas. 100% funcional.",
    ],
  },
  {
    question: "¿En qué moneda manejan los precios?",
    answer:
      "Los precios están expresados en dólares americanos (USD). Aceptamos pago en efectivo Dolares y Pesos Colombianos, transferencias en bolívares al cambio del día (tasa USDT), Pago móvil, Zinli, Binance USDT y Bancolombia.",
  },
  {
    question: "¿Los equipos tienen garantía?",
    answer:
      "Sí. Todos nuestros equipos incluyen garantía de 90 días contra fallas de hardware. Si el equipo presenta alguna falla en ese período, lo revisamos, reparamos y/o cambiamos el equipo sin costo adicional.",
  },
  {
    question: "¿Los equipos son nuevos o usados?",
    answer:
      "Vendemos NUEVO y USADO (se especifica en la descripción del producto). Somos especialistas en equipos reacondicionados (refurbished / usados) de marcas reconocidas como Lenovo, Dell y HP. Cada equipo pasa por una revisión técnica completa antes de la venta: limpieza interna, prueba de batería, pantalla y teclado.",
  },
  {
    question: "¿Hacen envíos a todo Venezuela?",
    answer:
      "Sí. Coordinamos envíos a nivel nacional a través de encomiendas como ZOOM, MRW y TEALCA. El costo de envío corre por cuenta del comprador y se calcula según el destino.",
  },
  {
    question: "¿Cómo realizo un pedido?",
    answer:
      "Elige el equipo en nuestro catálogo y haz clic en el botón de WhatsApp del producto. Te atenderemos directamente para confirmar disponibilidad, forma de pago y entrega.",
  },
  {
    question: "¿Tienen local físico en Táchira?",
    answer:
      "Sí, estamos en San Cristóbal, Táchira. Puedes ver directamente los equipos con previa cita por WhatsApp.",
  },
  {
    question: "¿Puedo negociar el precio?",
    answer:
      "Los precios ya están ajustados al mercado, pero si vas a comprar varios equipos podemos conversar sobre un descuento.",
  },
  {
    question: "¿Los equipos vienen con sistema operativo?",
    answer:
      "La mayoría de los equipos viene con Windows 10 o Windows 11 instalado. Si necesitas alguna configuración especial o reinstalación, lo podemos coordinar antes de la entrega.",
  },
  {
    question: "¿Ofrecen soporte técnico después de la compra?",
    answer:
      "Sí. Durante el período de garantía te apoyamos sin costo. Fuera de garantía ofrecemos servicio técnico con presupuesto previo: formateos, cambio de piezas, limpieza y más.",
  },
  {
    question: "¿Qué pasa si el equipo llega dañado por el envío?",
    answer:
      "Todos los equipos son embalados con protección adicional. Si a pesar de eso llega con daños visibles, debes tomar fotos al momento de recibirlo y notificarnos de inmediato por WhatsApp para gestionar la solución.",
  },
];
