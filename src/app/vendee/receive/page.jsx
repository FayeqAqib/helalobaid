import { Card, CardHeader } from "@/components/ui/card";
import { DataTableReceive } from "@/components/vendeeFeatures/transactions/receive/Table";
import { getAllReceive } from "@/services/vendeeReceiveService";

export default async function Page({ searchParams }) {
  const filter = await searchParams;

  const data = await getAllReceive(filter);

  return (
    <Card className={"p-5 shadow-xl gap-0"}>
      <CardHeader className={"text-right "}>
        <h2 className={"text-2xl font-bold"}>دریافتی ها</h2>
      </CardHeader>

      <DataTableReceive
        data={data.result?.result || []}
        count={data.result?.count}
      />
    </Card>
  );
}
