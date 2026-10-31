/** Producto antes de guardarse en Supabase (sin id) */
export type NewProduct = {
  name: string;
  desc: string;
  categoria: string;
  price: number;
  garantia: string;
  images: string[];
  specs: Record<string, string>;
};

/** Producto tal como viene de la tabla products. is_visible false lo saca del catálogo. */
export type Product = NewProduct & { id: string; is_visible?: boolean };

/** Número de WhatsApp en formato internacional sin el + (ej: 584121234567) */
export const WHATSAPP_NUMBER = "584247199760";

/** Actualiza las URLs con los enlaces reales de tu negocio */
export const SOCIAL_LINKS = {
  facebook: "https://www.facebook.com/pcgtachira/",
  instagram: "https://www.instagram.com/pcgtachira/",
  tiktok: "https://www.tiktok.com/pcgtachira/",
} as const;

/** Datos semilla: se insertan en Supabase con `npm run seed` */
export const PRODUCTS: NewProduct[] = [
  {
    name: "LENOVO THINKPAD T495",
    desc: "RYZEN 5 3500U · 16GB RAM · 256GB NVMe · 14'' FHD",
    categoria: "Laptop",
    price: 290,
    garantia: "90 DÍAS",
    images: [
      "/LENOVOT4955.png",
      "/LENOVOT495_ANGLE1.png",
      "/LENOVOT495_SIDE.png",
    ],
    specs: {
      CPU: "RYZEN 5 3500U",
      RAM: "16GB DDR4",
      Almacenamiento: "256GB NVMe",
      Pantalla: '14" FULL HD IPS',
      Batería: "4 CELDAS - 80%",
      ESTADO: "USADO - GRADO B",
    },
  },
  {
    name: "DELL LATITUDE 3541",
    desc: "INTEL i5 9400H · 16GB RAM · 256GB NVMe · 15.6'' FHD",
    categoria: "Laptop",
    price: 275,
    garantia: "90 DÍAS",
    images: ["/DELL3541.png", "/DELL3541_ANGLE.png"],
    specs: {
      CPU: "INTEL i5 9400H",
      RAM: "16GB DDR4",
      Almacenamiento: "256GB NVMe",
      Pantalla: '15.6" FULL HD LED',
      Batería: "4 CELDAS - 80%",
      ESTADO: "USADO - GRADO B",
    },
  },
  {
    name: "HP ELITEBOOK 845 G8",
    desc: "RYZEN 5 5650U · 16GB RAM · 256GB NVMe · 14'' FHD",
    categoria: "Laptop",
    price: 335,
    garantia: "90 DÍAS",
    images: ["/HP845G08.png", "/HP845G08_ANGLE.png"],
    specs: {
      CPU: "RYZEN 5 5650U",
      RAM: "16GB DDR4",
      Almacenamiento: "256GB NVMe",
      Pantalla: '14" FULL HD IPS',
      Batería: "4 CELDAS - 80%",
      ESTADO: "USADO - GRADO B",
    },
  },
];
