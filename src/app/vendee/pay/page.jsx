import { Card, CardHeader } from "@/components/ui/card";
import { DataTablePay } from "@/components/vendeeFeatures/transactions/pay/Table";
import { getAllPay } from "@/services/vendeePayService";

export default async function Page({ searchParams }) {
  const filter = await searchParams;

  const data = await getAllPay(filter);

  return (
    <Card className={"p-5 shadow-xl gap-0"}>
      <CardHeader className={"text-right "}>
        <h2 className={"text-2xl font-bold"}>پرداخت ها</h2>
      </CardHeader>

      <DataTablePay
        data={data.result?.result || []}
        count={data.result?.count}
      />
    </Card>
  );
}
