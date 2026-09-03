import mongoose from "mongoose";

export async function connectDB() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error("MONGO_URI is not set. Copy .env.example to .env and fill it in.");
  }

  mongoose.set("strictQuery", true);

  // Fail fast on startup instead of letting requests hang for 30s.
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 });

  const { host, name } = mongoose.connection;
  console.log(`✅ MongoDB connected → ${host}/${name}`);

  mongoose.connection.on("error", (err) => {
    console.error("❌ MongoDB error:", err.message);
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("⚠️  MongoDB disconnected");
  });

  return mongoose.connection;
}
