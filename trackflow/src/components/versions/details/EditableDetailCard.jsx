"use client";
import { useState, useEffect } from "react";
import { Check, SquarePen, X } from "lucide-react";

/**
 * @file A reusable card component for displaying and editing a single piece of data.
 * It manages its own editing state and provides a consistent UI for saving or canceling.
 * The component synchronizes its internal state with the `value` prop and allows
 * its editability to be controlled externally.
 */

/**
 * A generic, reusable card that provides an "in-place" editing UI for a value.
 *
 * @param {object} props - The component props.
 * @param {string} props.title - The title of the card (e.g., "TEMPO", "DESCRIPTION").
 * @param {JSX.Element} props.icon - The Lucide icon component to display next to the title.
 * @param {any} props.value - The current value to display and edit.
 * @param {Function} props.onSave - Callback function to execute when saving. It receives the new value as its only argument.
 * @param {Function} props.children - A render prop function that receives the current edited value and a setter function. It should return the input component (e.g., <input>, <textarea>) to be rendered in edit mode.
 * @param {string} props.className - Additional CSS classes to apply to the component's root element.
 * @param {Function} [props.displayFormatter=(val) => val] - An optional function to format the value for display when not in edit mode.
 * @param {boolean} [props.isEditable=true] - A flag to explicitly control if the card can be switched to edit mode. If false, the edit button will not be rendered.
 * @returns {JSX.Element} The rendered editable detail card component.
 */
export function EditableDetailCard({
  title,
  icon,
  value,
  onSave,
  children,
  className,
  displayFormatter = (val) => val,
  isEditable = true,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedValue, setEditedValue] = useState(value);

  const handleSave = () => {
    onSave(editedValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedValue(value);
    setIsEditing(false);
  };

  useEffect(() => {
    if (!isEditing) {
      setEditedValue(value);
    }
  }, [value, isEditing]);

  useEffect(() => {
    if (!isEditable) {
      setIsEditing(false);
    }
  }, [isEditable]);

  return (
    <div
      className={`flex flex-col w-full h-full justify-center rounded gap-2 border border-gray-300 p-2 bg-neutral-800 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-start gap-1">
          {icon}
          <span>{title}</span>
        </div>
        {!isEditing && onSave && isEditable && (
          <button
            onClick={() => setIsEditing(true)}
            className="p-1 text-gray-400 hover:text-white"
            title="Edit"
          >
            <SquarePen size={16} />
          </button>
        )}
      </div>

      {isEditing && isEditable ? (
        <div className="flex flex-col gap-2">
          {children(editedValue, setEditedValue)}
          <div className="flex justify-end gap-2">
            <button
              onClick={handleCancel}
              className="p-1 text-red-400 hover:text-red-300"
              title="Cancel"
            >
              <X size={20} />
            </button>
            <button
              onClick={handleSave}
              className="p-1 text-green-400 hover:text-green-300"
              title="Save"
            >
              <Check size={20} />
            </button>
          </div>
        </div>
      ) : (
        <p className="pl-2 text-lg">{displayFormatter(value) || "N/A"}</p>
      )}
    </div>
  );
}
