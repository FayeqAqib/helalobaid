"use client";

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
    ["یک‌شنبه", "یک‌"],
    ["دوشنبه", "دو"],
    ["سه‌شنبه", "سه‌"],
    ["چهارشنبه", "چه"],
    ["پنج‌شنبه", "پن"],
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
import persian_fa from "react-date-object/locales/persian_fa";
import "react-multi-date-picker/styles/backgrounds/bg-dark.css";
import "react-multi-date-picker/styles/colors/green.css";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import moment from "moment-jalaali";
import { useEffect, useState } from "react";

export function DatePickerWithPresets({
  date,
  onDate,
  size = "md",
  placeholder = "تاریخ",
  onlyMonthPicker = false,
}) {
  const { theme: initialTheme } = useTheme();
  const [theme, setTheme] = useState(initialTheme);

  useEffect(() => {
    setTheme(initialTheme);
  }, [initialTheme]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            size == "sm" ? "w-[180px]" : "w-[270px]",
            "justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {onlyMonthPicker ? (
            date ? (
              moment(date).format("jYYYY/jMM")
            ) : (
              <span>{placeholder}</span>
            )
          ) : date ? (
            moment(date).format("jYYYY/jMM/jDD")
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="flex w-auto flex-col space-y-2 p-2"
      >
        <div className="rounded-md  p-2">
          {onlyMonthPicker ? (
            <Calendar
              value={date}
              onChange={(val) => onDate(val ? val.toDate() : undefined)}
              calendar={persian}
              locale={afghan_fa}
              calendarPosition="bottom-right"
              inputClass="hidden" // چون از Popover استفاده می‌کنی و نیازی به input نداری
              className={theme === "dark" ? "bg-dark green" : "green"}
              onlyMonthPicker={onlyMonthPicker}
            />
          ) : (
            <Calendar
              value={date}
              onChange={(val) => onDate(val ? val.toDate() : undefined)}
              calendar={persian}
              locale={afghan_fa}
              calendarPosition="bottom-right"
              inputClass="hidden" // چون از Popover استفاده می‌کنی و نیازی به input نداری
              className={theme === "dark" ? "bg-dark green" : "green"}
            />
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
