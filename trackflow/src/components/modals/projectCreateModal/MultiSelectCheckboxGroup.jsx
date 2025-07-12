"use client";

import { useState, useMemo } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Search } from "lucide-react";

/**
 * A reusable component for a filterable list of checkboxes.
 * @param {object} props - The component props.
 * @param {string} props.label - The label for the entire group.
 * @param {Array<{label: string, value: string}>} props.options - The available options.
 * @param {Array<string>} props.selectedValues - The currently selected values.
 * @param {(values: Array<string>) => void} props.onSelectionChange - Callback when selection changes.
 * @param {boolean} [props.disabled=false] - Whether the component is disabled.
 * @returns {JSX.Element} A multi-select checkbox group component.
 */
export default function MultiSelectCheckboxGroup({
  label,
  options = [],
  selectedValues = [],
  onSelectionChange,
  disabled = false,
}) {
  const [filter, setFilter] = useState("");

  const handleCheckboxChange = (checked, value) => {
    const newSelection = checked
      ? [...selectedValues, value]
      : selectedValues.filter((v) => v !== value);
    onSelectionChange(newSelection);
  };

  const filteredOptions = useMemo(
    () =>
      filter
        ? options.filter((o) =>
            o.label.toLowerCase().includes(filter.toLowerCase())
          )
        : options,
    [options, filter]
  );

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={`Filter ${label.toLowerCase()}...`}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="pl-8"
          disabled={disabled}
        />
      </div>
      <div className="h-40 max-h-48 min-h-[8rem] space-y-2 overflow-y-auto rounded-md border bg-background/50 p-3">
        {filteredOptions.length > 0 ? (
          filteredOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <Checkbox
                id={`${label}-${option.value}`}
                checked={selectedValues.includes(option.value)}
                onCheckedChange={(checked) =>
                  handleCheckboxChange(checked, option.value)
                }
                disabled={disabled}
              />
              <Label
                htmlFor={`${label}-${option.value}`}
                className="cursor-pointer font-normal"
              >
                {option.label}
              </Label>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground italic">
            {filter ? "No matching options." : "No options available."}
          </p>
        )}
      </div>
    </div>
  );
}
