import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY en .env.local"
  );
}

/** Cliente único de Supabase compartido por la app y el script de seed */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/** Columnas públicas de products. No usar "*": anon no tiene permiso sobre "stock". */
export const PUBLIC_PRODUCT_COLUMNS = "id, name, desc, price, garantia, images, specs";
