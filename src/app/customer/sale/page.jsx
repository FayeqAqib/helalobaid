import { SaleContextProvider } from "@/components/features/sale/context";
import { DataTableSale } from "@/components/features/sale/Table";
import { Card, CardHeader } from "@/components/ui/card";
import { getAllSallerAndBuyer } from "@/services/accountService";
import { findCurrency } from "@/services/currencyServices";
import { getListOfItems } from "@/services/itemsService";
import { getAllSales } from "@/services/saleService";

export default async function Page({ searchParams }) {
  const filter = await searchParams;

  const data = await getAllSales(filter);
  const account = await getAllSallerAndBuyer({ type: "buyer-company-bank" });
  const items = await getListOfItems("");
  const currency = await findCurrency();

  const initialData = {
    items: items?.result?.map((item) => {
      return {
        value:
          item.product._id +
          "-" +
          item.aveUnitAmount +
          "-" +
          item.depot._id +
          "," +
          item.depot.name +
          "-" +
          item.unit._id +
          "," +
          item.unit.name +
          "," +
          item.saleAmount +
          "#" +
          item._id,
        label:
          item.product.name +
          "-" +
          item.product?.brand +
          "-" +
          item.product?.companyName +
          "(" +
          item.unit.name +
          ")" +
          item.count,
      };
    }),
    buyer: account?.result?.filter((it) => it.accountType === "buyer"),
    income: account?.result?.filter((it) => it.accountType !== "buyer"),
    currency: currency?.result.map((it) => ({
      value: it._id + "," + it.rate,
      label: it.name,
    })),
  };

  return (
    <Card className={"p-5 shadow-xl gap-0"}>
      <CardHeader className={"text-right "}>
        <h2 className={"text-2xl font-bold"}>فروش ها</h2>
      </CardHeader>
      <SaleContextProvider initialData={initialData}>
        <DataTableSale
          data={data.result?.result || []}
          count={data.result?.count}
        />
      </SaleContextProvider>
    </Card>
  );
}
