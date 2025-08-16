import { DataTableTransfer } from "@/components/features/transactions/transfer/Table";
import { Card, CardHeader } from "@/components/ui/card";
import { getAllTransfer } from "@/services/transferService";

export default async function Page({ searchParams }) {
  const filter = await searchParams;

  const data = await getAllTransfer(filter);

  return (
    <Card className={"p-5 shadow-xl gap-0"}>
      <CardHeader className={"text-right "}>
        <h2 className={"text-2xl font-bold"}>انتقال پول </h2>
      </CardHeader>

      <DataTableTransfer
        data={data.result?.result || []}
        count={data.result?.count || 0}
      />
    </Card>
  );
}
