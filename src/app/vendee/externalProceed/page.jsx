import { Card, CardHeader } from "@/components/ui/card";
import { DataTableExternalProceed } from "@/components/vendeeFeatures/externalProceed/Table";
import { getAllExternalProceed } from "@/services/vendeeExternalProceedService";

import React from "react";

export default async function Page({ searchParams }) {
  const filter = await searchParams;

  const data = await getAllExternalProceed(filter);
  return (
    <Card className={"p-5 shadow-xl gap-0"}>
      <CardHeader className={"text-right "}>
        <h2 className={"text-2xl font-bold"}>عواید ها</h2>
      </CardHeader>

      <DataTableExternalProceed
        data={data.result?.result || []}
        count={data.result?.count}
      />
    </Card>
  );
}
