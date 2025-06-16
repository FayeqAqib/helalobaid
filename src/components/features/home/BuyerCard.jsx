import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { getBiggestSeller } from "@/services/saleService";
import React, { use } from "react";

export const BuyerCard = () => {
  const result = use(getBiggestSeller());

  return (
    <Card
      className={"w-full max-w-4xl h-[270px] p-3 shadow-lg overflow-hidden"}
    >
      <CardHeader>
        <CardTitle className={"text-xl font-bold "}> مشتری وفادار</CardTitle>
      </CardHeader>
      <CardContent className={"flex flex-row  justify-center"}>
        {result.result.map((item, index) => (
          <div key={index}
            className={`size-36 ${
              index === 1 &&
              "bg-[var(--chart-2)] -translate-y-8 z-40  self-start hover:-translate-y-10"
            }  rounded-2xl shadow-2xl shadow-[#00000088] dark:shadow-black mt-8 ${
              index === 2 && "translate-x-4 hover:-translate-y-2"
            } ${index === 0 && "-translate-x-4 hover:-translate-y-2"} 
            border-2 py-2 flex flex-col items-center gap-2  transition-all duration-300`}
          >
            <img
              src={
                (index === 0 && "../laurel-wreath.png") ||
                (index === 1 && "../achievement.png") ||
                (index === 2 && "../success.png")
              }
              className="w-10 h-10"
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
