import mongoose from "mongoose";

const creditSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    date: {
      type: String,
      required: [true, "Date is required"],
    },
    price: {
      type: String,
      required: [true, "Price is required"],
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
    // Expose virtual `id` field (string version of _id) to match frontend usage
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Remove _id and __v from the JSON output; `id` virtual is used instead
creditSchema.set("toJSON", {
  virtuals: true,
  transform: (_doc, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const Credit = mongoose.model("Credit", creditSchema);

export default Credit;
