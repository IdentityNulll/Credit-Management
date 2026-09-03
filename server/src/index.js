import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import creditRoutes from "./routes/creditRoutes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

const app = express();
const PORT = process.env.PORT || 5555;

// A comma-separated allowlist; falls back to open CORS only if unset.
const allowedOrigins = process.env.CORS_ORIGIN?.split(",").map((o) => o.trim());

app.use(cors({ origin: allowedOrigins?.length ? allowedOrigins : "*" }));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", message: "Nasiya API ishlayapti" });
});

app.use("/api/credits", creditRoutes);

app.use(notFound);
app.use(errorHandler);

// Connect before listening — the old version served requests against a DB that
// was never connected, so every route silently fell back to a local file.
try {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`✅ Nasiya API → http://localhost:${PORT}`);
  });
} catch (err) {
  console.error("❌ Ishga tushmadi:", err.message);
  process.exit(1);
}
