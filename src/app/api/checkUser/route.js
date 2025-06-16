import { User } from "@/models/User";
import { connectDB } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req) {
  const credentials = await req.json();
  await connectDB();
  const user = await User.findOne({
    username: credentials.username,
  });

  if (!user) {
    return new Response(JSON.stringify({ error: "کاربر پیدا نشد" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }
  const isValid = bcrypt.compareSync(credentials.password, user.password);

  if (!isValid) {
    return new Response(JSON.stringify({ error: "رمز عبور معتبر نیست" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }
  console.log(isValid, user);
  // Return user data as JSON, excluding sensitive fields like password
  const { password, ...userWithoutPassword } = user;
  return new Response(JSON.stringify(userWithoutPassword), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
