import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import React from "react";

export const ShowCard = ({ tital, count, amount, cent = 1, chart = "" }) => {
  return (
    <Card className={"p-3 shadow-lg flex gap-1  w-full max-w-lg  "}>
      <CardHeader
        className={"text-right flex flex-row justify-between gap-1 p-0 m-0"}
      >
        <div className="flex flex-row items-center justify-center gap-1">
          <img src="../money (3).png" className="size-10 " />
          <CardTitle className={"text-xl font-extrabold"}>{tital}</CardTitle>
        </div>
        <CardTitle className={"text-xl m-1 mt-0 font-extrabold"}>
          {count}
        </CardTitle>
      </CardHeader>
      <CardContent
        className={"text-right flex flex-row justify-between p-0 m-0"}
      >
        <div className="flex flex-col gap-2 m-x-1 mt-3">
          <CardTitle className={"text-xl font-bold"}>
            {formatCurrency(amount || 0)}
          </CardTitle>
          {cent != 1 && (
            <CardDescription className={"flex flex-row text-xs gap-2"}>
              <svg
                width="16"
                height="14"
                viewBox="0 0 16 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13.4318 0.522827L12.4446 0.522827L8.55575 0.522827L7.56859 0.522827C6.28227 0.522827 5.48082 1.91818 6.12896 3.02928L9.06056 8.05489C9.7037 9.1574 11.2967 9.1574 11.9398 8.05489L14.8714 3.02928C15.5196 1.91818 14.7181 0.522828 13.4318 0.522827Z"
                  fill={cent > 0 ? `oklch(0.606 0.25 292.717)` : `#c52222`}
                />
                <path
                  opacity="0.4"
                  d="M2.16878 13.0485L3.15594 13.0485L7.04483 13.0485L8.03199 13.0485C9.31831 13.0485 10.1198 11.6531 9.47163 10.542L6.54002 5.5164C5.89689 4.41389 4.30389 4.41389 3.66076 5.5164L0.729153 10.542C0.0810147 11.6531 0.882466 13.0485 2.16878 13.0485Z"
                  fill={cent > 0 ? `oklch(0.606 0.25 292.717)` : `#c52222`}
                />
              </svg>
              <span
                className={cent > 0 ? "text-[var(--chart-1)]" : "text-red-500"}
              >
                {Number(cent).toFixed(2) + "%"}
              </span>{" "}
              نسبت به ماه گذشته
            </CardDescription>
          )}
        </div>
        <img
          src={chart}
          // src={"../line-chart.png"}
          className="relative  text-[var(--chart-1)] size-15  "
        />
      </CardContent>
    </Card>
  );
};
