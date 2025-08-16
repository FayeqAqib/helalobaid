import { DataTableCost } from "@/components/features/cost/Table";
import { Card, CardHeader } from "@/components/ui/card";
import { getAllCost } from "@/services/costService";
import React from "react";

export default async function page({ searchParams }) {
  const filter = await searchParams;

  const data = await getAllCost(filter);
  return (
    <Card className={"p-5 shadow-xl gap-0"}>
      <CardHeader className={"text-right "}>
        <h2 className={"text-2xl font-bold"}> مصارف</h2>
      </CardHeader>

      <DataTableCost
        data={data.result?.result || []}
        count={data.result?.count}
      />
    </Card>
  );
}
