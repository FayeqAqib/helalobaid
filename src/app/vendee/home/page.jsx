import { BuyerCard } from "@/components/vendeeFeatures/home/BuyerCard";
import ChartContiner from "@/components/vendeeFeatures/home/ChartContiner";
import LoanAccount from "@/components/vendeeFeatures/home/LoanAccount";
import { ShowCard } from "@/components/vendeeFeatures/home/ShowCard";
import { SmallShowCard } from "@/components/vendeeFeatures/home/smallShowCard";
import { getCompanyAccount } from "@/services/vendeeAccountService";
import { getSixMonthBuyData } from "@/services/vendeeBuyService";
import { getSixMonthSaleData } from "@/services/vendeeSaleServer";
import React, { use } from "react";

export default function Page() {
  const { result } = use(getCompanyAccount());
  const buySixMonthData = use(getSixMonthBuyData());
  const SaleSixMonthData = use(getSixMonthSaleData());

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

  return (
    <div className="flex size-full flex-col-reverse 2xl:flex-row  items-start justify-center gap-4 p-1">
      <div
        className={
          "2xl:w-1/4 w-full flex flex-col sm:flex-row 2xl:flex-col  2xl:max-w-2xl gap-4"
        }
      >
        <LoanAccount company={result} />
        <BuyerCard />
      </div>

      <div className="flex w-full flex-col items-center justify-center gap-4 p-1">
        <div className="w-full grid xl:grid-cols-[0.5fr_1fr_1fr_1fr] md:grid-cols-2 grid-cols-1 items-center xs:justify-center md:justify-around  gap-4 p-1 ">
          <SmallShowCard
            tital={"METU"}
            balance={result.METUbalance}
            buy={buySixMonthData.result?.slice(-1)?.[0]?.totalMETU}
            sale={SaleSixMonthData.result?.slice(-1)?.[0]?.totalMETU}
          />
          <ShowCard
            tital={"مجموع خرید"}
            cent={buyCent}
            amount={buySixMonthData.result?.slice(-1)?.[0]?.totalBuy}
            count={buySixMonthData.result?.slice(-1)?.[0]?.count}
          />
          <ShowCard
            tital={"مجموع فروش "}
            cent={saleCent}
            amount={SaleSixMonthData.result?.slice(-1)?.[0]?.totalSale}
            count={SaleSixMonthData.result?.slice(-1)?.[0]?.count}
          />
          <ShowCard tital={"موجودی سرمایه"} amount={result?.balance} />
        </div>
        <ChartContiner
          buyData={buySixMonthData.result || []}
          saleData={SaleSixMonthData.result || []}
        />
      </div>
    </div>
  );
}
