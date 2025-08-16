import { Card, CardHeader } from "@/components/ui/card";
import { DataTableApplecation } from "@/components/vendeeFeatures/applecation/Table";
import { getAllVendeeApplecation } from "@/services/applecationService";

import React from "react";

export default async function page({ searchParams }) {
  const filter = await searchParams;

  // const data = await getAllCost(filter);
  const data = await getAllVendeeApplecation(filter);

  return (
    <Card className={"p-5 shadow-xl gap-0"}>
      <CardHeader className={"text-right "}>
        <h2 className={"text-2xl font-bold"}> درخاستی های خرید</h2>
      </CardHeader>

      <DataTableApplecation
        data={data.result?.result || []}
        count={data.result?.count}
      />
    </Card>
  );
}
