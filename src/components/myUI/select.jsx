import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SelectInput({
  options,
  lable,
  lable2,
  field,
  disabled = false,
  fullwidth = false,
}) {
  return (
    <Select
      onValueChange={(value) => field.onChange(value)}
      defaultValue={field.value}
      disabled={disabled}
      width={500}
      dir="rtl"
    >
      <SelectTrigger className={fullwidth ? " w-[100%]" : ""}>
        <SelectValue placeholder={lable2 ? lable2 : "نوع حساب را مشخص کنید"} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{lable}</SelectLabel>
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className={"text-right "}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
