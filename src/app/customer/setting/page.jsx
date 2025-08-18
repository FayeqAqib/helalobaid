import { BackupCard } from "@/components/features/setting/backupCard";
import { ExportDataCard } from "@/components/features/setting/exportDateCard";
import { DataTableUser } from "@/components/features/setting/UserTable";
import { Card, CardHeader } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { BackUp } from "@/models/backUp";
import { getAllUsers } from "@/services/userServer";
import { redirect } from "next/navigation";

export default async function Page({ searchParams }) {
  const session = await auth();

  if (session.user._doc.role !== "admin") {
    redirect("/customer/home");
    return null;
  }
  const filter = await searchParams;

  const data = await getAllUsers(filter);
  const backup = await BackUp.findOne({}, { _id: 0 });

  return (
    <Card className={"p-5 shadow-xl gap-0"}>
      <CardHeader className={"text-right mb-7"}>
        <h2 className={"text-2xl font-bold"}>تنظیمات</h2>
      </CardHeader>
      <div className="flex flex-col lg:flex-row justify-between gap-4">
        <ExportDataCard />
        <BackupCard backup={backup} />
      </div>
      <DataTableUser
        data={data.result?.result || []}
        count={data.result?.count}
      />
    </Card>
  );
}
