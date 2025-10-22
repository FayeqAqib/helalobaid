import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  date: {
    type: Date, // Example: "2024/5/3"
    required: true,
    default: new Date(),
  },

  name: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
  },
  companyName: {
    type: String,
  },
  image: String,
  details: {
    type: String,
    required: false,
  },
});

export const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);
