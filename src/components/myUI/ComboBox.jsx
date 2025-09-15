"use client";

import { Check, ChevronsUpDown, Loader2Icon } from "lucide-react";

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
import { getAllCostTitalAction } from "@/actions/costTitalAction";
import { getAllProceedTitalAction } from "@/actions/proceedTitalAction";
import { getAllProductAction } from "@/actions/productAction";
import { getAllUnitAction } from "@/actions/unitAction";
import { getAllDepotAction } from "@/actions/depotAction";
import { getListOfDepotItemsAction } from "@/actions/depotItemsAction";
import { getListOfItemsActions } from "@/actions/itemsAction";

// const optionslist = [
//   { label: "ایران", value: "68426436f40989bb6a60bf55" },
//   { label: "آلمان", value: "DE" },
// ];

export function AutoCompleteV2({
  label = "فروشنده را اتنخاب کنید..",
  value,
  onChange,
  disabled = false,
  type,
  dataType = "customer",
  lend = false,
  borrow = false,
  filter = "",
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    async function get() {
      let result;
      setIsLoading(true);
      if (dataType === "customer") {
        result = await getAllSallerAndBuyerAction(type, lend, borrow);
      } else if (dataType === "cost") {
        result = await getAllCostTitalAction();
      } else if (dataType === "proceed") {
        result = await getAllProceedTitalAction();
      } else if (dataType === "product") {
        result = await getAllProductAction();
      } else if (dataType === "unit") {
        result = await getAllUnitAction();
      } else if (dataType === "depot") {
        result = await getAllDepotAction();
      } else if (dataType === "items") {
        result = await getListOfItemsActions(filter);
        console.log(filter);
      }

      if (!["customer", "items"].includes(dataType)) {
        const data = result.result.map((item) => {
          return { value: item._id, label: item.name };
        });
        setOptions(data);
        if (dataType === "depot") onChange(`${data[0].label}_${data[0].value}`);
      } else if (dataType === "customer") {
        setOptions(result.result);
      } else if (dataType === "items") {
        const newResult = result.result.map((item) => {
          return {
            value:
              item.product._id +
              "-" +
              item.aveUnitAmount +
              "-" +
              item.depot._id +
              "," +
              item.depot.name +
              "-" +
              item.unit._id +
              "," +
              item.unit.name,
            label:
              item.product.name +
              " " +
              "-" +
              " " +
              "(" +
              item.unit.name +
              ")" +
              " " +
              item.count,
          };
        });
        setOptions(newResult);
      }

      setIsLoading(false);
    }
    get();
  }, [filter]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={
            " text-right overflow-hidden bg-primary/20 backdrop-blur-md"
          }
        >
          {value ? value?.split("_")[0] : label}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={` w-[200px] p-0`}>
        <Command>
          <CommandInput placeholder="جستجو " className="h-9" />
          <CommandList>
            {isLoading ? (
              <div className="flex items-center justify-center flex-1 min-h-24">
                <Loader2Icon className="animate-spin mr-2" />
              </div>
            ) : (
              <>
                <CommandEmpty>فروشنده ای پیدا نشد.</CommandEmpty>
                <CommandGroup>
                  {options?.map((option) => (
                    <CommandItem
                      disabled={disabled}
                      key={option.value}
                      value={`${option.label}_${option.value}`}
                      onSelect={(currentValue) => {
                        onChange(currentValue === value ? "" : currentValue);
                        setOpen(false);
                      }}
                    >
                      {option.label}
                      <Check
                        className={cn(
                          "ml-auto",
                          value === option.label + "_" + option.value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
