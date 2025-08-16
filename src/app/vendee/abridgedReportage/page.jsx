import { Card, CardHeader } from "@/components/ui/card";
import { DataTableAbridgedReportage } from "@/components/vendeeFeatures/abridgedReportage/Table";
import { getAllAccount } from "@/services/vendeeAccountService";

import React from "react";

export default async function Page({ searchParams }) {
  const filter = await searchParams;

  const data = await getAllAccount(filter);

  return (
    <Card className={"p-5 shadow-xl size-full gap-0"}>
      <CardHeader className={"text-right "}>
        <h2 className={"text-2xl font-bold"}>گذارشات مختصر </h2>
      </CardHeader>

      <DataTableAbridgedReportage
        data={data.result?.result || []}
        count={data.result?.count}
      />
    </Card>
  );
}
