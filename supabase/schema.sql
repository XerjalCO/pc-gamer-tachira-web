-- Tabla del catálogo de productos
-- "desc" es palabra reservada en SQL, por eso va entre comillas.
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  "desc" text,
  price numeric not null,
  garantia text,
  images text[] not null default '{}',
  specs jsonb not null default '{}'::jsonb
);

-- RLS desactivado: cualquier cliente con la anon key puede leer y escribir.
alter table public.products disable row level security;

-- Stock: solo accesible con la service_role key (rutas /api/admin del servidor).
alter table public.products
  add column if not exists stock integer not null default 0 check (stock >= 0);

-- Permisos por columna: anon/authenticated pueden usar todo excepto "stock".
-- Ojo: si agregas columnas nuevas en el futuro, debes incluirlas aquí para que la tienda las vea.
revoke select, insert, update on public.products from anon, authenticated;
grant select (id, name, "desc", price, garantia, images, specs) on public.products to anon, authenticated;
grant insert (name, "desc", price, garantia, images, specs) on public.products to anon, authenticated;
grant update (name, "desc", price, garantia, images, specs) on public.products to anon, authenticated;

-- Bucket público para las fotos de los productos (lo usa el panel /admin)
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- storage.objects tiene RLS activo: se permite subir y borrar en este bucket con la anon key
drop policy if exists "product-images insert" on storage.objects;
create policy "product-images insert" on storage.objects
  for insert to anon, authenticated
  with check (bucket_id = 'product-images');

drop policy if exists "product-images delete" on storage.objects;
create policy "product-images delete" on storage.objects
  for delete to anon, authenticated
  using (bucket_id = 'product-images');

-- Supabase necesita SELECT para devolver el resultado de remove()
drop policy if exists "product-images select" on storage.objects;
create policy "product-images select" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'product-images');
