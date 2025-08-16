"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import months from "moment-jalaali";
import React from "react";

export const ExportDataCard = () => {
  const handleDownloadCSV = () => {
    window.open("/api/export/CSV", "_blank");
  };
  const handleDownloadPDF = () => {
    window.open("/api/export/EXCEL", "_blank");
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle> خروج و ورد دیتا</CardTitle>
      </CardHeader>
      <CardContent className={"flex flex-row flex-wrap justify-center gap-4"}>
        <div className="flex flex-col gap-4 justify-center items-center">
          <Button onClick={handleDownloadPDF}> دانلود به صورت EXCEL</Button>
        </div>
        <div className="flex flex-col gap-4 justify-center items-center">
          <Button onClick={handleDownloadCSV}> دانلود به صورت CSV</Button>
        </div>
      </CardContent>
    </Card>
  );
};
