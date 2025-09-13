import { ChartAreaGradient } from "@/components/chart/AreaChart";
import { ChartPieDonutActive } from "@/components/chart/PieChart";
import { ShowCard } from "./ShowCard";
import React, { use } from "react";
import { getCostInThisMonth } from "@/services/costService";
import { Card } from "@/components/ui/card";
import { DataTableBankAndBuy } from "./bankAndBuyTable";
import { DataTableTransferBuy } from "./buyTable";
import {
  getAllTransferBank,
  getAllTransferMoneySeller,
} from "@/services/ledgarServer";
import jalaliMoment from "moment-jalaali";

function ChartContiner({ data, totalProfit }) {
  const banks = use(getAllTransferBank());

  const buy = use(getAllTransferMoneySeller());
  const allCost = use(getCostInThisMonth());

  const totalCost = allCost.result?.reduce(
    (acc, cur) => acc + cur.totalAmount,
    0
  );

  const firstDayOfLastMonth = jalaliMoment()
    .subtract(1, "jMonth") // یک ماه کم می‌کنیم
    .startOf("jMonth") // به اول ماه می‌رویم
    .toDate(); // به تاریخ تبدیل می‌کنیم

  // آخر ماه شمسی قبل
  const lastDayOfLastMonth = jalaliMoment()
    .subtract(1, "jMonth") // یک ماه کم می‌کنیم
    .endOf("jMonth") // به آخر ماه می‌رویم
    .toDate();

  const pastMonthTotalProfit = React.useMemo(
    () =>
      data.reduce(
        (acc, curr) =>
          new Date(curr.date) > firstDayOfLastMonth &&
          new Date(curr.date) < lastDayOfLastMonth
            ? acc + curr.totalProfit
            : acc,
        0
      ),

    [data]
  );
  const UsanceCent =
    ((totalProfit - pastMonthTotalProfit) * 100) / pastMonthTotalProfit;

  const currentROI = totalProfit - totalCost;

  return (
    <div className="w-full flex xl:flex-row flex-col-reverse items-start justify-items-stretch gap-4">
      <div className=" xl:w-[38%] w-full flex xl:flex-col flex-col  sm:flex-row-reverse gap-4 items-center ">
        <ChartPieDonutActive costs={allCost.result} />

        <div className=" w-full space-y-7 xl:space-y-4">
          <ShowCard
            tital={"مفاد سرمایه"}
            cent={UsanceCent}
            amount={totalProfit}
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
        <ChartAreaGradient data={data} />
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
