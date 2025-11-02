import mongoose from "mongoose";

const billSchema = new mongoose.Schema({
  header: String,
  footer: String,
});

export const Bill = mongoose.models.Bill || mongoose.model("Bill", billSchema);
