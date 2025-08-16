import mongoose from "mongoose";
import jalaliMoment from "moment-jalaali";

const saleSchema = new mongoose.Schema({
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
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: true,
  },
  cashAmount: {
    type: Number,
    required: false,
    min: [0, "مقدار رسید باید 0 یا یک عدد مثبت باشد"],
  },
  lendAmount: {
    type: Number,
    required: false,
    min: [0, "مقدار باقی باید 0 یا یک عدد مثبت باشد"],
  },
  totalAmount: {
    type: Number,
    required: true,
    min: [1, "مقدار مجموع پول باید یک عدد مثبت باشد"],
  },
  cent: {
    type: Number,
    required: true,
    min: [0, "  قیصدی باید 0 یا بزرگ تر از 0 باشد"],
    max: [100, " فیصدی با 100 یا کمتر از 100 باشد"],
  },
  metuAmount: {
    type: Number,
    required: true,
    min: [0, "مقدار  میتیو باید یک عدد مثبت  باشد"],
  },
  image: { type: String },
  details: {
    type: String,
    required: false,
  },
});

saleSchema.pre("save", function (next) {
  if (this.date) {
    this.afgDate = jalaliMoment(this.date).format("jYYYY/jM");
  }
  next();
});

export const Sale = mongoose.models.Sale || mongoose.model("Sale", saleSchema);
