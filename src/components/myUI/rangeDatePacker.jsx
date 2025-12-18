"use client";

import { format } from "date-fns";

const afghan_fa = {
  months: [
    ["حمل"], // فروردین
    ["ثور"], // اردیبهشت
    ["جوزا"],
    ["سرطان"],
    ["اسد"],
    ["سنبله"],
    ["میزان"],
    ["عقرب"],
    ["قوس"],
    ["جدی"],
    ["دلو"],
    ["حوت"],
  ],
  weekDays: [
    ["شنبه", "ش"],
    ["یک‌شنبه", "۱ش"],
    ["دوشنبه", "۲ش"],
    ["سه‌شنبه", "۳ش"],
    ["چهارشنبه", "۴ش"],
    ["پنج‌شنبه", "۵ش"],
    ["جمعه", "جم"],
  ],

  digits: ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"],
  meridiems: ["ق.ظ", "ب.ظ"],
};

import { CalendarIcon } from "lucide-react";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import { Calendar } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import "react-multi-date-picker/styles/backgrounds/bg-dark.css";
import "react-multi-date-picker/styles/colors/green.css";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import moment from "moment-jalaali";
import { useEffect, useState } from "react";

export function RangeDatePickerWithPresets({
  date,
  onDate,
  size = "md",
  className,
}) {
  const { theme: initialTheme } = useTheme();
  const [theme, setTheme] = useState(initialTheme);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setTheme(initialTheme);
  }, [initialTheme]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            size == "sm" ? "max-w-[220px]" : "w-[270px]",
            "justify-start text-left font-normal text-xs",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-5 w-4" />
          {date[0] && date[1]
            ? moment(date[0]).format("jYYYY/jMM/jDD") +
              " - " +
              moment(date[1]).format("jYYYY/jMM/jDD")
            : "تاریخ"}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="flex w-auto flex-col space-y-2 p-2"
      >
        <div className="rounded-md  p-2">
          <Calendar
            value={date}
            onChange={(val) => {
              onDate([
                val[0] ? val[0].toDate() : undefined,
                val[1] ? val[1].toDate() : undefined,
              ]);
            }}
            calendar={persian}
            locale={afghan_fa}
            range={true}
            calendarPosition="bottom-right"
            inputClass="hidden" // چون از Popover استفاده می‌کنی و نیازی به input نداری
            className={theme === "dark" ? "bg-dark green" : "green"}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
