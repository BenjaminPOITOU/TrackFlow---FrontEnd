"use client";

import { Music2 } from "lucide-react";
import { EditableDetailCard } from "./EditableDetailCard";

const musicalKeys = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "Cm", "C#m", "Dm", "D#m", "Em", "Fm", "F#m", "Gm", "G#m", "Am", "A#m", "Bm"];

/**
 * Displays and allows editing of the version's musical key.
 * Shows a placeholder text in French if the key is not available.
 *
 * @param {object} props - The component props.
 * @param {string | null} props.versionKey - The current musical key of the version.
 * @param {Function} props.onKeySave - The callback function to save the new key.
 * @returns {JSX.Element} The rendered key card component.
 */
export function KeyVersion({ versionKey, onKeySave, isEditable }) {
  return (
    <EditableDetailCard
      title="KEY"
      icon={<Music2 color="#e0e0e0" />}
      value={versionKey}
      onSave={(newValue) => onKeySave({ key: newValue })}
      displayFormatter={(val) => val || "Non définie"}
      isEditable={isEditable}
    >
      {(value, setValue) => (
        <select
          value={value || ""}
          onChange={(e) => setValue(e.target.value)}
          className="w-full bg-zinc-700 border border-cyan-500 rounded-md p-1 text-white"
        >
          <option value="">Non définie</option>
          {musicalKeys.map(k => <option key={k} value={k}>{k}</option>)}
        </select>
      )}
    </EditableDetailCard>
  );
}