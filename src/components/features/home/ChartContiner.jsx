import { ChartAreaGradient } from "@/components/chart/AreaChart";
import { ChartPieDonutActive } from "@/components/chart/PieChart";
import { ShowCard } from "./ShowCard";
import { use } from "react";
import { getCostInThisMonth } from "@/services/costService";
import { Card } from "@/components/ui/card";
import { DataTableBankAndBuy } from "./bankAndBuyTable";
import { DataTableTransferBuy } from "./buyTable";
import {
  getAllTransferBank,
  getAllTransferMoneySeller,
} from "@/services/ledgarServer";

function ChartContiner({ buyData, saleData, data }) {
  const banks = use(getAllTransferBank());

  const buy = use(getAllTransferMoneySeller());
  const allCost = use(getCostInThisMonth());
  const totalCost = allCost.result?.reduce(
    (acc, cur) => acc + cur.totalCost,
    0
  );
  const buyAvgCent =
    buyData?.reduce((acc, cur) => acc + cur.avgCent, 0) / buyData?.length;
  const currentMonthSaleAvgCent = saleData.slice(-1)[0]?.avgCent;
  const pastMonthSaleAvgCent = saleData.slice(-2)[0]?.avgCent;
  const currentMonthSale = saleData.slice(-1)[0]?.totalSale;
  const pastMonthSale = saleData.slice(-2)[0]?.totalSale;
  const currentMonthUsance =
    ((buyAvgCent - currentMonthSaleAvgCent) * currentMonthSale) / 100;
  const pastMonthUsance =
    ((buyAvgCent - pastMonthSaleAvgCent) * pastMonthSale) / 100;
  const UsanceCent =
    ((currentMonthUsance - pastMonthUsance) * 100) / pastMonthUsance;

  const currentROI = currentMonthUsance - totalCost;

  return (
    <div className="w-full flex xl:flex-row flex-col-reverse items-start justify-items-stretch gap-4">
      <div className=" xl:w-[38%] w-full flex xl:flex-col flex-col  sm:flex-row-reverse gap-4 items-center ">
        <ChartPieDonutActive costs={allCost.result} />

        <div className=" w-full space-y-7 xl:space-y-4">
          <ShowCard
            tital={"مفاد سرمایه"}
            cent={UsanceCent}
            amount={currentMonthUsance}
            chart="../candlestick-chart.png"
          />
          <ShowCard
            tital={"مفاد خالص سرمایه"}
            amount={currentROI}
            chart="../candlestick-chart.png"
          />
        </div>
      </div>
      <div className="w-full flex flex-col gap-5">
        <ChartAreaGradient buyData={buyData} saleData={saleData} data={data} />
        <div className="flex flex-col gap-5 w-full md:flex-row">
          <Card className={"p-0 m-0 w-full"}>
            <DataTableBankAndBuy data={banks || []} />
          </Card>
          <Card className={"p-0 m-0 w-full"}>
            <DataTableTransferBuy data={buy || []} />
          </Card>
        </div>
      </div>
    </div>
  );
}

export default ChartContiner;
