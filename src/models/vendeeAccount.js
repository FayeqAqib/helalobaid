import mongoose from "mongoose";
import jalaliMoment from "moment-jalaali";

const VendeeAccountSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    default: () => new Date(),
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: true,
  },
  afgDate: {
    type: String,
  },
  name: {
    type: String,
    required: true,
  },

  accountType: {
    type: String,
    enum: ["employe", "bank", "buyer", "saller"],
    required: true,
  },
  phoneNumber: {
    type: String,
    required: false,
    default: "",
  },
  address: {
    type: String,
    required: false,
    default: "",
  },
  // 'قرض گرفتن'
  borrow: { type: Number, default: 0, min: 0 },
  // 'قرض دادن'
  lend: { type: Number, default: 0, min: 0 },
  balance: { type: Number, default: 0, min: 0 },
  METUbalance: { type: Number, default: 0, min: 0 },
  email: {
    type: String,
    required: false,
    default: "",
  },
  details: {
    type: String,
    required: false,
    default: "",
  },
});

VendeeAccountSchema.pre("save", function (next) {
  if (this.date) {
    this.afgDate = jalaliMoment(this.date).format("jYYYY/jM");
  }
  next();
});

export const VendeeAccount =
  mongoose.models.VendeeAccount ||
  mongoose.model("VendeeAccount", VendeeAccountSchema);
