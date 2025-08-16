import { Account } from "@/models/account";
import { User } from "@/models/User";
import { createUser } from "@/services/userServer";
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

    await createUser({
      username: "company",
      password: "asdfghjk",
      role: "admin",
      owner: process.env.COMPANY_ID,
    });
    return Response.json({ message: "بکاپ همه کالکشن‌ها با موفقیت انجام شد" });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
