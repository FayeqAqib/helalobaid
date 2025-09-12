import mongoose from "mongoose";

const unitSchema = new mongoose.Schema({
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

export const Unit = mongoose.models.Unit || mongoose.model("Unit", unitSchema);
