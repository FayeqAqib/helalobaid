"use client";

import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";

import { usePathname, useRouter } from "next/navigation";
import { RangeDatePickerWithPresets } from "./rangeDatePacker";
import { AutoCompleteV2 } from "./ComboBox";
import { Search } from "lucide-react";

function HomeFilter() {
  const [date, setDate] = useState([new Date(), new Date()]);
  const [currency, setCurrency] = useState("عمومی");
  const router = useRouter();
  const path = usePathname();

  function handleClick() {
    const string = `${path}?${
      date.toString().split(",")[1] && "date=" + date
    } ${currency && "&currency=" + currency}`;

    router.push(string);
  }

  return (
    <div className="w-full flex flex-row gap-5 justify-between p-2">
      <RangeDatePickerWithPresets
        date={date}
        onDate={setDate}
        className={"flex-1"}
      />
      <AutoCompleteV2
        className={"flex-1"}
        value={currency}
        onChange={setCurrency}
        dataType="currency"
        label=" واحد پولی را انتخاب کنید.."
      />
      <Button
        className={"lg:w-[300px] cursor-pointer space-x-3"}
        onClick={handleClick}
      >
        اجرا
        <Search />
      </Button>
    </div>
  );
}

export default HomeFilter;
