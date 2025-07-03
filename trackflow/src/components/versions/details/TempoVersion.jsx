"use client";

import { Drum } from "lucide-react";
import { EditableDetailCard } from "./EditableDetailCard";

/**
 * @file This component displays and allows editing of a version's tempo (BPM).
 */

/**
 * Renders an EditableDetailCard specifically for the version's tempo.
 * It shows a placeholder text in French if the tempo is not available.
 * The edit functionality can be disabled via the `isEditable` prop.
 *
 * @param {object} props - The component props.
 * @param {string | null} props.versionBpm - The current BPM of the version.
 * @param {Function} props.onBpmSave - The callback function to save the new BPM.
 * @param {boolean} [props.isEditable=true] - A flag to control if the card can be edited. Defaults to true.
 * @returns {JSX.Element} The rendered tempo card component.
 */
export function TempoVersion({ versionBpm, onBpmSave, isEditable }) {
  return (
    <EditableDetailCard
      title="TEMPO"
      icon={<Drum size={20} color="#e0e0e0" />}
      value={versionBpm}
      onSave={(newValue) => onBpmSave({ bpm: newValue })}
      displayFormatter={(val) => (val ? `${val} BPM` : "Non défini")}
      isEditable={isEditable}
    >
      {(value, setValue) => (
        <input
          type="number"
          value={value || ""}
          onChange={(e) => setValue(e.target.value)}
          className="w-full bg-zinc-700 border border-cyan-500 rounded-md p-1 text-white"
          placeholder="ex: 120"
        />
      )}
    </EditableDetailCard>
  );
}