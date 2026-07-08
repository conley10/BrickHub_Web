-- BrickHub Supabase schema.
-- Safe to re-run: uses IF NOT EXISTS / CREATE OR REPLACE throughout.
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor > New query).

create extension if not exists pgcrypto;

-- products ------------------------------------------------------------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  sku text,
  type text not null,
  name text not null,
  theme text,
  series text,
  price numeric not null,
  condition text,
  stock integer not null default 0,
  image_key text,
  created_at timestamptz not null default now()
);

-- orders ---------------------------------------------------------------
create table if not exists public.orders (
  id bigint generated always as identity primary key,
  customer_name text not null,
  email text not null,
  phone text not null,
  address text not null,
  city text not null,
  postcode text not null,
  country text not null,
  items jsonb not null,
  subtotal numeric,
  shipping numeric,
  total numeric,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

-- sourcing_request -------------------------------------------------------
create table if not exists public.sourcing_request (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  email text not null,
  item_name text not null,
  item_id text,
  type text,
  budget text,
  condition text,
  notes text,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

-- decrement_stock RPC ----------------------------------------------------
-- Locks the product row, checks there's enough stock, and decrements it
-- atomically. Returns false (instead of raising) when stock is insufficient
-- or the product doesn't exist, so the caller can turn it into a normal
-- "out of stock" API response.
create or replace function public.decrement_stock(product_id uuid, qty integer)
returns boolean
language plpgsql
as $$
declare
  current_stock integer;
begin
  select stock into current_stock
  from public.products
  where id = product_id
  for update;

  if current_stock is null or current_stock < qty then
    return false;
  end if;

  update public.products
  set stock = stock - qty
  where id = product_id;

  return true;
end;
$$;
