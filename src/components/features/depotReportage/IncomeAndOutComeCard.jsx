"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import jalaliMoment from "moment-jalaali";
import { formatNumber } from "@/lib/utils";
import { ArrowDown, ArrowUp } from "lucide-react";

import { useRouter } from "next/navigation";
// import myImage from "@/../public/money-depot.png";
import React from "react";

const IncomeAndOutComeCard = ({ avalible, data }) => {
  const router = useRouter();
  console.log(avalible, "avalible");
  const totalAvalible = React.useMemo(
    () => avalible.reduce((acc, curr) => acc + curr.count, 0),

    [avalible]
  );

  // اول ماه شمسی جاری
  const firstDayOfMonth = jalaliMoment().startOf("jMonth").toDate();

  // آخر ماه شمسی جاری
  const lastDayOfMonth = jalaliMoment().endOf("jMonth").toDate();

  const total = React.useMemo(() => {
    const buy = data.reduce(
      (acc, curr) =>
        new Date(curr.date) > firstDayOfMonth &&
        new Date(curr.date) < lastDayOfMonth
          ? acc + curr.buyCount
          : acc,
      0
    );
    const sale = data.reduce(
      (acc, curr) =>
        new Date(curr.date) > firstDayOfMonth &&
        new Date(curr.date) < lastDayOfMonth
          ? acc + curr.saleCount
          : acc,
      0
    );
    return { buy, sale };
  }, [avalible]);

  return (
    <Card className=" shadow-lg flex flex-row-reverse p-3  size-full bg-[var(--chart-1)] items-center">
      <div className="w-2/5">
        <img
          src={"../money-depot.png"}
          alt="Photo by Drew Beamer"
          className="h-full w-full rounded-lg object-cover "
        />
      </div>
      <div className="flex flex-col justify-between items-start gap-2 w-3/5 h-full ">
        <CardHeader className={"w-full m-0 p-0"}>
          <CardTitle className={"text-2xl font-medium  text-white m-0 p-0"}>
            {formatNumber(totalAvalible)}
          </CardTitle>
          <CardDescription
            className={"text-md font-extralight text-white p-0 m-0"}
          >
            موجود
          </CardDescription>
        </CardHeader>
        <div className="flex flex-col gap-2">
          <div className="flex flex-row  items-center">
            <span className="size-10 flex justify-center items-center rounded-sm mb-1 bg-green-300">
              <ArrowUp size={15} />
            </span>
            <div className="flex flex-col items-start justify-center mr-2 gap-0 text-white h-8">
              <CardTitle className={"font-normal  text-lg "}>
                {formatNumber(total.buy)}
              </CardTitle>
              <CardDescription className={"font-medium text-md"}>
                آمد
              </CardDescription>
            </div>
          </div>
          <div className="flex flex-row  items-center">
            <span className="size-10 flex justify-center items-center rounded-sm mb-1 bg-red-300">
              <ArrowDown size={15} />
            </span>
            <div className="flex flex-col items-start justify-center gap-0 h-7 mr-2 text-white ">
              <CardTitle className={"font-medium text-md m-0 p-0"}>
                {formatNumber(total.sale)}
              </CardTitle>
              <CardDescription className={" text-sm m-0 p-0"}>
                رفت
              </CardDescription>
            </div>
          </div>
        </div>
        <div className="flex flex-row gap-2">
          <Button
            onClick={() => router.push("/customer/sale")}
            className={"px-10 bg-[#f0934e] hover:bg-[#d88446] rounded-xs"}
          >
            فروش
          </Button>
          <Button
            onClick={() => router.push("/customer/buy")}
            className={
              "px-10 bg-transparent shadow-md shadow-black/30 hover:shadow-sm hover:bg-transparent rounded-xs"
            }
          >
            خرید
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default IncomeAndOutComeCard;
