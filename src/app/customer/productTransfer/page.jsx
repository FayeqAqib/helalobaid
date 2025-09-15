import { DataTableProductTransfer } from "@/components/features/productTransfer/Table";
import { Card, CardHeader } from "@/components/ui/card";

import React from "react";

export default async function Page({ searchParams }) {
  const filter = await searchParams;

  return (
    <Card className={"p-5 shadow-xl gap-0"}>
      <CardHeader className={"text-right "}>
        <h2 className={"text-2xl font-bold"}>انتقال کالا ها </h2>
      </CardHeader>

      <DataTableProductTransfer
        data={[]}
        // count={data.result?.count}
      />
    </Card>
  );
}
