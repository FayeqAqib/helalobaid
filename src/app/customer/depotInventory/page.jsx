import { DataTableDepotInventory } from "@/components/features/depotInventory/Table";
import { Card, CardHeader } from "@/components/ui/card";

import { getAllDepotItems } from "@/services/depotItemsService";
import React from "react";

export default async function page({ searchParams }) {
  const filter = await searchParams;

  const data = await getAllDepotItems(filter);

  return (
    <Card className={"p-5 shadow-xl gap-0"}>
      <CardHeader className={"text-right "}>
        <h2 className={"text-2xl font-bold"}> ثبت موجودی گدام</h2>
      </CardHeader>

      <DataTableDepotInventory
        data={data.result?.result || []}
        count={data.result?.count}
      />
    </Card>
  );
}
