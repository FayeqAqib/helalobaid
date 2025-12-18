import mongoose from "mongoose";

const currencySchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true },
  rate: { type: Number, required: true },
  isBase: { type: Boolean, default: false },
});

export const Currency =
  mongoose.models.Currency || mongoose.model("Currency", currencySchema);
