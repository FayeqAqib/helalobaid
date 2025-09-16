import mongoose from "mongoose";
import jalaliMoment from "moment-jalaali";

const productTransferSchema = new mongoose.Schema({
  date: {
    type: Date, // Example: "2024/5/3"
    required: true,
    default: new Date(),
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Depot",
    required: true,
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Depot",
    required: true,
  },
  unit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Unit",
    required: true,
  },
  count: {
    type: Number,
    required: false,
    min: [1, "مقدار رسید باید 1  یا یک عدد مثبت باشد"],
  },
  image: String,
  details: {
    type: String,
    required: false,
  },
});

export const ProductTransfer =
  mongoose.models.ProductTransfer ||
  mongoose.model("ProductTransfer", productTransferSchema);
