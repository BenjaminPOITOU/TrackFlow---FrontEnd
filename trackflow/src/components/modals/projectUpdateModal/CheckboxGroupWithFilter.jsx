"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Search } from "lucide-react";

/**
 * A reusable component displaying a filterable list of checkboxes.
 * @param {object} props
 * @param {string} props.label - The main label for the group.
 * @param {string} props.filterValue - The current value of the filter input.
 * @param {(value: string) => void} props.onFilterChange - Callback for filter input changes.
 * @param {Array<{label: string, value: string}>} props.options - The list of all possible options.
 * @param {string[]} props.selectedValues - The array of currently selected values.
 * @param {(value: string, isChecked: boolean) => void} props.onSelectionChange - Callback when a checkbox is toggled.
 * @param {boolean} props.disabled - Whether the component is disabled.
 * @returns {JSX.Element}
 */
export function CheckboxGroupWithFilter({
  label,
  filterValue,
  onFilterChange,
  options,
  selectedValues,
  onSelectionChange,
  disabled,
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <div className="relative">
        <Input
          type="text"
          placeholder={`Filtrer ${label.toLowerCase()}...`}
          value={filterValue}
          onChange={(e) => onFilterChange(e.target.value)}
          className="bg-zinc-800 border-zinc-600 pl-8 text-sm"
          disabled={disabled}
        />
        <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
      </div>
      <div className="space-y-2 mt-1 rounded border border-zinc-600 p-3 min-h-[8rem] max-h-48 overflow-y-auto bg-zinc-700">
        {options.length > 0 ? (
          options.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <Checkbox
                id={`${label}-${option.value}`}
                checked={selectedValues.includes(option.value)}
                onCheckedChange={(checked) =>
                  onSelectionChange(option.value, checked)
                }
                disabled={disabled}
              />
              <Label
                htmlFor={`${label}-${option.value}`}
                className="font-normal cursor-pointer text-gray-300"
              >
                {option.label}
              </Label>
            </div>
          ))
        ) : (
          <p className="text-sm text-zinc-400 italic">
            Aucune option correspondante.
          </p>
        )}
      </div>
    </div>
  );
}