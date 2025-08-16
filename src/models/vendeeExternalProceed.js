import mongoose from "mongoose";
import jalaliMoment from "moment-jalaali";

const VendeeExternalProceedSchema = new mongoose.Schema({
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
  externalProceedTitle: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: [1, "Amount must be greater than 0"],
  },
  image: String,
  details: {
    type: String,
    required: false,
  },
});

VendeeExternalProceedSchema.pre("save", function (next) {
  if (this.date) {
    this.afgDate = jalaliMoment(this.date).format("jYYYY/jM");
  }
  next();
});

export const VendeeExternalProceed =
  mongoose.models.VendeeExternalProceed ||
  mongoose.model("VendeeExternalProceed", VendeeExternalProceedSchema);
