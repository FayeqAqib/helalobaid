import { connectDB } from "@/lib/db";
import { Account } from "@/models/account";

import { createUser } from "@/services/userServer";

const baseUrl = process.env.NEXTAUTH_URL;
export async function GET() {
  try {
    const db = await connectDB();
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
    return new Response(JSON.stringify("بکاپ همه کالکشن‌ها با موفقیت حذف شد"), {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": `${baseUrl}`,
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    console.log(err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
