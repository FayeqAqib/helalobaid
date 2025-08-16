import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function page() {
  const session = await auth();
  if (
    session?.user?._doc?.role === "employe" ||
    session?.user?._doc?.role === "admin"
  ) {
    return redirect("/customer/home");
  }

  if (session?.user?._doc.role === "vendee") {
    return redirect("/vendee/home");
  }

  return null;
}
