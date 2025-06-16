"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";

export const description = "An area chart with gradient fill";

const persianMonths = [
  { index: 1, label: "حمل" },
  { index: 2, label: "ثور" },
  { index: 3, label: "جوزا" },
  { index: 4, label: "سرطان" },
  { index: 5, label: "اسد" },
  { index: 6, label: "سنبله" },
  { index: 7, label: "میزان" },
  { index: 8, label: "عقرب" },
  { index: 9, label: "قوس" },
  { index: 10, label: "جدی" },
  { index: 11, label: "دلو" },
  { index: 12, label: "حوت" },
];

const chartConfig = {
  buy: {
    label: "خرید",
    color: "var(--chart-1)",
  },
  sale: {
    label: "فروش",
    color: "var(--chart-2)",
  },
};

export function ChartAreaGradient({ buyData, saleData }) {
  const [chartData, setChartData] = useState([]);

  function mergeByDate(buys, sales) {
    const resultMap = new Map();

    // پردازش خریدها
    for (const item of buys) {
      if (!resultMap.has(item._id)) {
        resultMap.set(item._id, { _id: item._id });
      }
      resultMap.get(item._id).buy = item.totalBuy;
    }

    // پردازش فروش‌ها
    for (const item of sales) {
      if (!resultMap.has(item._id)) {
        resultMap.set(item._id, { _id: item._id });
      }
      resultMap.get(item._id).sale = item.totalSale;
    }

    // خروجی نهایی به صورت آرایه
    return Array.from(resultMap.values())
      .sort((a, b) => a._id.localeCompare(b._id))
      .map((item) => {
        return {
          _id: item._id,
          buy: item.buy ?? 0, // مقدار پیش‌فرض 0 اگر buy نبود
          sale: item.sale ?? 0,
          month: persianMonths[Number(item._id.split("/")[1]) - 1]?.label,
        };
      });
  }

  useEffect(() => {
    setChartData(mergeByDate(buyData, saleData));
  }, [buyData, saleData]);

  const x = chartData.slice(-2);
  const improvement =
    ((Number(x[1]?.sale || 0) - Number(x[0]?.sale || 0)) * 100) /
    Number(x[0]?.sale || 1);

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle>تراکنش ها</CardTitle>
        <CardDescription>میزان خرید وقروش در 6 ماه گذشته</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 5)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
              <linearGradient id="fillbuy" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-buy)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-buy)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillsale" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-sale)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-sale)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="sale"
              type="natural"
              fill="url(#fillsale)"
              fillOpacity={0.4}
              stroke="var(--color-sale)"
              stackId="a"
            />
            <Area
              dataKey="buy"
              type="natural"
              fill="url(#fillbuy)"
              fillOpacity={0.4}
              stroke="var(--color-buy)"
              stackId="b"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div
              className={`flex items-center gap-2 leading-none font-medium ${
                improvement > 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {improvement > 0
                ? `  ${Math.abs(
                    improvement.toFixed(2)
                  )}% بهبود عمل کرد نسبت به ماه قبل`
                : `  ${Math.abs(
                    improvement.toFixed(2)
                  )}% کاهش عمل کرد نسبت به ماه قبل`}

              {improvement > 0 ? (
                <TrendingUp className="h-4 w-4" color="green" />
              ) : (
                <TrendingDown className="h-4 w-4" color="red" />
              )}
            </div>
            <div className="text-muted-foreground flex items-center gap-2 leading-none">
              {chartData[0]?.month + "-" + chartData.slice(-1)[0]?.month}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
