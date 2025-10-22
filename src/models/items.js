import mongoose from "mongoose";
import jalaliMoment, { min } from "moment-jalaali";

const itemsSchema = new mongoose.Schema(
  {
    date: {
      type: Date, // e.g. "2024/5/3"
      required: true,
      default: () => new Date(),
      index: true,
    },
    afgDate: {
      type: String,
    },
    badgeNumber: {
      type: String,
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    count: {
      type: Number,
      required: true,
      min: [1, "مقدار رسید باید 1 یا یک عدد مثبت باشد"],
    },
    unit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Unit",
      required: true,
    },
    unitAmount: {
      type: Number,
      required: true,
      min: [1, "مقدار رسید باید 1 یا یک عدد مثبت باشد"],
    },
    aveUnitAmount: {
      type: Number,
      required: true,
      min: [1, "مقدار قیمت اوسط باید 1 یا یک عدد مثبت باشد"],
    },
    saleAmount: {
      type: Number,
      min: [0, ""],
    },
    expirationDate: {
      type: Date,
      required: false,
    },
    depot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Depot",
      required: true,
    },
  },
  {
    timestamps: true, // اضافه کردن createdAt و updatedAt به صورت خودکار
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

itemsSchema.pre("save", function (next) {
  if (this.date) {
    this.afgDate = jalaliMoment(this.date).format("jYYYY/jM");
  }
  next();
});
itemsSchema.index({ depot: 1, product: 1, unit: 1 });

export const Items =
  mongoose.models.Items || mongoose.model("Items", itemsSchema);
