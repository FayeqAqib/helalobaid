import { ChartAreaInteractive } from "@/components/chart/AreaChard2";
import { ChartBarInteractive } from "@/components/chart/BarChart";

import IncomeAndOutComeCard from "@/components/features/depotReportage/IncomeAndOutComeCard";
import SelectDepot from "@/components/features/depotReportage/selectDepot";
import SmallCard from "@/components/features/depotReportage/smallCard";
import { DataTableDepotReportage } from "@/components/features/depotReportage/Table";

import { Card } from "@/components/ui/card";

import {
  getAllItemsForBarChart,
  getAllItemsForTable,
  getExpiration,
  getSalesPurchaseSummary,
} from "@/services/itemsService";
import React from "react";

export default async function page({ searchParams }) {
  const filter = await searchParams;
  const data = await getExpiration(filter);
  const barChart = await getAllItemsForBarChart(filter.depot);
  const table = await getAllItemsForTable(filter);
  const areaChart = await getSalesPurchaseSummary();

  return (
    <div className={"p-5"}>
      <SelectDepot />
      <div className="space-x-7 space-y-7 w-full">
        <ChartBarInteractive data={barChart?.result || []} />
        <div className="flex lg:flex-row flex-col flex-1 w-full gap-7">
          <ChartAreaInteractive data={areaChart.result || []} />
          <div className="lg:w-1/3 w-full  lg:h-75 space-y-7">
            <IncomeAndOutComeCard
              avalible={barChart?.result || []}
              data={areaChart.result || []}
            />
            <div className=" flex flex-row gap-7 w-full">
              <SmallCard
                img={"../alarm.png"}
                tital={"رو به انقضا"}
                value={data?.result?.Expiring || 0}
              />
              <SmallCard
                img={"../warning.png"}
                tital={"تاریخ  گذشته"}
                value={data?.result?.Expired || 0}
              />
            </div>
          </div>
        </div>
        <Card>
          <DataTableDepotReportage
            data={table.result?.table || []}
            count={table.result?.count}
            expir={table.result?.expir}
            params={filter?.depot}
          />
        </Card>
      </div>
    </div>
  );
}
