"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "An interactive bar chart";

const chartConfig = {
  views: {
    label: "محصول",
  },
  product: {
    label: "product",
    color: "var(--chart-1)",
  },
};

export function ChartBarInteractive({ data }) {
  const chartData = data.map((item) => {
    return { name: item.product.name, product: item.count };
  });

  const total = React.useMemo(
    () => ({
      product: chartData.reduce((acc, curr) => acc + curr.product, 0),
    }),
    [data]
  );

  return (
    <Card className="py-0 w-full shadow-xl shadow-black/30 rounded-md">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:!py-0">
          <CardTitle>ترکیب از موجودی کالا ها</CardTitle>
          <CardDescription>
            هر کالا موجود در گدام توسط این نمودار قابل بررسی و مقایسه است
          </CardDescription>
        </div>
        <div className="flex">
          <button className="bg-muted/50 relative z-30 flex flex-1 flex-col items-center justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-4 sm:py-6">
            <span className="text-muted-foreground text-xs text-center  mx-4 w-full ">
              تعداد موجودی
            </span>
            <span className="text-lg leading-none font-bold w-full text-center sm:text-3xl">
              {total.product.toLocaleString()}
            </span>
          </button>
          <button
            key={3}
            className="data-[active=true]:bg-muted/50 relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
          >
            <span className="text-muted-foreground text-xs">نوع محصول</span>
            <span className="text-lg leading-none text-center font-bold sm:text-3xl">
              {chartData.length.toLocaleString()}
            </span>
          </button>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            {/* <CartesianGrid vertical={false} /> */}
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                return value;
                // const date = new Date(value);
                // return monent(date).format("jYYYY/jMM/jDD");
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return value;
                    // return monent(value).format("jYYYY/jMM/jDD");
                    // return new Date(value).toLocaleDateString("", {
                    //   month: "short",
                    //   day: "numeric",
                    //   year: "numeric",
                    // });
                  }}
                />
              }
            />
            <Bar dataKey={"product"} fill={`var(--color-product)`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
