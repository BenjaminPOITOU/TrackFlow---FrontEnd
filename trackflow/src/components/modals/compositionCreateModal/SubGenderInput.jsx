"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

/**
 * A "tag-like" input component for managing a list of strings.
 * @param {object} props
 * @param {string[]} props.value - The current array of strings.
 * @param {(newValue: string[]) => void} props.onChange - Callback when the list changes.
 * @param {boolean} props.disabled - Whether the component is disabled.
 */
export function SubGenderInput({ value, onChange, disabled }) {
  const [inputValue, setInputValue] = useState("");

  const handleAdd = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
      setInputValue("");
    }
  };

  const handleRemove = (tagToRemove) => {
    onChange(value.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          placeholder="Ajouter un sous-genre et appuyer sur Entrée..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
        />
        <Button type="button" onClick={handleAdd} disabled={disabled || !inputValue}>
          Ajouter
        </Button>
      </div>
      <div className="flex flex-wrap gap-2 min-h-[2.5rem] p-2 bg-zinc-800 rounded-md">
        {value.map((tag) => (
          <div key={tag} className="flex items-center gap-1.5 bg-zinc-600 text-white text-sm rounded-full px-3 py-1">
            <span>{tag}</span>
            <button type="button" onClick={() => handleRemove(tag)} disabled={disabled} className="rounded-full hover:bg-zinc-500">
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}