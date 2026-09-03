import mongoose from "mongoose";

export function notFound(_req, res) {
  res.status(404).json({ message: "Route topilmadi" });
}

// Turns Mongoose's error shapes into clean 400s so the UI can show something useful.
export function errorHandler(err, _req, res, _next) {
  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({
      message: "Ma'lumotlar noto'g'ri",
      errors: Object.fromEntries(
        Object.entries(err.errors).map(([field, e]) => [field, e.message])
      ),
    });
  }

  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({ message: "Noto'g'ri ID" });
  }

  console.error("Unhandled error:", err);
  res.status(err.status || 500).json({ message: err.message || "Server xatosi" });
}

// Lets async controllers throw without a try/catch in every handler.
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
