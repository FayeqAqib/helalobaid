import { BuyContextProvider } from "@/components/features/buy/context";
import { DataTableBuy } from "@/components/features/buy/Table";
import { Card, CardHeader } from "@/components/ui/card";
import { getAllSallerAndBuyer } from "@/services/accountService";
import { getAllbuy } from "@/services/buyService";
import { findCurrency } from "@/services/currencyServices";
import { getAllDepot } from "@/services/depotService";
import { getAllProductInBuy } from "@/services/productService";
import { getAllUnit } from "@/services/unitService";

import React from "react";

export default async function Page({ searchParams }) {
  const filter = await searchParams;

  const data = await getAllbuy(filter);

  const account = await getAllSallerAndBuyer({ type: "saller-company-bank" });

  const product = await getAllProductInBuy();
  const unit = await getAllUnit({ fields: "name" });
  const depot = await getAllDepot({ fields: "name" });
  const currency = await findCurrency();

  const initialData = {
    currency: currency?.result.map((it) => ({
      value: it._id,
      label: it.name,
    })),
    depot: depot?.result?.result.map((it) => ({
      value: it._id,
      label: it.name,
    })),
    unit: unit?.result?.result.map((it) => ({
      value: it._id,
      label: it.name,
    })),
    product: product?.result,
    saller: account?.result?.filter((it) => it.accountType === "saller"),
    income: account?.result?.filter((it) => it.accountType !== "saller"),
  };

  return (
    <Card className={"p-5 shadow-xl size-full gap-0"}>
      <CardHeader className={"text-right "}>
        <h2 className={"text-2xl font-bold"}>خرید ها</h2>
      </CardHeader>

      <BuyContextProvider initialData={initialData}>
        <DataTableBuy
          data={data.result?.result || []}
          count={data.result?.count || 0}
        />
      </BuyContextProvider>
    </Card>
  );
}
