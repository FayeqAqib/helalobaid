import mongoose from "mongoose";
import jalaliMoment from "moment-jalaali";

const marqueeSchema = new mongoose.Schema({
  text: {
    type: String, // Example: "2024/5/3"
    required: true,
  },
});

export const Marquee =
  mongoose.models.Marquee || mongoose.model("Marquee", marqueeSchema);
