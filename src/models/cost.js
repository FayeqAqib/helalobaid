import mongoose from "mongoose";
import jalaliMoment from "moment-jalaali";

const costSchema = new mongoose.Schema({
  date: {
    type: Date, // Example: "2024/5/3"
    required: true,
    default: new Date(),
  },
  afgDate: {
    type: String,
  },
  income: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: true,
  },
  costTital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CostTital",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: [1, "مقدار باید بزرگ تر از 0 باشد"],
  },
  image: String,
  details: {
    type: String,
    required: false,
  },
  createBy: String,
});

costSchema.pre("save", function (next) {
  if (this.date) {
    this.afgDate = jalaliMoment(this.date).format("jYYYY/jM");
  }
  next();
});

export const Cost = mongoose.models.Cost || mongoose.model("Cost", costSchema);
