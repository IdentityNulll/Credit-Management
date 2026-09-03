import Credit from "../models/Credit.js";
import { asyncHandler } from "../middleware/errorHandler.js";

// Accepts "1 500 000", "1500000" or 1500000 and returns a Number.
const parseAmount = (value) => {
  if (value === undefined || value === null || value === "") return undefined;
  const n = Number(String(value).replace(/\s/g, ""));
  return Number.isFinite(n) ? n : NaN;
};

// GET /api/credits?search=
export const getAllCredits = asyncHandler(async (req, res) => {
  const { search } = req.query;

  const filter = search?.trim()
    ? {
        $or: [
          { name: { $regex: search.trim(), $options: "i" } },
          { phone: { $regex: search.trim(), $options: "i" } },
        ],
      }
    : {};

  const credits = await Credit.find(filter).sort({ createdAt: -1 });

  res.json({
    credits,
    total: credits.reduce((sum, c) => sum + c.price, 0),
    count: credits.length,
  });
});

// GET /api/credits/:id
export const getCreditById = asyncHandler(async (req, res) => {
  const credit = await Credit.findById(req.params.id);
  if (!credit) return res.status(404).json({ message: "Nasiya topilmadi" });
  res.json(credit);
});

// POST /api/credits
export const createCredit = asyncHandler(async (req, res) => {
  const { name, date, phone } = req.body;
  const price = parseAmount(req.body.price);

  if (Number.isNaN(price)) {
    return res.status(400).json({ message: "Summa raqam bo'lishi kerak" });
  }

  const credit = await Credit.create({ name, date, price, phone });
  res.status(201).json(credit);
});

// PUT /api/credits/:id
export const updateCredit = asyncHandler(async (req, res) => {
  const { name, date, phone } = req.body;
  const price = parseAmount(req.body.price);

  if (Number.isNaN(price)) {
    return res.status(400).json({ message: "Summa raqam bo'lishi kerak" });
  }

  const updates = {
    ...(name !== undefined && { name }),
    ...(date !== undefined && { date }),
    ...(price !== undefined && { price }),
    ...(phone !== undefined && { phone }),
  };

  const credit = await Credit.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });

  if (!credit) return res.status(404).json({ message: "Nasiya topilmadi" });
  res.json(credit);
});

// PATCH /api/credits/:id/amount  { delta: 50000 }
// Atomic $inc so two quick +/- taps can't clobber each other — the old version
// read the price into the client, added to it, then wrote the whole doc back.
export const adjustAmount = asyncHandler(async (req, res) => {
  const delta = parseAmount(req.body.delta);

  if (delta === undefined || Number.isNaN(delta)) {
    return res.status(400).json({ message: "Miqdor raqam bo'lishi kerak" });
  }

  const credit = await Credit.findById(req.params.id);
  if (!credit) return res.status(404).json({ message: "Nasiya topilmadi" });

  if (credit.price + delta < 0) {
    return res.status(400).json({ message: "Summa manfiy bo'lishi mumkin emas" });
  }

  credit.price += delta;
  await credit.save();

  res.json(credit);
});

// DELETE /api/credits/:id
export const deleteCredit = asyncHandler(async (req, res) => {
  const credit = await Credit.findByIdAndDelete(req.params.id);
  if (!credit) return res.status(404).json({ message: "Nasiya topilmadi" });
  res.json({ message: "Nasiya o'chirildi", id: req.params.id });
});
