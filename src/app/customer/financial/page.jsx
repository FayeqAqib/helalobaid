import { DataTableFinanatial } from "@/components/features/finantial/Table";
import { Card, CardHeader } from "@/components/ui/card";
import { getAllAccount } from "@/services/accountService";
import { getFinantial } from "@/services/finantialService";

import React from "react";

export default async function Page({ searchParams }) {
  const filter = await searchParams;

  let data;
  let finantial;
  if (filter?.name) {
    data = await getAllAccount({ name: filter.name });
    finantial = await getFinantial(filter);
  }
  return (
    <Card className={"p-5 shadow-xl size-full gap-0"}>
      <CardHeader className={"text-right "}>
        <h2 className={"text-2xl font-bold"}>گزارشات بیلانش شیت </h2>
      </CardHeader>

      <DataTableFinanatial
        data={finantial?.result?.result || []}
        count={finantial?.result?.count || 0}
        account={data?.result?.result?.[0]}
      />
    </Card>
  );
}
