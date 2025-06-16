import React from "react";

import { Card, CardHeader } from "@/components/ui/card";

import { DataTableDetils } from "@/components/features/register/detials/Table";
import { getaccountAlltransactions } from "@/services/ledgarServer";

export default async function page({ params, searchParams }) {
  const filter = await searchParams;
  const param = await params;

  const data = await getaccountAlltransactions({ _id: param.detials, filter });

  return (
    <div className="">
      <Card className={"p-5 shadow-xl gap-0"}>
        <CardHeader className={"text-right "}>
          <h2 className={"text-2xl font-bold"}> {data.result.account.name}</h2>
          <h2 className={"text-2xl font-bold"}>
            {" "}
            {data.result.account.accountType}
          </h2>
        </CardHeader>
        <DataTableDetils
          data={data.result.result || []}
          count={data.result.count}
        />
      </Card>
    </div>
  );
}
