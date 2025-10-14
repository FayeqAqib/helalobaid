import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Account } from "@/models/account";

import { createUser } from "@/services/userServer";

const baseUrl = process.env.NEXTAUTH_URL;
export async function GET(req, { params }) {
  const x = await params;
  if (req.url.split("?")[1] !== "code=500-501")
    return Response.json(
      { message: "شما اجازه دسترسی به این صفحه را ندارید" },
      { status: 500 }
    );
  try {
    const session = await auth();
    if (!session.user._doc.role || session.user._doc.role !== "admin") {
      return new Response(
        JSON.stringify("شما اجازه دسترسی به این صفحه را ندارید"),
        {
          status: 401,
          headers: {
            "Access-Control-Allow-Origin": `${baseUrl}`,
            "Content-Type": "application/json",
          },
        }
      );
    }
    const db = await connectDB();
    await db.connection.dropDatabase();

    await Account.create({
      _id: process.env.COMPANY_ID,
      accountType: "company",
      name: "خزانه شرکت",
    });

    await createUser({
      username: "admin",
      password: "admin123",
      role: "admin",
      owner: process.env.COMPANY_ID,
    });
    await createUser({
      username: "Kaaweshgaraan",
      password: "Kaawesh@1990",
      role: "admin",
      owner: process.env.COMPANY_ID,
    });
    await createUser({
      username: "demo",
      password: "123456",
      role: "employe",
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
    return Response.json({ error: err.message }, { status: 500 });
  }
}
