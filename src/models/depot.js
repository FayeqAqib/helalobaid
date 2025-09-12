import mongoose from "mongoose";

const depotSchema = new mongoose.Schema({
  date: {
    type: Date, // Example: "2024/5/3"
    required: true,
    default: new Date(),
  },
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: false,
  },
  lord: {
    type: String,
    required: false,
  },
  phoneNumber: {
    type: String,
    required: false,
  },
  image: String,
  details: {
    type: String,
    required: false,
  },
});

export const Depot =
  mongoose.models.Depot || mongoose.model("Depot", depotSchema);
