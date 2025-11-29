import mongoose from "mongoose";
import jalaliMoment from "moment-jalaali";

const depotItemsSchema = new mongoose.Schema(
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
    item: String,
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
      min: [0, "مقدار رسید باید 1 یا یک عدد مثبت باشد"],
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
    details: {
      type: String,
      required: false,
    },
    createBy: String,
  },
  {
    timestamps: true, // اضافه کردن createdAt و updatedAt به صورت خودکار
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

depotItemsSchema.pre("save", function (next) {
  if (this.date) {
    this.afgDate = jalaliMoment(this.date).format("jYYYY/jM");
  }
  next();
});

export const DepotItems =
  mongoose.models.DepotItems || mongoose.model("DepotItems", depotItemsSchema);
