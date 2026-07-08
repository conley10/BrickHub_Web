// scripts/seed.js
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import sets from "../src/data/sets.js";
import minifigures from "../src/data/minifigures.js";

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const rows = [
  ...sets.map((s) => ({
    sku: s.sku,
    type: "set",
    name: s.name,
    theme: s.theme,
    price: s.price,
    condition: s.condition,
    stock: s.stock,
    image_key: s.imageKey,
  })),
  ...minifigures.map((m) => ({
    sku: m.sku,
    type: "minifig",
    name: m.name,
    series: m.series,
    price: m.price,
    condition: m.condition,
    stock: m.stock,
    image_key: m.imageKey,
  })),
];

const { error } = await supabase.from("products").insert(rows);

if (error) {
  console.error("Seed failed:", error);
} else {
  console.log(`Seeded ${rows.length} products.`);
}