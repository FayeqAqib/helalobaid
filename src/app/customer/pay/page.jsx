import { DataTablePay } from "@/components/features/transactions/pay/Table";
import { Card, CardHeader } from "@/components/ui/card";
import { getAllPay } from "@/services/payService";

export default async function Page({ searchParams }) {
  const filter = await searchParams;

  const data = await getAllPay(filter);

  return (
    <Card className={"p-5 shadow-xl gap-0"}>
      <CardHeader className={"text-right "}>
        <h2 className={"text-2xl font-bold"}>پرداخت ها</h2>
      </CardHeader>

      <DataTablePay data={data.result.result || []} count={data.result.count} />
    </Card>
  );
}
