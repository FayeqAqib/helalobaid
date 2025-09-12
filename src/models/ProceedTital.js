import mongoose from "mongoose";

const proceedTitalSchema = new mongoose.Schema({
  date: {
    type: Date, // Example: "2024/5/3"
    required: true,
    default: new Date(),
  },
  name: {
    type: String,
    required: true,
  },

  details: {
    type: String,
    required: false,
  },
});

export const ProceedTital =
  mongoose.models.ProceedTital ||
  mongoose.model("ProceedTital", proceedTitalSchema);
