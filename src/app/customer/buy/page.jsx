import { DataTableBuy } from "@/components/features/buy/Table";
import { Card, CardHeader } from "@/components/ui/card";
import { getAllbuy } from "@/services/buyService";

import React from "react";

export default async function Page({ searchParams }) {
  const filter = await searchParams;

  const data = await getAllbuy(filter);
  console.log(data, "data");
  return (
    <Card className={"p-5 shadow-xl size-full gap-0"}>
      <CardHeader className={"text-right "}>
        <h2 className={"text-2xl font-bold"}>خرید ها</h2>
      </CardHeader>

      <DataTableBuy
        data={data.result?.result || []}
        count={data.result?.count}
      />
    </Card>
  );
}
