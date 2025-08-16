import mongoose from "mongoose";
import jalaliMoment from "moment-jalaali";

const VendeeReceiveSchema = new mongoose.Schema({
  date: {
    type: Date, // Example: "2024/5/3"
    required: true,
    default: new Date(),
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: true,
  },
  afgDate: {
    type: String,
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "VendeeAccount",
    required: true,
  },
  amount: {
    type: Number,
    required: false,
    min: [0, "مقدار رسید باید 0 یا یک عدد مثبت باشد"],
  },
  image: String,
  details: {
    type: String,
    required: false,
  },
});

VendeeReceiveSchema.pre("save", function (next) {
  if (this.date) {
    this.afgDate = jalaliMoment(this.date).format("jYYYY/jM");
  }
  next();
});

export const VendeeReceive =
  mongoose.models.VendeeReceive ||
  mongoose.model("VendeeReceive", VendeeReceiveSchema);
