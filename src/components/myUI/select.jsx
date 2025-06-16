import * as React from "react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function SelectInput({options,lable,field,disabled=false}) {
  return (
    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={disabled}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="نوع حساب را مشخص کنید" />
      </SelectTrigger>
      <SelectContent >
        <SelectGroup>
          <SelectLabel>{lable}</SelectLabel>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value} className={'text-right'}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
