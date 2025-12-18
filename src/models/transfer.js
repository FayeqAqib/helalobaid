import mongoose from "mongoose";
import jalaliMoment from "moment-jalaali";

const transferSchema = new mongoose.Schema({
  date: {
    type: Date, // Example: "2024/5/3"
    required: true,
    default: new Date(),
  },
  afgDate: {
    type: String,
  },
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: true,
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: true,
  },
  amount: {
    type: Number,
    required: false,
    min: [0, "مقدار رسید باید 0 یا یک عدد مثبت باشد"],
  },
  currency: {
    name: String,
    code: String,
    rate: Number,
  },
  image: String,
  details: {
    type: String,
    required: false,
  },
});

transferSchema.pre("save", function (next) {
  if (this.date) {
    this.afgDate = jalaliMoment(this.date).format("jYYYY/jM");
  }
  next();
});

export const Transfer =
  mongoose.models.Transfer || mongoose.model("Transfer", transferSchema);
