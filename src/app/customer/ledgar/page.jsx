import { DataTableLedger } from "@/components/features/ledgar/Table";
import { Card, CardHeader } from "@/components/ui/card";
import { getCompanyAccount } from "@/services/accountService";
import { findCurrency } from "@/services/currencyServices";
import { getLedgar } from "@/services/ledgarServer";
import React from "react";

export default async function Page({ searchParams }) {
  const filter = await searchParams;
  const curr = filter?.currency?.split("_")[1];
  const data = await getLedgar({
    date: filter?.date,
    currency: curr,
  });

  const currency = await findCurrency(curr ? { _id: curr } : {});
  const metuBalance = await getCompanyAccount();

  return (
    <Card className={"p-5 shadow-xl gap-0"}>
      <CardHeader className={"text-right "}>
        <h2 className={"text-2xl font-bold"}> لیجر </h2>
      </CardHeader>

      <DataTableLedger
        data={data.result?.allTransactionsArray || []}
        metuBalance={metuBalance?.result?.[0]?.balance}
        currency={currency?.result?.[0]}
      />
    </Card>
  );
}
