"use client";

import { EditableDetailCard } from "./EditableDetailCard";
import { FileText } from "lucide-react";

/**
 * @file Defines the component for displaying and editing a branch's description.
 */

/**
 * Displays and allows editing of the branch description using the EditableDetailCard component.
 * It shows a placeholder text in French if the description is not available.
 *
 * @param {object} props - The component props.
 * @param {string | null | undefined} props.branchDescription - The current description of the branch.
 * @param {Function} props.onDescriptionSave - The callback function to save the new description. It is called with an object like `{ description: newValue }`.
 * @returns {JSX.Element} The rendered description card component.
 */
export function DescriptionVersion({ branchDescription, onDescriptionSave }) {
  const handleSave = (newValue) => {
    onDescriptionSave({ description: newValue });
  };

  return (
    <EditableDetailCard
      title="DESCRIPTION"
      icon={<FileText size={20} color="#e0e0e0" />}
      value={branchDescription}
      onSave={handleSave}
      displayFormatter={(val) => val || "Aucune description pour cette branche."}
      className="cursor-pointer"
    >
      {(value, setValue) => (
        <textarea
          value={value || ""}
          onChange={(e) => setValue(e.target.value)}
          className="w-full bg-zinc-700 border border-cyan-500 rounded-md p-1 resize-none text-white"
          rows={3}
          placeholder="Ajoutez une description..."
        />
      )}
    </EditableDetailCard>
  );
}