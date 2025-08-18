import mongoose from "mongoose";

const MONGODB_URI =
  "mongodb://root:m4YnX727YSgEox24WiIE11NITJV0l66bAkhxv5grxhV42Vi5qi8t189EGh0Rq8aD@77.37.45.9:20017/?directConnection=true";
// const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(`${MONGODB_URI}`)
      .then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;

  return cached.conn;
}
