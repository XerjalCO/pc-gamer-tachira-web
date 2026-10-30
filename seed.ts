import { supabase } from "./src/lib/supabase";
import { PRODUCTS } from "./src/data/inventario";

/** Inserta (o actualiza por nombre) los productos de inventario.ts en Supabase */
async function seed() {
  const { data, error } = await supabase
    .from("products")
    .upsert(PRODUCTS, { onConflict: "name" })
    .select("id, name");

  if (error) {
    console.error("Error al insertar productos:", error.message);
    process.exit(1);
  }

  console.log(`${data.length} productos sincronizados:`);
  data.forEach((p) => console.log(`  - ${p.name} (${p.id})`));
}

seed();
