import mongoose from "mongoose";
import jalaliMoment from "moment-jalaali";

const accountSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    default: () => new Date(),
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
    enum: ["employe", "bank", "buyer", "saller", "company"],
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
  image: { type: String },
  // 'قرض گرفتن'
  borrow: { type: Number, default: 0, min: 0 },
  vendeeBorrow: { type: Number, default: 0, min: 0 },
  // 'قرض دادن'
  lend: { type: Number, default: 0, min: 0 },
  vendeeLend: { type: Number, default: 0, min: 0 },
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

accountSchema.pre("save", function (next) {
  if (this.date) {
    this.afgDate = jalaliMoment(this.date).format("jYYYY/jM");
  }
  next();
});

export const Account =
  mongoose.models.Account || mongoose.model("Account", accountSchema);
