"use client";

import { Clock } from "lucide-react";

/**
 * Displays the duration of a version in a formatted way (M:SS).
 * Shows a placeholder text if the duration is not available.
 *
 * @param {object} props - The component props.
 * @param {number | null} props.versionDuration - The duration of the version in seconds.
 * @returns {JSX.Element} The rendered duration display component.
 */
export function DurationVersion({ versionDuration, isEditable }) {
  const formatDuration = () => {
    if (versionDuration == null || isNaN(versionDuration)) {
      return "Durée non disponible";
    }
    
    const minutes = Math.floor(versionDuration / 60);
    const seconds = Math.floor(versionDuration % 60);
    const formattedSeconds = String(seconds).padStart(2, '0');
    
    return `${minutes}:${formattedSeconds}`;
  };

  return (
    <div className="flex flex-col w-full justify-center rounded gap-2 border border-gray-300 p-2 bg-neutral-800">
      <div className="flex items-center justify-start gap-1">
        <Clock color="#e0e0e0" />
        <span>DURÉE</span>
      </div>
      <p className="pl-2 text-lg">{formatDuration()}</p>
    </div>
  );
}