import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // هش شده
  role: {
    type: String,
    required: true,
    enum: ["customer", "admin"],
    default: "customer",
  }, // هش شده
});

// export const User = mongoose.models.User || mongoose.model("User", UserSchema);
export const User = mongoose.models.User || mongoose.model("User", userSchema);
