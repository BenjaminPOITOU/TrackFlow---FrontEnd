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
import { cn } from "@/lib/utils";

function SelectEnumComponent({
  label,
  placeholder,
  options = [],
  value,
  onValueChange,
  className = "w-full",
  ...props
}) {
  return (
    <Select value={value} onValueChange={onValueChange} {...props}>
      <SelectTrigger
        className={cn(
          "bg-zinc-700 border-zinc-600 focus:ring-offset-zinc-900 data-[placeholder]:text-zinc-400 focus:ring-gray-300 cursor-pointer",
          className
        )}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent
        className={cn("z-999",
          "bg-zinc-700 border-zinc-600 text-white",
          "data-[state=open]:ring-2 data-[state=open]:ring-gray-300 data-[state=open]:ring-offset-2 data-[state=open]:ring-offset-zinc-900"
        )}
      >
        <SelectGroup>
          {label && (
            <SelectLabel className="text-zinc-400">{label}</SelectLabel>
          )}
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="hover:bg-zinc-600 focus:bg-zinc-600"
            >
              {option.label}
            </SelectItem>
          ))}
          {options.length === 0 && (
            <SelectItem value="no-options" disabled>
              No options available
            </SelectItem>
          )}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

const SelectEnum = React.memo(SelectEnumComponent);

export default SelectEnum;
