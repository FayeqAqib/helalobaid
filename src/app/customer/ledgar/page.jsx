import { DataTableLedger } from "@/components/features/ledgar/Table";
import { Card, CardHeader } from "@/components/ui/card";
import { getCompanyAccount } from "@/services/accountService";
import { getLedgar } from "@/services/ledgarServer";
import React from "react";

export default async function Page({ searchParams }) {
  const filter = await searchParams;
  const data = await getLedgar({ date: filter?.date });
  const metuBalance = await getCompanyAccount();

  return (
    <Card className={"p-5 shadow-xl gap-0"}>
      <CardHeader className={"text-right "}>
        <h2 className={"text-2xl font-bold"}> لیجر </h2>
      </CardHeader>

      <DataTableLedger
        data={data.result?.allTransactionsArray || []}
        metuBalance={metuBalance?.result?.[0]?.balance}
      />
    </Card>
  );
}
