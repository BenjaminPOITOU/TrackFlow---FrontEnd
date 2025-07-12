/**
 * @file components/TimeAndCategory.js (or .tsx)
 * @description A composite UI component that groups together controls for an annotation's timestamp,
 * sync status, category, and status. It functions as a fully controlled component,
 * delegating all state management and actions to its parent.
 */


import { SelectCategory } from "./SelectCategory";
import { SelectStatus } from "./SelectStatus";
import { useState } from "react";
import { Link2Off, Link2 } from "lucide-react";



/**
 * Renders a set of related form controls for an annotation.
 *
 * This component displays:
 * 1. The annotation's timestamp (formatted and non-editable).
 * 2. A button to toggle the time synchronization mode.
 * 3. A dropdown to select the annotation's category.
 * 4. A dropdown to select the annotation's status.
 *
 * It is a controlled component, receiving all its values as props and propagating
 * all changes up to the parent component via callback functions.
 *
 * @param {object} props - The component props.
 * @param {boolean} props.btnSynchStatus - The current state of the time-sync toggle (true for synced, false for manual).
 * @param {function(): void} props.onBtnSynchStatus - Callback executed when the sync toggle button is clicked.
 * @param {number|string} props.timePosition - The raw timestamp value (e.g., in seconds).
 * @param {string} props.category - The current value for the category dropdown.
 * @param {string} props.status - The current value for the status dropdown.
 * @param {function(string, any): void} props.onChange - A generic callback executed when category or status changes. It receives the field name ('category' or 'status') and the new value.
 * @returns {JSX.Element} The JSX for the grouped form controls.
 */
export function TimeAndCategory({
  btnSynchStatus,
  onBtnSynchStatus,
  timePosition,
  category,
  status,
  onChange,
}) {
  const [isSynchHovering, setIsSynchHovering] = useState(false);

  const handleFieldChange = (field, val) => {
    onChange(field, val);
  };

  const formatTime = (time) => {
    if (time === undefined || time === null || time === "") return "- : - -";

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col justify-center items-end gap-2 w-full">
      <div className="flex flex-col w-full justify-center items-end px-4">
        <div className="flex gap-1 justify-end items-center text-sm w-full py-2 ">
          <span>TIME : </span>
          <input
            disabled
            className={`border border-gray-300 p-1 px-2 rounded ${
              !btnSynchStatus
                ? "bg-gray-400 text-gray-500"
                : "bg-neutral-700 text-gray-300"
            }  cursor-not-allowed w-18`}
            value={formatTime(timePosition)}
            readOnly
          />
          <button
            onMouseLeave={() => setIsSynchHovering(false)}
            onMouseEnter={() => setIsSynchHovering(true)}
            className={`border rounded-full  p-2 cursor-pointer right-3 ml-2 ${
              btnSynchStatus ? "border-[#21e114]" : "border-gray-300"
            }`}
            onClick={() => onBtnSynchStatus()}
          >
            {btnSynchStatus ? (
              <Link2
                className="transition-all ease-out-linear"
                size={15}
                color="#21e114"
                strokeWidth={2.5}
              />
            ) : (
              <Link2Off size={15} color="#e0e0e0" />
            )}
          </button>
        </div>

        <div className="flex justify-end items-center gap-2 text-sm w-full">
          <span className="items-start whitespace-nowrap">CATEGORIE : </span>
          <SelectCategory
            className="cursor-pointer"
            value={category}
            onValueChange={(val) => handleFieldChange("category", val)}
          />
        </div>
      </div>

      <div className="flex w-full justify-end items-center pr-4 gap-2 text-sm">
        <span>STATUT : </span>
        <SelectStatus
          className="cursor-pointer"
          value={status}
          onValueChange={(val) => handleFieldChange("status", val)}
        />
      </div>
    </div>
  );
}
