import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

const SmallCard = ({ img, tital, value }) => {
  return (
    <Card className=" shadow-lg flex flex-row p-3  size-full  items-center gap-3">
      <div className="w-1/3 flex justify-center items-center">
        <img src={img} className="size-14" />
      </div>
      <div className="flex flex-col justify-between items-start gap-3 size-full  ">
        <CardTitle>{tital}</CardTitle>
        <CardTitle className={"text-red-500"}>{value}</CardTitle>
      </div>
    </Card>
  );
};

export default SmallCard;
