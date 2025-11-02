import Tab from "@/components/features/setting/tabs";

import { Card, CardHeader } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { BackUp } from "@/models/backUp";
import { findBills } from "@/services/bill";
import { findExpiration } from "@/services/expirationService";

import { getAllUsers } from "@/services/userServer";
import { redirect } from "next/navigation";

export default async function Page({ searchParams }) {
  const session = await auth();

  if (session?.user._doc.role !== "admin") {
    redirect("/customer/home");
    return null;
  }

  const filter = await searchParams;

  const data = await getAllUsers(filter);
  const backup = await BackUp.findOne({}, { _id: 0 });

  const expiration = await findExpiration();
  const bill = await findBills();

  return (
    <Card className={"p-5 shadow-xl gap-0"}>
      <CardHeader className={"text-right mb-7"}>
        <h2 className={"text-2xl font-bold"}>تنظیمات</h2>
      </CardHeader>
      <Tab
        data={data}
        backup={backup}
        bill={bill?.result}
        expiration={expiration?.result}
      />
    </Card>
  );
}
