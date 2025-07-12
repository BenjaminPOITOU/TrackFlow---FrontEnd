"use client";

import { useState } from "react";
import { KeyboardMusic, ChevronDown, ChevronUp, SquarePen } from "lucide-react";
import { getInstrumentBadgeStyle } from "@/components/shared/InstrumentBadge";

/**
 * @file This component displays a list of instruments for a version,
 * with a collapsible UI and a conditional edit button.
 */

/**
 * Renders a card that displays the instruments of a version.
 * The list of instruments is collapsible. The edit functionality is only
 * available if the `isEditable` prop is true.
 *
 * @param {object} props - The component props.
 * @param {Array<string>} props.versionInstruments - An array of strings, where each string is an instrument name.
 * @param {boolean} [props.isEditable=true] - A flag to control if the card can be edited. If false, the edit button is hidden.
 * @returns {JSX.Element} The rendered instruments card component.
 */
export function InstrumentVersion({ versionInstruments, isEditable = true }) {
  const [isOpen, setIsOpen] = useState(false);
  const hasInstruments = versionInstruments && versionInstruments.length > 0;

  const toggleOpen = () => {
    if (hasInstruments) setIsOpen(!isOpen);
  };

  const handleEdit = () => {
    alert(
      "Editing instruments requires a more complex UI (e.g., a multi-select modal). This is a placeholder."
    );
  };

  return (
    <div className="relative w-full h-full">
      <div className="flex flex-col w-full h-full items-start rounded gap-2 border border-gray-300 p-2 bg-neutral-800 transition-all duration-300">
        <div className="flex items-center justify-between w-full">
          <button
            onClick={toggleOpen}
            className="flex items-center justify-start gap-1 flex-grow cursor-pointer"
            disabled={!hasInstruments}
          >
            <KeyboardMusic color="#e0e0e0" />
            <span>INSTRUMENTS ({versionInstruments?.length || 0})</span>
          </button>

          {hasInstruments && (
            <button onClick={toggleOpen} className="p-1">
              {isOpen ? (
                <ChevronUp size={20} color="#e0e0e0" />
              ) : (
                <ChevronDown size={20} color="#e0e0e0" />
              )}
            </button>
          )}

          {isEditable && (
            <button
              onClick={handleEdit}
              className="p-1 text-gray-400 hover:text-white"
              title="Edit Instruments"
            >
              <SquarePen size={16} />
            </button>
          )}
        </div>

        {!hasInstruments && (
          <p className="text-sm text-gray-500 w-full pl-1">Aucun instrument</p>
        )}
      </div>

      {isOpen && hasInstruments && (
        <div className="absolute top-full left-0 mt-1 w-full z-10 flex flex-col gap-2 rounded-md border border-gray-500 bg-neutral-900 p-2 shadow-lg overflow-y-auto max-h-36">
          {versionInstruments.map((instrument, index) => (
            <p
              key={index}
              style={getInstrumentBadgeStyle(instrument)}
              className="text-sm whitespace-nowrap bg-opacity-80 px-2 py-1 rounded-md"
            >
              {instrument}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
