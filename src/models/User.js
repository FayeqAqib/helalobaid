import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // هش شده
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["vendee", "admin", "employe"],
    default: "customer",
  }, // هش شده
});

export const User = mongoose.models.User || mongoose.model("User", userSchema);
