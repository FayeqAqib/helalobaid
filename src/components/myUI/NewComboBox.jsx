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

export function AutoCompleteV3({
  label = "   جستجو..",
  value,
  onChange,
  disabled = false,
  data = [],
  isLoading = false,
  className,
}) {
  const [options, setOptions] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOptions(data);
  }, [data, isLoading]);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            " text-right overflow-hidden bg-primary/20 backdrop-blur-md ",
            className
          )}
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
                <CommandEmpty>نتیجه ای پیدا نشد.</CommandEmpty>
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
