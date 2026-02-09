import mongoose from "mongoose";

const backUpSchema = new mongoose.Schema({
  date: {
    type: Date, // e.g. "2024/5/3"
    required: true,
    default: () => new Date(),
  },
});

export const BackUp =
  mongoose.models.BackUp || mongoose.model("BackUp", backUpSchema);
