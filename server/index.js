import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";
import { rateLimit } from "express-rate-limit";

dotenv.config();

const app = express();
const PORT = 3001;

// Escape user-supplied text before it goes into HTML emails, to prevent
// HTML/script injection into the emails we send.
const escapeHtml = (value) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[char]
  );

// Restrict CORS to the configured frontend origin in production; allow any
// origin in local dev when ALLOWED_ORIGIN isn't set.
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN;
app.use(cors(ALLOWED_ORIGIN ? { origin: ALLOWED_ORIGIN } : {}));
app.use(express.json());

// Basic abuse protection for form/email-sending and proxy routes.
const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests. Please try again later." },
});

const searchLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests. Please try again later." },
});

// API keys
const REBRICKABLE_API_KEY = process.env.REBRICKABLE_API_KEY;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const OWNER_EMAIL = process.env.OWNER_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// Supabase
// SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY must be set in .env for
// order/request saving to work. If they're missing we don't crash the
// whole server - we just log a warning and let those routes fail gracefully.
const supabaseConfigured =
  Boolean(process.env.SUPABASE_URL) &&
  Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);

if (!supabaseConfigured) {
  console.warn(
    "[warning] SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are not set in .env - " +
      "orders and sourcing requests will not be saved until you add them."
  );
}

const supabase = supabaseConfigured
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
  : null;

// Resend
const resend = new Resend(RESEND_API_KEY);

// Rebrickable
const BASE_URL = "https://rebrickable.com/api/v3/lego";

const rebrickableHeaders = {
  Authorization: `key ${REBRICKABLE_API_KEY}`,
};

// Test route
app.get("/", (req, res) => {
  res.send("BrickHub backend is working");
});

// Search sets or minifigures
app.get("/api/search", searchLimiter, async (req, res) => {
  try {
    const { type, q } = req.query;

    let url = "";

    if (type === "minifigs") {
      url = `${BASE_URL}/minifigs/?search=${encodeURIComponent(q)}`;
    } else {
      url = `${BASE_URL}/sets/?search=${encodeURIComponent(q)}`;
    }

    const response = await fetch(url, {
      headers: rebrickableHeaders,
    });

    const data = await response.json();

    res.json(data);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "Search failed" });
  }
});

// Get one set from Rebrickable
app.get("/api/set/:setNum", searchLimiter, async (req, res) => {
  try {
    const response = await fetch(
      `${BASE_URL}/sets/${req.params.setNum}/`,
      {
        headers: rebrickableHeaders,
      }
    );

    const data = await response.json();

    res.json(data);
  } catch (error) {
    console.error("Set fetch error:", error);
    res.status(500).json({ error: "Set fetch failed" });
  }
});

// Get one minifigure from Rebrickable
app.get("/api/minifig/:figNum", searchLimiter, async (req, res) => {
  try {
    const response = await fetch(
      `${BASE_URL}/minifigs/${req.params.figNum}/`,
      {
        headers: rebrickableHeaders,
      }
    );

    const data = await response.json();

    res.json(data);
  } catch (error) {
    console.error("Minifig fetch error:", error);
    res.status(500).json({ error: "Minifig fetch failed" });
  }
});

// Save sourcing request + send emails
app.post("/api/request", formLimiter, async (req, res) => {
  try {
    const {
      type,
      itemId,
      itemName,
      customerName,
      email,
      budget,
      condition,
      notes,
    } = req.body;

    if (!itemName || !customerName || !email) {
      return res.status(400).json({
        error: "Item name, your name, and email are required.",
      });
    }

    // 1. Save request to Supabase
    if (!supabase) {
      return res.status(500).json({
        error:
          "Supabase is not configured on the server (missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY in .env).",
      });
    }

    const { error: supabaseError } = await supabase
      .from("sourcing_request")
      .insert([
        {
          customer_name: customerName,
          email,
          item_name: itemName,
          item_id: itemId,
          type,
          budget,
          condition,
          notes,
          status: "new",
        },
      ]);

    if (supabaseError) {
      console.error("Supabase insert error:", supabaseError);
      return res.status(500).json({
        error: "Request could not be saved.",
        details: supabaseError.message,
      });
    }

    // 2. Email you
    await resend.emails.send({
      from: "BrickHub <onboarding@resend.dev>",
      to: OWNER_EMAIL,
      subject: `New sourcing request: ${itemName}`,
      html: `
        <h2>New sourcing request</h2>
        <p><strong>Item:</strong> ${escapeHtml(itemName)}</p>
        <p><strong>Type:</strong> ${escapeHtml(type)}</p>
        <p><strong>Item ID:</strong> ${escapeHtml(itemId)}</p>
        <p><strong>Name:</strong> ${escapeHtml(customerName)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Budget:</strong> ${escapeHtml(budget)}</p>
        <p><strong>Condition:</strong> ${escapeHtml(condition)}</p>
        <p><strong>Notes:</strong> ${escapeHtml(notes)}</p>
      `,
    });

    // 3. Email customer
    await resend.emails.send({
      from: "BrickHub <onboarding@resend.dev>",
      to: email,
      subject: "We received your BrickHub sourcing request",
      html: `
        <h2>Thanks ${escapeHtml(customerName)}!</h2>
        <p>We received your sourcing request for:</p>
        <p><strong>${escapeHtml(itemName)}</strong></p>
        <p><strong>Item ID:</strong> ${escapeHtml(itemId)}</p>
        <p><strong>Preferred condition:</strong> ${escapeHtml(condition)}</p>
        <p><strong>Budget:</strong> ${escapeHtml(budget)}</p>
        <p><strong>Notes:</strong> ${escapeHtml(notes)}</p>
        <p>We’ll review your request and contact you if we can source it.</p>
      `,
    });

    res.json({
      message:
        "Request saved and sent successfully. Check your email for confirmation.",
    });
  } catch (error) {
    console.error("Request route error:", error);
    res.status(500).json({
      error: "Request failed.",
      details: error.message,
    });
  }
});

// Contact form
app.post("/api/contact", formLimiter, async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Name, email, and message are required." });
    }

    await resend.emails.send({
      from: "BrickHub <onboarding@resend.dev>",
      to: OWNER_EMAIL,
      subject: `New contact form message from ${name}`,
      html: `
        <h2>New contact message</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message)}</p>
      `,
    });

    res.json({ message: "Message sent successfully. We'll get back to you soon." });
  } catch (error) {
    console.error("Contact route error:", error);
    res.status(500).json({ error: "Message failed to send.", details: error.message });
  }
});

app.post("/api/orders", formLimiter, async (req, res) => {
  try {
    const {
      customerName,
      email,
      phone,
      address,
      city,
      postcode,
      country,
      cartItems,
      subtotal,
      shipping,
      total,
    } = req.body;

    if (
      !customerName ||
      !email ||
      !phone ||
      !address ||
      !city ||
      !postcode ||
      !country ||
      !Array.isArray(cartItems) ||
      cartItems.length === 0
    ) {
      return res.status(400).json({
        error: "Customer details, address, and at least one cart item are required.",
      });
    }

    if (!supabase) {
      return res.status(500).json({
        error:
          "Supabase is not configured on the server (missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY in .env).",
      });
    }

    for (const item of cartItems) {
      const { data: success, error } = await supabase.rpc("decrement_stock", {
        product_id: item.id,
        qty: item.quantity,
      });

      if (error || !success) {
        return res.status(409).json({
          error: `Sorry, "${item.name}" no longer has enough stock.`,
        });
      }
    }

    const { error: supabaseError } = await supabase
      .from("orders")
      .insert([
        {
          customer_name: customerName,
          email,
          phone,
          address,
          city,
          postcode,
          country,
          items: cartItems,
          subtotal,
          shipping,
          total,
          status: "new",
        },
      ]);

    if (supabaseError) { 
      console.error("Order insert error:", supabaseError);

      return res.status(500).json({
        error: "Order could not be saved.",
        details: supabaseError.message,
      });
    }

    await resend.emails.send({
      from: "BrickHub <onboarding@resend.dev>",
      to: OWNER_EMAIL,
      subject: `New BrickHub Order - ${customerName}`,
      html: `
        <h2>New Order Received</h2>

        <p><strong>Name:</strong> ${escapeHtml(customerName)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>

        <p><strong>Address:</strong></p>
        <p>
          ${escapeHtml(address)}<br/>
          ${escapeHtml(city)}<br/>
          ${escapeHtml(postcode)}<br/>
          ${escapeHtml(country)}
        </p>

        <h3>Total: $${escapeHtml(total)}</h3>
      `,
    });

    await resend.emails.send({
      from: "BrickHub <onboarding@resend.dev>",
      to: email,
      subject: "Your BrickHub Order Confirmation",
      html: `
        <h2>Thanks for your order, ${escapeHtml(customerName)}!</h2>

        <p>We received your order successfully.</p>

        <p><strong>Total:</strong> $${escapeHtml(total)}</p>

        <p>We’ll contact you with shipping updates soon.</p>
      `,
    });

    res.json({
      message: "Order placed successfully.",
    });
  } catch (error) {
    console.error("Order route error:", error);

    res.status(500).json({
      error: "Order failed.",
      details: error.message,
    });
  }
});


app.get("/api/products", searchLimiter, async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({
        error:
          "Supabase is not configured on the server (missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY in .env).",
      });
    }

    const { type } = req.query; // "set" | "minifig" | undefined
    let query = supabase.from("products").select("*");
    if (type) query = query.eq("type", type);

    const { data, error } = await query;

    if (error) {
      console.error("Products fetch error:", error);
      return res.status(500).json({ error: "Failed to load products." });
    }

    res.json(data);
  } catch (error) {
    console.error("Products route error:", error);
    res.status(500).json({ error: "Failed to load products.", details: error.message });
  }
});

app.get("/api/products/:id", searchLimiter, async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({
        error:
          "Supabase is not configured on the server (missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY in .env).",
      });
    }

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", req.params.id)
      .single();

    if (error) return res.status(404).json({ error: "Product not found." });
    res.json(data);
  } catch (error) {
    console.error("Product fetch error:", error);
    res.status(500).json({ error: "Failed to load product.", details: error.message });
  }
});

// Admin panel routes
// Every route under /api/admin/* requires the x-admin-password header to
// match ADMIN_PASSWORD from .env.
const requireAdminPassword = (req, res, next) => {
  if (!ADMIN_PASSWORD) {
    return res.status(500).json({
      error: "Admin panel is not configured on the server (missing ADMIN_PASSWORD in .env).",
    });
  }

  if (req.get("x-admin-password") !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Incorrect admin password." });
  }

  next();
};

app.use("/api/admin", requireAdminPassword);

app.get("/api/admin/products", searchLimiter, async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({
        error:
          "Supabase is not configured on the server (missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY in .env).",
      });
    }

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      console.error("Admin products fetch error:", error);
      return res.status(500).json({ error: "Failed to load products." });
    }

    res.json(data);
  } catch (error) {
    console.error("Admin products route error:", error);
    res.status(500).json({ error: "Failed to load products.", details: error.message });
  }
});

app.patch("/api/admin/products/:id", formLimiter, async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({
        error:
          "Supabase is not configured on the server (missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY in .env).",
      });
    }

    const { price, stock } = req.body;
    const updates = {};

    if (price !== undefined) {
      const parsedPrice = Number(price);
      if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
        return res.status(400).json({ error: "Price must be a non-negative number." });
      }
      updates.price = parsedPrice;
    }

    if (stock !== undefined) {
      const parsedStock = Number(stock);
      if (!Number.isInteger(parsedStock) || parsedStock < 0) {
        return res.status(400).json({ error: "Stock must be a non-negative whole number." });
      }
      updates.stock = parsedStock;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "Provide price and/or stock to update." });
    }

    const { data, error } = await supabase
      .from("products")
      .update(updates)
      .eq("id", req.params.id)
      .select()
      .single();

    if (error) {
      console.error("Admin product update error:", error);
      return res.status(500).json({ error: "Failed to update product." });
    }

    res.json(data);
  } catch (error) {
    console.error("Admin product update route error:", error);
    res.status(500).json({ error: "Failed to update product.", details: error.message });
  }
});

app.get("/api/admin/orders", searchLimiter, async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({
        error:
          "Supabase is not configured on the server (missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY in .env).",
      });
    }

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Admin orders fetch error:", error);
      return res.status(500).json({ error: "Failed to load orders." });
    }

    res.json(data);
  } catch (error) {
    console.error("Admin orders route error:", error);
    res.status(500).json({ error: "Failed to load orders.", details: error.message });
  }
});

app.get("/api/admin/requests", searchLimiter, async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({
        error:
          "Supabase is not configured on the server (missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY in .env).",
      });
    }

    const { data, error } = await supabase
      .from("sourcing_request")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Admin requests fetch error:", error);
      return res.status(500).json({ error: "Failed to load requests." });
    }

    res.json(data);
  } catch (error) {
    console.error("Admin requests route error:", error);
    res.status(500).json({ error: "Failed to load requests.", details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});