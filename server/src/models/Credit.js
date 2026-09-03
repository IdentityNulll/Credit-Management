import mongoose from "mongoose";

const creditSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Ism kiritilishi shart"],
      trim: true,
      minlength: [2, "Ism juda qisqa"],
      maxlength: [100, "Ism juda uzun"],
    },
    // Debt date as YYYY-MM-DD. Kept as a string so it maps 1:1 to <input type="date">
    // with no timezone shifting, which is what bit the old version.
    date: {
      type: String,
      required: [true, "Sana kiritilishi shart"],
      match: [/^\d{4}-\d{2}-\d{2}$/, "Sana YYYY-MM-DD ko'rinishida bo'lishi kerak"],
    },
    // Stored as a Number (so'm). The old version stored this as a String,
    // which made every arithmetic operation a string-concat hazard.
    price: {
      type: Number,
      required: [true, "Summa kiritilishi shart"],
      min: [0, "Summa manfiy bo'lishi mumkin emas"],
    },
    phone: {
      type: String,
      required: [true, "Telefon raqam kiritilishi shart"],
      trim: true,
      match: [/^\+998\d{9}$/, "Telefon raqam +998XXXXXXXXX ko'rinishida bo'lishi kerak"],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (_doc, ret) => {
        delete ret._id;
        return ret;
      },
    },
  }
);

// Name/phone search hits this on every keystroke in the UI.
creditSchema.index({ name: 1 });
creditSchema.index({ createdAt: -1 });

export default mongoose.model("Credit", creditSchema);
