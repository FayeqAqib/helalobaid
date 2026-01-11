import mongoose from "mongoose";

const financialAccountSchema = new mongoose.Schema({
  date: { type: Date, default: () => new Date() },
  name: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: true,
  },
  credit: { type: Number, required: true },
  debit: { type: Number, required: true },
  balance: { type: Number, required: true },
});

export const FinancialAccount =
  mongoose.models.FinancialAccount ||
  mongoose.model("FinancialAccount", financialAccountSchema);
