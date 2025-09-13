import { BuyerCard } from "@/components/features/home/BuyerCard";
import jalaliMoment from "moment-jalaali";

import ChartContiner from "@/components/features/home/ChartContiner";
import LoanAccount from "@/components/features/home/LoanAccount";
import { ShowCard } from "@/components/features/home/ShowCard";
import { SmallShowCard } from "@/components/features/home/smallShowCard";

import { getCompanyAccount } from "@/services/accountService";
import { getSixMonthBuyData } from "@/services/buyService";
import { getAllItems, getSalesPurchaseSummary } from "@/services/itemsService";

import { getSixMonthSaleData } from "@/services/saleService";

import React, { use } from "react";

export default function Page() {
  const { result } = use(getCompanyAccount());
  const buySixMonthData = use(getSixMonthBuyData());
  const SaleSixMonthData = use(getSixMonthSaleData());
  const fourMonthData = use(getSalesPurchaseSummary());
  const allItems = use(getAllItems());

  const saleCent =
    ((Number(SaleSixMonthData.result?.slice(-1)[0]?.totalSale || 0) -
      Number(SaleSixMonthData.result?.slice(-2)[0]?.totalSale || 0)) *
      100) /
    Number(SaleSixMonthData.result?.slice(-2)[0]?.totalSale || 1);
  const buyCent =
    ((Number(buySixMonthData.result?.slice(-1)[0]?.totalBuy || 0) -
      Number(buySixMonthData.result?.slice(-2)[0]?.totalBuy || 0)) *
      100) /
    Number(buySixMonthData.result?.slice(-2)[0]?.totalBuy || 1);

  const totalAvalible = React.useMemo(
    () => allItems.result.reduce((acc, curr) => acc + curr.count, 0),

    [allItems]
  );

  // اول ماه شمسی جاری
  const firstDayOfMonth = jalaliMoment().startOf("jMonth").toDate();

  // آخر ماه شمسی جاری
  const lastDayOfMonth = jalaliMoment().endOf("jMonth").toDate();
  const total = React.useMemo(() => {
    const buy = fourMonthData.result.reduce(
      (acc, curr) =>
        new Date(curr.date) > firstDayOfMonth &&
        new Date(curr.date) < lastDayOfMonth
          ? acc + curr.buyCount
          : acc,
      0
    );
    const sale = fourMonthData.result.reduce(
      (acc, curr) =>
        new Date(curr.date) > firstDayOfMonth &&
        new Date(curr.date) < lastDayOfMonth
          ? acc + curr.saleCount
          : acc,
      0
    );
    return { buy, sale };
  }, [fourMonthData.result]);

  const totalProfit = React.useMemo(
    () =>
      fourMonthData.result.reduce(
        (acc, curr) =>
          new Date(curr.date) > firstDayOfMonth &&
          new Date(curr.date) < lastDayOfMonth
            ? acc + curr.totalProfit
            : acc,
        0
      ),

    [fourMonthData.result]
  );
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
            amount={buySixMonthData.result?.slice(-1)?.[0]?.totalBuy}
            count={buySixMonthData.result?.slice(-1)?.[0]?.count}
            chart="../line-chart.png"
          />
          <ShowCard
            tital={"مجموع فروش "}
            cent={saleCent}
            amount={SaleSixMonthData.result?.slice(-1)?.[0]?.totalSale}
            count={SaleSixMonthData.result?.slice(-1)?.[0]?.count}
            chart="../line-chart-2.png"
          />
          <ShowCard
            tital={"موجودی سرمایه"}
            amount={result?.[0]?.balance}
            chart="../bar-chart (2).png"
          />
        </div>
        <ChartContiner
          data={fourMonthData.result}
          totalProfit={totalProfit}
          buyData={buySixMonthData.result || []}
          saleData={SaleSixMonthData.result || []}
        />
      </div>
    </div>
  );
}
