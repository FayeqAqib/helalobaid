"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const description = "An interactive area chart";

const chartConfig = {
  visitors: {
    label: "تراکنش",
  },
  come: {
    label: "ورود",
    color: "var(--chart-1)",
  },
  out: {
    label: "خروج",
    color: "var(--chart-6)",
  },
};

export function ChartAreaInteractive({ data }) {
  const [timeRange, setTimeRange] = React.useState("120d");
  const chartData = data.map((item) => {
    return { date: item.date, come: item.buyCount, out: item.saleCount };
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
    <Card className="pt-0 lg:w-2/3 w-full">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>تراکنش کالا های گدام</CardTitle>
          <CardDescription>
            میزان ورد و خروج کالا در بازه زمانی انتخاب شده
          </CardDescription>
        </div>
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
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillcome" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-come)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-come)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillout" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-out)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-out)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
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
            <Area
              dataKey="out"
              type="natural"
              fill="url(#fillout)"
              stroke="var(--color-out)"
              stackId="b"
            />
            <Area
              dataKey="come"
              type="natural"
              fill="url(#fillcome)"
              stroke="var(--color-come)"
              stackId="b"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
