import mongoose from "mongoose";

const costTitalSchema = new mongoose.Schema({
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

export const CostTital =
  mongoose.models.CostTital || mongoose.model("CostTital", costTitalSchema);
