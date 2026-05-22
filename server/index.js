import "dotenv/config";
import express from "express";
import cors from "cors";
import creditRoutes from "./routes/credits.js";

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/credits", creditRoutes);

// Health check
app.get("/", (_req, res) => {
  res.json({ status: "ok", message: "Nasiya API is running 🚀" });
});

// 404 fallback
app.use((_req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Nasiya API running at http://localhost:${PORT}`);
  console.log(`📁 Data stored in: db.json`);
});
