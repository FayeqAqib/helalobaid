import { DataTableSale } from "@/components/features/sale/Table";
import { Card, CardHeader } from "@/components/ui/card";
import { getAllSales } from "@/services/saleService";
import React from "react";

export default async function Page({ searchParams }) {
  const filter = await searchParams;

  const data = await getAllSales(filter);
  return (
    <Card className={"p-5 shadow-xl gap-0"}>
      <CardHeader className={"text-right "}>
        <h2 className={"text-2xl font-bold"}>فروش ها</h2>
      </CardHeader>
      <DataTableSale
        data={data.result?.result || []}
        count={data.result?.count}
      />
    </Card>
  );
}
