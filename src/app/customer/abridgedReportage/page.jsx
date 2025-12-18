import { DataTableAbridgedReportage } from "@/components/features/abridgedReportage/Table";
import { DataTableExecuttiveReportage } from "@/components/features/executtiveReportage/Table";
import { Card, CardHeader } from "@/components/ui/card";
import { getAllAccount } from "@/services/accountService";
import { findCurrency } from "@/services/currencyServices";

import React from "react";

export default async function Page({ searchParams }) {
  const filter = await searchParams;

  const crre = filter?.currency?.split("_")[1];

  const data = await getAllAccount({ name: filter.name });
  const currency = await findCurrency(
    crre
      ? {
          _id: crre,
        }
      : {}
  );

  console.log(currency);
  return (
    <Card className={"p-5 shadow-xl size-full gap-0"}>
      <CardHeader className={"text-right "}>
        <h2 className={"text-2xl font-bold"}>گزارشات مختصر </h2>
      </CardHeader>

      <DataTableAbridgedReportage
        data={data.result?.result || []}
        count={data.result?.count}
        currencies={currency?.result?.[0]}
      />
    </Card>
  );
}
