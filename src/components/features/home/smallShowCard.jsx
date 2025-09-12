import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatNumber } from "@/lib/utils";
import React from "react";

export const SmallShowCard = ({ tital, balance, buy, sale }) => {
  return (
    <Card className={"p-3 shadow-lg grid max-w-[160px] gap-1  w-full "}>
      <CardHeader className={"text-right flex flex-row justify-between p-0"}>
        <div className="flex flex-row items-center justify-center gap-2">
          <img src="../package.png" className="size-7" />
          <CardTitle className={"text-lg font-extrabold"}>{tital}</CardTitle>
        </div>
      </CardHeader>
      <CardContent
        className={"text-right flex flex-col gap-1 justify-center p-0"}
      >
        <div className="flex flex-row gap-1 mx-1  bg-[var(--card-foreground)] rounded-xl shadow-xl w-full   ps-2 ">
          <CardDescription
            className={
              "flex flex-row justify-around text-[var(--card)] items-center gap-x-2 p-0"
            }
          >
            <svg
              width="16"
              height="14"
              viewBox="0 0 16 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13.4318 0.522827L12.4446 0.522827L8.55575 0.522827L7.56859 0.522827C6.28227 0.522827 5.48082 1.91818 6.12896 3.02928L9.06056 8.05489C9.7037 9.1574 11.2967 9.1574 11.9398 8.05489L14.8714 3.02928C15.5196 1.91818 14.7181 0.522828 13.4318 0.522827Z"
                fill="oklch(0.606 0.25 292.717)"
              />
              <path
                opacity="0.4"
                d="M2.16878 13.0485L3.15594 13.0485L7.04483 13.0485L8.03199 13.0485C9.31831 13.0485 10.1198 11.6531 9.47163 10.542L6.54002 5.5164C5.89689 4.41389 4.30389 4.41389 3.66076 5.5164L0.729153 10.542C0.0810147 11.6531 0.882466 13.0485 2.16878 13.0485Z"
                fill="oklch(0.606 0.25 292.717)"
              />
            </svg>
            <CardTitle className={"text-sm font-extrabold mb-1 mt-0"}>
              موجود
            </CardTitle>
            <CardTitle className={"text-sm font-bold my-0"}>
              {formatNumber(balance || 0)}
            </CardTitle>
          </CardDescription>
        </div>
        <div className="flex flex-row gap-2 mx-1 bg-[var(--chart-1)] rounded-xl shadow-xl w-full  ps-2 ">
          <CardDescription
            className={
              "flex flex-row justify-around items-center text-white gap-x-2"
            }
          >
            <svg
              width="16"
              height="14"
              viewBox="0 0 16 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13.4318 0.522827L12.4446 0.522827L8.55575 0.522827L7.56859 0.522827C6.28227 0.522827 5.48082 1.91818 6.12896 3.02928L9.06056 8.05489C9.7037 9.1574 11.2967 9.1574 11.9398 8.05489L14.8714 3.02928C15.5196 1.91818 14.7181 0.522828 13.4318 0.522827Z"
                fill="#fff"
              />
              <path
                opacity="0.4"
                d="M2.16878 13.0485L3.15594 13.0485L7.04483 13.0485L8.03199 13.0485C9.31831 13.0485 10.1198 11.6531 9.47163 10.542L6.54002 5.5164C5.89689 4.41389 4.30389 4.41389 3.66076 5.5164L0.729153 10.542C0.0810147 11.6531 0.882466 13.0485 2.16878 13.0485Z"
                fill="#fff"
              />
            </svg>
            <CardTitle className={"text-sm font-extrabold mb-1"}>
              {" "}
              خرید
            </CardTitle>
            <CardTitle className={"text-sm font-bold"}>
              {formatNumber(buy || 0)}
            </CardTitle>
          </CardDescription>
        </div>
        <div className="flex flex-row gap-2 mx-1   bg-[var(--chart-1)] rounded-xl shadow-xl w-full  ps-2 ">
          <CardDescription
            className={
              "flex flex-row justify-around items-center text-white gap-x-2"
            }
          >
            <svg
              width="16"
              height="14"
              viewBox="0 0 16 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13.4318 0.522827L12.4446 0.522827L8.55575 0.522827L7.56859 0.522827C6.28227 0.522827 5.48082 1.91818 6.12896 3.02928L9.06056 8.05489C9.7037 9.1574 11.2967 9.1574 11.9398 8.05489L14.8714 3.02928C15.5196 1.91818 14.7181 0.522828 13.4318 0.522827Z"
                fill="#fff"
              />
              <path
                opacity="0.4"
                d="M2.16878 13.0485L3.15594 13.0485L7.04483 13.0485L8.03199 13.0485C9.31831 13.0485 10.1198 11.6531 9.47163 10.542L6.54002 5.5164C5.89689 4.41389 4.30389 4.41389 3.66076 5.5164L0.729153 10.542C0.0810147 11.6531 0.882466 13.0485 2.16878 13.0485Z"
                fill="#fff"
              />
            </svg>
            <CardTitle className={"text-sm font-extrabold mb-1"}>
              فروش
            </CardTitle>
            <CardTitle className={"text-sm font-bold"}>
              {formatNumber(sale || 0)}
            </CardTitle>
          </CardDescription>
        </div>
      </CardContent>
    </Card>
  );
};
