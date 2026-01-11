import { BuyerCard } from "@/components/features/home/BuyerCard";
import jalaliMoment from "moment-jalaali";
import ChartContiner from "@/components/features/home/ChartContiner";
import LoanAccount from "@/components/features/home/LoanAccount";
import { ShowCard } from "@/components/features/home/ShowCard";
import { SmallShowCard } from "@/components/features/home/smallShowCard";
import { getCompanyAccount } from "@/services/accountService";
import { getAllItems, getSalesPurchaseSummary } from "@/services/itemsService";

import React, { use } from "react";
import HomeFilter from "@/components/myUI/homeFilter";
import { findOneCurrency } from "@/services/currencyServices";
import {
  getAllTransferBank,
  getAllTransferMoneySeller,
} from "@/services/ledgarServer";

export default function Page({ searchParams }) {
  const params = use(searchParams);

  const myFilter = {
    date: params?.date || `${new Date()},${new Date()}`,
    ...(params?.currency && { currency: params?.currency }),
  };

  const filter = {
    date: params?.date || `${new Date()},${new Date()}`,
    ...(params.currency ? { currency: params.currency } : {}),
  };

  const banks = use(getAllTransferBank(filter));

  const buy = use(getAllTransferMoneySeller(filter));

  const { result: currency } = use(findOneCurrency(params?.currency));

  const { result } = use(getCompanyAccount());
  const fourMonthData = use(getSalesPurchaseSummary(myFilter));
  const allItems = use(getAllItems());

  const totalAvalible = React.useMemo(
    () => allItems.result?.reduce((acc, curr) => acc + curr.count, 0),

    [allItems]
  );

  const total = React.useMemo(() => {
    const buy = fourMonthData.result?.reduce(
      (acc, curr) => acc + curr.buyCount,
      0
    );
    const sale = fourMonthData.result?.reduce(
      (acc, curr) => acc + curr.saleCount,
      0
    );
    return { buy, sale };
  }, [fourMonthData.result]);

  const totalProfit = React.useMemo(
    () =>
      fourMonthData.result?.reduce((acc, curr) => acc + curr.totalProfit, 0),

    [fourMonthData.result]
  );

  const buyAndSale = React.useMemo(() => {
    const currrentSale = fourMonthData.result?.reduce(
      (acc, curr) => acc + curr.totalSale,
      0
    );
    const pastSale = fourMonthData.result?.reduce(
      (acc, curr) => acc + curr.totalSale,
      0
    );
    const currrentBuy = fourMonthData.result?.reduce(
      (acc, curr) => acc + curr.totalBuy,
      0
    );
    const pastBuy = fourMonthData.result?.reduce(
      (acc, curr) => acc + curr.totalBuy,
      0
    );
    const saleCount = fourMonthData.result?.reduce(
      (acc, curr) => acc + curr.transactionSale,
      0
    );
    const buyCount = fourMonthData.result?.reduce(
      (acc, curr) => acc + curr.transactionBuy,
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

  const saleCent =
    ((buyAndSale.currrentSale - buyAndSale.pastSale) * 100) /
    buyAndSale.pastSale;
  const buyCent =
    ((buyAndSale.currrentBuy - buyAndSale.pastBuy) * 100) / buyAndSale.pastBuy;

  return (
    <div className="size-full">
      <HomeFilter />
      <div className="flex size-full flex-col-reverse 2xl:flex-row  items-start justify-center gap-4 p-1">
        <div
          className={
            "2xl:w-1/4 w-full flex flex-col sm:flex-row 2xl:flex-col  2xl:max-w-2xl gap-4"
          }
        >
          <LoanAccount company={result?.[0]} currency={currency} />
          <BuyerCard date={params?.date} currency={currency} />
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
              code={currency.code}
              amount={buyAndSale.currrentBuy}
              count={buyAndSale.buyCount}
              chart="../line-chart.png"
            />
            <ShowCard
              tital={"مجموع فروش "}
              cent={saleCent}
              code={currency.code}
              amount={buyAndSale.currrentSale}
              count={buyAndSale.saleCount}
              chart="../line-chart-2.png"
            />
            <ShowCard
              tital={"موجودی سرمایه"}
              amount={result?.[0]?.balance / currency.rate}
              code={currency.code}
              chart="../bar-chart (2).png"
            />
          </div>
          <ChartContiner
            data={fourMonthData.result}
            totalProfit={totalProfit}
            currency={currency}
            buy={buy}
            bank={banks}
            date={params?.date}
          />
        </div>
      </div>
    </div>
  );
}
