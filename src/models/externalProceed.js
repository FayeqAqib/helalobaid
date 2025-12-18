import mongoose from "mongoose";
import jalaliMoment from "moment-jalaali";

const externalProceedSchema = new mongoose.Schema({
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
  externalProceedTitle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProceedTital",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: [1, "Amount must be greater than 0"],
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

externalProceedSchema.pre("save", function (next) {
  if (this.date) {
    this.afgDate = jalaliMoment(this.date).format("jYYYY/jM");
  }
  next();
});

export const ExternalProceed =
  mongoose.models.ExternalProceed ||
  mongoose.model("ExternalProceed", externalProceedSchema);
