import mongoose from "mongoose";

const currencySchema = new mongoose.Schema({
  code: { type: String, required: true },
  name: { type: String, required: true },
  Rate: { type: Number, required: true },
  isBase: { type: Boolean, default: false },
});

export const Currency =
  mongoose.models.Product || mongoose.model("Currency", currencySchema);
