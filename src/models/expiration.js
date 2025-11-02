import mongoose from "mongoose";

const expirationSchema = new mongoose.Schema({
  expiring: {
    type: Number,
    min: 0,
    default: 1,
  },
  count: {
    type: Number,
    min: 0,
    default: 15,
  },
});

export const Expiration =
  mongoose.models.Expiration || mongoose.model("Expiration", expirationSchema);
