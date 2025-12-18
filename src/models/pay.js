import mongoose from "mongoose";
import jalaliMoment from "moment-jalaali";

const paySchema = new mongoose.Schema({
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
  type: {
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
    _id: String,
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

paySchema.pre("save", function (next) {
  if (this.date) {
    this.afgDate = jalaliMoment(this.date).format("jYYYY/jM");
  }
  next();
});

export const Pay = mongoose.models.Pay || mongoose.model("Pay", paySchema);
