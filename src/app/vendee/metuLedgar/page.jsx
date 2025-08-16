import { Card, CardHeader } from "@/components/ui/card";
import { DataTableMetuLedger } from "@/components/vendeeFeatures/metuLedgar/Table";

import { getCompanyAccount } from "@/services/vendeeAccountService";
import { getMetuLedger } from "@/services/vendeeLedgarService";
import React from "react";

export default async function Page({ searchParams }) {
  const filter = await searchParams;
  const data = await getMetuLedger({ date: filter?.date });
  const metuBalance = await getCompanyAccount();

  return (
    <Card className={"p-5 shadow-xl gap-0"}>
      <CardHeader className={"text-right "}>
        <h2 className={"text-2xl font-bold"}> لیجر میتیو</h2>
      </CardHeader>

      <DataTableMetuLedger
        data={data.result?.allTransactionsArray || []}
        metuBalance={metuBalance.result?.METUbalance}
      />
    </Card>
  );
}
