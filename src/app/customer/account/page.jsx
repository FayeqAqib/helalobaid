import React, { use } from "react";

import { Card, CardHeader } from "@/components/ui/card";

import { DataTableRegister } from "@/components/features/register/Table";
import { getAllAccount } from "@/services/accountService";

export default async function page({ searchParams }) {
  const filter = await searchParams;

  const data = await getAllAccount(filter);

  return (
    <div className="">
      <Card className={"p-5 shadow-xl gap-0"}>
        <CardHeader className={"text-right "}>
          <h2 className={"text-2xl font-bold"}> صورت حساب ها </h2>
        </CardHeader>
        <DataTableRegister
          data={data.result?.result || []}
          count={data.result?.count}
        />
      </Card>
    </div>
  );
}
