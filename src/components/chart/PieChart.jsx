"use client";

import { TrendingUp } from "lucide-react";
import { Pie, PieChart, Sector } from "recharts";
// import { PieSectorDataItem } from "recharts/types/polar/Pie"

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

export const description = "A donut chart with an active sector";

export function ChartPieDonutActive({ costs }) {
  const chartData = costs?.map((item, i) => {
    return {
      title: `${item._id}`,
      totalCost: item.totalCost,
      fill: `var(--chart-${i + 1})`,
    };
  });

  return (
    <Card className="flex flex-col w-full max-w-lg h-[375px] shadow-lg">
      <CardHeader className="items-center pb-0">
        <CardTitle>مصارف</CardTitle>
        <CardDescription>مجموعه مصارف ماه جاری</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={{}}
          className="mx-auto aspect-square max-h-[200px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="totalCost"
              nameKey="title"
              innerRadius={50}
              strokeWidth={7}
              activeIndex={0}
              activeShape={({ outerRadius = 10, ...props }) => (
                <Sector {...props} outerRadius={outerRadius + 10} />
              )}
            />
          </PieChart>
        </ChartContainer>
        <ul className="relative bottom-6 gap-2 h-16 w-full items-center  flex flex-wrap">
          {chartData?.map(({ title, fill }, i) => (
            <li
              key={i}
              className="flex items-center gap-1 space-x-2 rtl:space-x-reverse"
            >
              <span
                className="w-4 h-4 rounded"
                style={{ backgroundColor: fill }}
              />
              <span>{title}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
