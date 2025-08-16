import mongoose from "mongoose";
import jalaliMoment from "moment-jalaali";

const VendeeCostSchema = new mongoose.Schema({
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
  costTitle: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: [1, "مقدار باید بزرگ تر از 0 باشد"],
  },
  image: String,
  details: {
    type: String,
    required: false,
  },
});

VendeeCostSchema.pre("save", function (next) {
  if (this.date) {
    this.afgDate = jalaliMoment(this.date).format("jYYYY/jM");
  }
  next();
});

export const VendeeCost =
  mongoose.models.VendeeCost || mongoose.model("VendeeCost", VendeeCostSchema);
