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

export function DatePickerWithPresets({
  date,
  onDate,
  defaultSelet = true,
  placeholder = "تاریخ",
  onlyMonthPicker = false,
  type = "jalali",
  className = "",
}) {
  const { theme: initialTheme } = useTheme();
  const [theme, setTheme] = useState(initialTheme);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setTheme(initialTheme);
  }, [initialTheme]);

  function handleDateChange(val) {
    onDate(val ? val.toDate() : undefined);
    setOpen(false);
  }
  const location =
    type === "jalali"
      ? {
          calendar: persian,
          locale: afghan_fa,
        }
      : {};
  return (
    <Popover open={open} onOpenChange={setOpen} className=" w-[100%]">
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            className,
            "justify-start text-left font-normal flex-1  bg-primary/20 backdrop-blur-md",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {onlyMonthPicker
            ? date
              ? moment(date).format("jYYYY/jMM")
              : placeholder
            : defaultSelet
            ? type === "jalali"
              ? moment(date ? date : new Date()).format("jYYYY/jMM/jDD")
              : format(date ? date : new Date(), "yyyy/MM/dd")
            : type === "jalali"
            ? date
              ? moment(date).format("jYYYY/jMM/jDD")
              : placeholder
            : date
            ? format(date, "yyyy/MM/dd")
            : placeholder}
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
              onChange={handleDateChange}
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
              onChange={handleDateChange}
              {...location}
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
