"use client";
/**
 * @file components/versionCreateModal/BranchSelector.js (or .tsx)
 * @description A controlled dropdown component for selecting a destination branch for a new version.
 */
import React from "react";

/**
 * Renders a dropdown menu (`<select>`) for choosing a destination branch.
 *
 * This is a fully controlled component. It receives its current value (`selectedBranchId`)
 * and the list of options (`branches`) via props. Any change is communicated back
 * to the parent component through the `onBranchChange` callback. It also handles a
 * loading state to provide user feedback.
 *
 * @param {object} props - The component props.
 * @param {Array<{id: string|number, name: string}>} props.branches - An array of branch objects used to populate the dropdown.
 * @param {string|number} props.selectedBranchId - The ID of the currently selected branch, controlled by the parent.
 * @param {function(string): void} props.onBranchChange - A callback function executed when the user selects a new branch, receiving the new branch ID.
 * @param {boolean} props.isLoading - A flag to disable the control and display a loading message.
 * @param {string|number} props.compositionId - The ID of the composition this selector is for (passed for context).
 * @returns {JSX.Element} A div containing a label and a select dropdown.
 */
export const BranchSelector = ({
  branches,
  selectedBranchId,
  onBranchChange,
  isLoading,
  compositionId,
}) => {
  return (
    <div>
      <label
        htmlFor="branch-select"
        className="block text-xl font-medium text-gray-300 mb-1"
      >
        Branche de destination
      </label>
      <select
        id="branch-select"
        className="block w-full p-2 border border-zinc-700 rounded-md shadow-sm cursor-pointer"
        value={selectedBranchId ?? ""}
        onChange={(e) => onBranchChange(e.target.value)}
        disabled={isLoading}
      >
        <option value="" disabled>
          {isLoading
            ? "Chargement des branches..."
            : "Sélectionnez une branche"}
        </option>
        {branches.map((branch) => (
          <option key={branch.id} value={branch.id}>
            {branch.name}
          </option>
        ))}
      </select>
    </div>
  );
};
