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
  billNumber: {
    type: String,
    unique: true,
    required: true,
    index: true,
  },
  income: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: true,
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
  },
  items: [
    {
      id: {
        type: mongoose.Types.ObjectId,
        ref: "Items",
        required: true,
      },
      product: {
        type: mongoose.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      unit: {
        type: mongoose.Types.ObjectId,
        ref: "Unit",
        required: true,
      },
      depot: {
        type: mongoose.Types.ObjectId,
        ref: "Depot",
        required: true,
      },
      count: {
        type: Number,
        min: [1, "تعداد باید بزرگتر از 0 باشد"],
        required: true,
      },
      aveUnitAmount: {
        type: Number,
        required: true,
        min: [1, "مقدار قیمت اوسط باید 1 یا یک عدد مثبت باشد"],
      },
      saleAmount: {
        type: Number,
        min: [0, "تعداد باید بزرگتر از 0 باشد"],
        required: true,
      },
      discount: {
        type: Number,
        min: [0, "تعداد باید بزرگتر از 0 باشد"],
      },
      amountBeforDiscount: {
        type: Number,
        min: [0, "تعداد باید بزرگتر از 0 باشد"],
      },
      profit: {
        type: Number,
        min: [0, "تعداد باید بزرگتر از 0 باشد"],
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
    min: [1, "مقدار مجموع پول باید یک عدد مثبت باشد"],
  },
  totalAmountBeforDiscount: {
    type: Number,
    required: true,
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
  lendAmount: {
    type: Number,
    required: false,
    min: [0, "مقدار باقی باید 0 یا یک عدد مثبت باشد"],
  },
  totalProfit: {
    type: Number,
    required: false,
    min: [0, "مقدار باقی باید 0 یا یک عدد مثبت باشد"],
  },
  image: { type: String },
  details: String,
});

saleSchema.pre("save", function (next) {
  if (this.date) {
    this.afgDate = jalaliMoment(this.date).format("jYYYY/jM");
  }
  next();
});

export const Sale = mongoose.models.Sale || mongoose.model("Sale", saleSchema);
