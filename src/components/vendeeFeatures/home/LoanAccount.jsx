import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { getTopThreeAccountsBylend } from "@/services/vendeeAccountService";

import { use } from "react";

function LoanAccount({ company }) {
  const bigestLend = use(getTopThreeAccountsBylend());

  return (
    <Card className={"w-full max-w-4xl  p-2 shadow-lg"}>
      <div className="flex flex-col items-center justify-center bg-[var(--chart-2)] rounded-2xl shadow-2xl shadow-[#a1a1a1] dark:shadow-black p-2">
        <CardHeader className={"w-full p-1"}>
          <CardTitle className={"text-xl font-bold "}>
            <img
              src="../debt.png"
              className="w-8 h-8 inline-block mr-2"
              alt="debt icon"
            />
            <span className="text-center"> حسابات غیر نقدی </span>
          </CardTitle>
        </CardHeader>
        <CardContent
          className={
            "flex flex-col items-center justify-center w-full p-1 gap-3"
          }
        >
          <div className="flex flex-row items-center justify-around bg-[var(--background)] rounded-2xl shadow-2xl shadow-[#9c9c9c] dark:shadow-black p-4 w-full">
            <img
              src="../devaluation.png"
              className="w-8 h-8 inline-block mr-2"
              alt="money icon"
            />
            <CardTitle className={"text-center text-md font-bold"}>
              مجموع قابل حصول
            </CardTitle>
            <CardDescription className={"text-center text-md font-bold"}>
              {" "}
              {formatCurrency(company?.vendeeBorrow + company?.borrow)}{" "}
            </CardDescription>
          </div>
          <div className="flex flex-row items-center justify-around bg-[var(--background)] rounded-2xl shadow-2xl shadow-[#9c9c9c] dark:shadow-black p-4 w-full">
            <img
              src="../cost.png"
              className="w-8 h-8 inline-block mr-2"
              alt="money icon"
            />
            <CardTitle className={"text-center text-md font-bold"}>
              مجموع قابل پرداخت
            </CardTitle>
            <CardDescription className={"text-center text-md font-bold"}>
              {" "}
              {formatCurrency(company?.vendeeLend + company?.lend)}{" "}
            </CardDescription>
          </div>
        </CardContent>
      </div>
      <CardHeader className={"w-full p-1"}>
        <CardTitle className={"text-xl font-bold"}>
          <img
            src="../leader.png"
            className="w-8 h-8 inline-block mr-2"
            alt="obligation icon"
          />
          <span className="text-center"> حسابات در یافتی </span>
        </CardTitle>
        <CardDescription className={"text-sm"}>
          {" "}
          سه دانه از بزرگ ترین طلبات شرکت
        </CardDescription>
      </CardHeader>
      {bigestLend.result?.length ? (
        <div className="space-y-4 p-2">
          {bigestLend.result?.map((item, i) => (
            <div
              key={i}
              className="flex flex-row items-center justify-around bg-[var(--background)] rounded-2xl duration-300 hover:-translate-y-1 shadow-xl shadow-[#9c9c9c] dark:shadow-black p-4 w-full"
            >
              <img
                src="../obligation.png"
                className="w-8 h-8 inline-block mr-2"
                alt="money icon"
              />
              <CardTitle className={"text-center text-md font-bold"}>
                {item.name}
              </CardTitle>
              <CardDescription className={"text-center text-md font-bold"}>
                {" "}
                {formatCurrency(item.lend)}{" "}
              </CardDescription>
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full h-full flex justify-center items-center">
          طلبی وجود ندارد
        </div>
      )}
    </Card>
  );
}

export default LoanAccount;
