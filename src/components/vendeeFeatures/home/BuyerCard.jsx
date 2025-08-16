import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { getBiggestSeller } from "@/services/vendeeSaleServer";

import React, { use } from "react";

export const BuyerCard = () => {
  const result = use(getBiggestSeller());

  return (
    <Card
      className={"w-full max-w-4xl h-[370px] p-3 shadow-lg overflow-hidden"}
    >
      <CardHeader>
        <CardTitle className={"text-xl font-bold "}> مشتری وفادار</CardTitle>
      </CardHeader>
      <CardContent className={"flex flex-row  justify-center"}>
        {result.result?.map((item, index) => (
          <div
            key={index}
            className={`size-34  border-2 py-2 flex flex-col items-center gap-2 hover:z-30 absolute  transition-all duration-300 bg-[var(--background)] ${
              index === 0 &&
              "bg-[var(--chart-2)] translate-y-8 z-10  self-start hover:translate-y-1"
            }  rounded-2xl shadow-2xl shadow-[#00000088] dark:shadow-black mt-8 
            ${
              index === 1 &&
              "translate-x-18 -translate-y-12 hover:-translate-y-10"
            } 
            ${
              index === 2 &&
              " -translate-x-18 -translate-y-12  hover:-translate-y-10"
            } 
            ${
              index === 3 &&
              "translate-x-18 translate-y-26 hover:translate-y-24"
            } 
            ${
              index === 4 &&
              "-translate-x-18 translate-y-26 hover:translate-y-24"
            } 
            `}
          >
            <img
              src={
                (index === 0 && "../achievement.png") ||
                (index === 1 && "../success.png") ||
                (index === 2 && "../success.png") ||
                (index === 3 && "../laurel-wreath.png") ||
                (index === 4 && "../laurel-wreath.png")
              }
              className="size-8"
            />
            <CardTitle className="text-center text-md font-bold">
              {item?.buyerName}
            </CardTitle>
            <CardDescription className={"text-xs font-bold"}>
              مجموع خرید
            </CardDescription>
            <CardTitle className={"text-xs font-bold"}>
              {formatCurrency(item?.totalAmount)}
            </CardTitle>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
