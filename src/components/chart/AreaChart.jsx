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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export const description = "An area chart with gradient fill";

const chartConfig = {
  visitors: {
    label: "تراکنش",
  },
  buy: {
    label: "خرید",
    color: "var(--chart-1)",
  },
  sale: {
    label: "فروش",
    color: "var(--chart-2)",
  },
};

export function ChartAreaGradient({ data }) {
  const [timeRange, setTimeRange] = useState("120d");
  const chartData = data.map((item) => {
    return { date: item.date, sale: item.totalBuy, buy: item.totalSale };
  });
  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date("2024-06-30");
    let daysToSubtract = 120;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  return (
    <Card className="w-full shadow-xl shadow-black/30 p-0 rounded-sm overflow-hidden">
      <div className="flex flex-row w-full justify-between h-8">
        <CardHeader className={"p-5 w-1/2"}>
          <CardTitle>تراکنش ها</CardTitle>
          <CardDescription>میزان خرید وقروش در 6 ماه گذشته</CardDescription>
        </CardHeader>
        <CardHeader className={"p-5 w-1/2"}>
          <Select value={timeRange} onValueChange={setTimeRange} dir="rtl">
            <SelectTrigger
              className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
              aria-label="چهار ماه اخیر "
            >
              <SelectValue placeholder="fayeq" />
            </SelectTrigger>
            <SelectContent className="rounded-xl ">
              <SelectItem value="120d" className="rounded-lg text-right">
                چهار ماه اخیر
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                یک ماه اخیر
              </SelectItem>

              <SelectItem value="7d" className="rounded-lg">
                یک هفته اخیر
              </SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
      </div>
      <CardContent className={"p-0 m-0 max-h-[500px]"}>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={filteredData}
            margin={
              {
                // left: 20,
                // right: 20,
              }
            }
          >
            {/* <CartesianGrid vertical={false} /> */}
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    console.log(value);
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                  areaChart2={true}
                />
              }
            />
            <defs>
              <linearGradient id="fillbuy" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-buy)"
                  stopOpacity={0.6}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-buy)"
                  stopOpacity={0.01}
                />
              </linearGradient>
              <linearGradient id="fillsale" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-sale)"
                  stopOpacity={0.6}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-sale)"
                  stopOpacity={0.01}
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
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
