import mongoose from "mongoose";
import "@/models/unit";
import "@/models/product";
import "@/models/depot";
import "@/models/items";

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME;

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(
        `${MONGODB_URI}${DB_NAME}?authSource=admin&replicaSet=rs0&directConnection=true`
      )
      .then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;

  return cached.conn;
}
