import React from "react";

import { Card, CardHeader } from "@/components/ui/card";

import { getAllAccount } from "@/services/vendeeAccountService";
import { DataTableRegister } from "@/components/vendeeFeatures/register/Table";

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
