import mongoose from "mongoose";
import jalaliMoment from "moment-jalaali";

const buySchema = new mongoose.Schema(
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
    billNumber: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    saller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
      index: true,
    },
    income: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
      index: true,
    },
    cost: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cost",
      required: false,
    },
    items: [
      {
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
        expirationDate: {
          type: Date,
          required: false,
        },
        depot: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Depot",
          required: true,
        },
        details: String,
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: [1, "مقدار مجموع پول باید یک عدد مثبت باشد"],
    },
    transportCost: {
      type: Number,
      required: false,
      min: [0, "مقدار باقی باید 0 یا یک عدد مثبت باشد"],
    },
    totalCount: {
      type: Number,
      required: true,
    },
    cashAmount: {
      type: Number,
      required: false,
      min: [0, "مقدار رسید باید 0 یا یک عدد مثبت باشد"],
    },
    borrowAmount: {
      type: Number,
      required: false,
      min: [0, "مقدار باقی باید 0 یا یک عدد مثبت باشد"],
    },

    image: { type: String },
  },
  {
    timestamps: true, // اضافه کردن createdAt و updatedAt به صورت خودکار
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
buySchema.index({ saller: 1, billNumber: 1 }); // سرچ سریع
buySchema.index({ "items.product": 1, "items.depot": 1, "items.unit": 1 });

buySchema.pre("save", function (next) {
  if (this.date) {
    this.afgDate = jalaliMoment(this.date).format("jYYYY/jM");
  }
  next();
});

export const Buy = mongoose.models.Buy || mongoose.model("Buy", buySchema);
