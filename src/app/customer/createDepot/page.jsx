import { DataTableCreateDepot } from "@/components/features/createDepot/Table";
import { Card, CardHeader } from "@/components/ui/card";

import { getAllDepot } from "@/services/depotService";
import React from "react";

export default async function page({ searchParams }) {
  const filter = await searchParams;

  const data = await getAllDepot(filter);
  return (
    <Card className={"p-5 shadow-xl gap-0"}>
      <CardHeader className={"text-right "}>
        <h2 className={"text-2xl font-bold"}> ایجاد گدام</h2>
      </CardHeader>

      <DataTableCreateDepot
        data={data.result?.result || []}
        count={data.result?.count}
      />
    </Card>
  );
}
