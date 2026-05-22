import { readFileSync, writeFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { randomUUID } from "crypto";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, "..", "db.json");

// ─── Helpers ──────────────────────────────────────────────────────────────────

const readDB = () => {
  if (!existsSync(DB_PATH)) {
    writeFileSync(DB_PATH, JSON.stringify({ credits: [] }, null, 2));
  }
  return JSON.parse(readFileSync(DB_PATH, "utf-8"));
};

const writeDB = (data) => {
  writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
};

// ─── Controllers ──────────────────────────────────────────────────────────────

// GET /credits
export const getAllCredits = (_req, res) => {
  try {
    const db = readDB();
    res.json(db.credits);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// POST /credits
export const createCredit = (req, res) => {
  try {
    const { name, date, price, phone } = req.body;

    if (!name || !date || !price || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const db = readDB();
    const newCredit = {
      id: randomUUID(),
      name,
      date,
      price,
      phone,
      createdAt: new Date().toISOString(),
    };

    db.credits.push(newCredit);
    writeDB(db);

    res.status(201).json(newCredit);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// PUT /credits/:id
export const updateCredit = (req, res) => {
  try {
    const { id } = req.params;
    const { name, date, price, phone } = req.body;

    const db = readDB();
    const idx = db.credits.findIndex((c) => c.id === id);

    if (idx === -1) {
      return res.status(404).json({ message: "Credit not found" });
    }

    db.credits[idx] = {
      ...db.credits[idx],
      ...(name !== undefined && { name }),
      ...(date !== undefined && { date }),
      ...(price !== undefined && { price }),
      ...(phone !== undefined && { phone }),
      updatedAt: new Date().toISOString(),
    };

    writeDB(db);
    res.json(db.credits[idx]);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// DELETE /credits/:id
export const deleteCredit = (req, res) => {
  try {
    const { id } = req.params;
    const db = readDB();
    const idx = db.credits.findIndex((c) => c.id === id);

    if (idx === -1) {
      return res.status(404).json({ message: "Credit not found" });
    }

    db.credits.splice(idx, 1);
    writeDB(db);

    res.json({ message: "Credit deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
