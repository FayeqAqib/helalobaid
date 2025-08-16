import { Account } from "@/models/account";
import mongoose from "mongoose";
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";

export async function GET() {
  try {
    const db = await mongoose.connect(`${MONGODB_URI}/plaza`);
    await db.connection.dropDatabase();

    await Account.create({
      _id: process.env.COMPANY_ID,
      accountType: "company",
      name: "company",
    });
    return Response.json({ message: "بکاپ همه کالکشن‌ها با موفقیت انجام شد" });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
