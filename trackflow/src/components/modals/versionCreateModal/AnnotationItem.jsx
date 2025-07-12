/**
 * @file modals/versionCreateModal/AnnotationItem.js (or .tsx)
 * @description A presentational component that renders a single annotation within a list.
 * It displays the annotation's content and provides a checkbox to toggle its "resolved" status.
 */

import React from "react";

/**
 * Renders a single list item for an annotation.
 *
 * This is a "dumb" or "presentational" component. It does not manage its own state.
 * It receives an annotation object and a callback function via props and renders the UI accordingly.
 * All actions, like toggling the resolved state, are delegated to the parent component.
 *
 * @param {object} props - The component props.
 * @param {{id: string|number, content: string, resolved: boolean}} props.annotation - The annotation object to display.
 * @param {function(string|number): void} props.onToggle - A callback function that is invoked with the annotation's ID when the "resolved" checkbox is toggled.
 * @returns {JSX.Element} A list item (`<li>`) representing the annotation.
 */

export const AnnotationItem = ({ annotation, onToggle }) => {
  return (
    <li className="flex items-center justify-between py-2 border-b border-zinc-700">
      <span
        className={`text-sm ${annotation.resolved ? "text-gray-500 line-through" : "text-gray-300"}`}
      >
        {annotation.content}
      </span>

      <div className="flex items-center space-x-4">
        <label
          htmlFor={`resolved-${annotation.id}`}
          className="flex items-center cursor-pointer"
        >
          <input
            id={`resolved-${annotation.id}`}
            type="checkbox"
            checked={annotation.resolved}
            onChange={() => onToggle(annotation.id)}
            className="h-4 w-4 bg-zinc-800 border-gray-400 rounded text-indigo-500 focus:ring-indigo-600"
          />
          <span className="ml-2 text-xs text-gray-400">Résolue</span>
        </label>
      </div>
    </li>
  );
};
