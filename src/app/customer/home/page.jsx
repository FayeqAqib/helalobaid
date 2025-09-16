import { BuyerCard } from "@/components/features/home/BuyerCard";
import jalaliMoment from "moment-jalaali";
import ChartContiner from "@/components/features/home/ChartContiner";
import LoanAccount from "@/components/features/home/LoanAccount";
import { ShowCard } from "@/components/features/home/ShowCard";
import { SmallShowCard } from "@/components/features/home/smallShowCard";
import { getCompanyAccount } from "@/services/accountService";
import { getAllItems, getSalesPurchaseSummary } from "@/services/itemsService";

import React, { use } from "react";

export default function Page() {
  const { result } = use(getCompanyAccount());
  const fourMonthData = use(getSalesPurchaseSummary());
  const allItems = use(getAllItems());

  const totalAvalible = React.useMemo(
    () => allItems.result?.reduce((acc, curr) => acc + curr.count, 0),

    [allItems]
  );

  // اول ماه شمسی جاری
  const firstDayOfMonth = jalaliMoment().startOf("jMonth").toDate();

  // آخر ماه شمسی جاری
  const lastDayOfMonth = jalaliMoment().endOf("jMonth").toDate();

  const firstDayOfLastMonth = jalaliMoment()
    .subtract(1, "jMonth") // یک ماه کم می‌کنیم
    .startOf("jMonth") // به اول ماه می‌رویم
    .toDate(); // به تاریخ تبدیل می‌کنیم

  // آخر ماه شمسی قبل
  const lastDayOfLastMonth = jalaliMoment()
    .subtract(1, "jMonth") // یک ماه کم می‌کنیم
    .endOf("jMonth") // به آخر ماه می‌رویم
    .toDate();

  console.log(fourMonthData, "fourmoonth");
  const total = React.useMemo(() => {
    const buy = fourMonthData.result?.reduce(
      (acc, curr) =>
        new Date(curr.date) >= firstDayOfMonth &&
        new Date(curr.date) <= lastDayOfMonth
          ? acc + curr.buyCount
          : acc,
      0
    );
    const sale = fourMonthData.result?.reduce(
      (acc, curr) =>
        new Date(curr.date) >= firstDayOfMonth &&
        new Date(curr.date) <= lastDayOfMonth
          ? acc + curr.saleCount
          : acc,
      0
    );
    return { buy, sale };
  }, [fourMonthData.result]);

  const totalProfit = React.useMemo(
    () =>
      fourMonthData.result?.reduce(
        (acc, curr) =>
          new Date(curr.date) >= firstDayOfMonth &&
          new Date(curr.date) <= lastDayOfMonth
            ? acc + curr.totalProfit
            : acc,
        0
      ),

    [fourMonthData.result]
  );

  const buyAndSale = React.useMemo(() => {
    const currrentSale = fourMonthData.result?.reduce(
      (acc, curr) =>
        new Date(curr.date) >= firstDayOfMonth &&
        new Date(curr.date) <= lastDayOfMonth
          ? acc + curr.totalSale
          : acc,
      0
    );
    const pastSale = fourMonthData.result?.reduce(
      (acc, curr) =>
        new Date(curr.date) >= firstDayOfLastMonth &&
        new Date(curr.date) <= lastDayOfLastMonth
          ? acc + curr.totalSale
          : acc,
      0
    );
    const currrentBuy = fourMonthData.result?.reduce(
      (acc, curr) =>
        new Date(curr.date) >= firstDayOfMonth &&
        new Date(curr.date) <= lastDayOfMonth
          ? acc + curr.totalBuy
          : acc,
      0
    );
    const pastBuy = fourMonthData.result?.reduce(
      (acc, curr) =>
        new Date(curr.date) >= firstDayOfLastMonth &&
        new Date(curr.date) <= lastDayOfLastMonth
          ? acc + curr.totalBuy
          : acc,
      0
    );
    const saleCount = fourMonthData.result?.reduce(
      (acc, curr) =>
        new Date(curr.date) >= firstDayOfMonth &&
        new Date(curr.date) <= lastDayOfMonth
          ? acc + curr.transactionSale
          : acc,
      0
    );
    const buyCount = fourMonthData.result?.reduce(
      (acc, curr) =>
        new Date(curr.date) >= firstDayOfMonth &&
        new Date(curr.date) <= lastDayOfMonth
          ? acc + curr.transactionBuy
          : acc,
      0
    );

    return {
      currrentBuy,
      pastBuy,
      currrentSale,
      pastSale,
      buyCount,
      saleCount,
    };
  }, [fourMonthData.result]);
  console.log(buyAndSale);
  const saleCent =
    ((buyAndSale.currrentSale - buyAndSale.pastSale) * 100) /
    buyAndSale.pastSale;
  const buyCent =
    ((buyAndSale.currrentBuy - buyAndSale.pastBuy) * 100) / buyAndSale.pastBuy;

  return (
    <div className="flex size-full flex-col-reverse 2xl:flex-row  items-start justify-center gap-4 p-1">
      <div
        className={
          "2xl:w-1/4 w-full flex flex-col sm:flex-row 2xl:flex-col  2xl:max-w-2xl gap-4"
        }
      >
        <LoanAccount company={result?.[0]} />
        <BuyerCard />
      </div>

      <div className="flex w-full flex-col items-center justify-center gap-4 p-1">
        <div className="w-full grid xl:grid-cols-[0.5fr_1fr_1fr_1fr] md:grid-cols-2 grid-cols-1 items-center xs:justify-center md:justify-around  gap-4 p-1 ">
          <SmallShowCard
            tital={"کالا ها"}
            balance={totalAvalible}
            buy={total.buy}
            sale={total.sale}
          />
          <ShowCard
            tital={"مجموع خرید"}
            cent={buyCent}
            amount={buyAndSale.currrentBuy}
            count={buyAndSale.buyCount}
            chart="../line-chart.png"
          />
          <ShowCard
            tital={"مجموع فروش "}
            cent={saleCent}
            amount={buyAndSale.currrentSale}
            count={buyAndSale.saleCount}
            chart="../line-chart-2.png"
          />
          <ShowCard
            tital={"موجودی سرمایه"}
            amount={result?.[0]?.balance}
            chart="../bar-chart (2).png"
          />
        </div>
        <ChartContiner data={fourMonthData.result} totalProfit={totalProfit} />
      </div>
    </div>
  );
}
