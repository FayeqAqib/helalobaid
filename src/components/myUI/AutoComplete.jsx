"use client";

import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useEffect, useState } from "react";
import { getAllSallerAndBuyerAction } from "@/actions/accountAction";

export function AutoComplete({
  label = "فروشنده را اتنخاب کنید..",
  field,
  size = "lg",
  type,
  lend = false,
  borrow = false,
}) {
  const [options, setOptions] = useState([]);
  useEffect(() => {
    async function getOptions() {
      const result = await getAllSallerAndBuyerAction(type, lend, borrow);
      setOptions(result.result);
    }
    getOptions();
  }, []);

  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={
            size == "sm" ? "w-[180px]" : "w-[270px]" + "justify-between"
          }
        >
          {field.value
            ? options?.find((option) => option.value === field.value)?.label
            : label}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="جستجو فروشده" className="h-9" />
          <CommandList>
            <CommandEmpty>فروشنده ای پیدا نشد.</CommandEmpty>
            <CommandGroup>
              {options?.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    field.onChange(
                      currentValue === field.value ? "" : currentValue
                    );
                    setOpen(false);
                  }}
                >
                  {option.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      field.value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
