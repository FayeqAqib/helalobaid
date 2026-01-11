import { InventoryContextProvider } from "@/components/features/depotInventory/context";
import { DataTableDepotInventory } from "@/components/features/depotInventory/Table";
import { Card, CardHeader } from "@/components/ui/card";
import { findCurrency } from "@/services/currencyServices";

import { getAllDepotItems } from "@/services/depotItemsService";
import { getAllDepot } from "@/services/depotService";
import { getAllProductInBuy } from "@/services/productService";
import { getAllUnit } from "@/services/unitService";
import React from "react";

export default async function page({ searchParams }) {
  const filter = await searchParams;

  const data = await getAllDepotItems(filter);
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
  };

  return (
    <Card className={"p-5 shadow-xl gap-0"}>
      <CardHeader className={"text-right "}>
        <h2 className={"text-2xl font-bold"}> ثبت موجودی گدام</h2>
      </CardHeader>

      <InventoryContextProvider initialData={initialData}>
        <DataTableDepotInventory
          data={data.result?.result || []}
          count={data.result?.count}
        />
      </InventoryContextProvider>
    </Card>
  );
}
