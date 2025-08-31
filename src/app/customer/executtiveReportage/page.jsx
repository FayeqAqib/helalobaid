import { DataTableExecuttiveReportage } from "@/components/features/executtiveReportage/Table";
import { Card, CardHeader } from "@/components/ui/card";

import { getaccountAlltransactions } from "@/services/ledgarServer";

import React from "react";

export default async function Page({ searchParams }) {
  const filter = await searchParams;

  const data = await getaccountAlltransactions(filter);

  return (
    <Card className={"p-5 shadow-xl size-full gap-0"}>
      <CardHeader className={"text-right "}>
        <h2 className={"text-2xl font-bold"}>گزارشات مفصل </h2>
      </CardHeader>

      <DataTableExecuttiveReportage
        data={data.result?.result || []}
        count={data.result?.count}
        account={data.result?.account}
      />
    </Card>
  );
}
