/**
 * @file components/versionCreateModal/AnnotationsList.js (or .tsx)
 * @description A presentational component that renders a list of annotations.
 * It is responsible for displaying the correct UI based on the loading state
 * and whether there are any annotations to show.
 */

import React from "react";
import { AnnotationItem } from "./AnnotationItem";

/**
 * Renders a list of `AnnotationItem` components.
 *
 * This component handles the display logic for different states:
 * - A loading state while annotations are being fetched.
 * - An empty state message if no annotations are provided.
 * - The populated list of annotations.
 * It delegates all actions (like toggling an item) to its parent via props.
 *
 * @param {object} props - The component props.
 * @param {Array<object>} props.annotations - An array of annotation objects to display. Each object should conform to the shape expected by `AnnotationItem`.
 * @param {function(string|number): void} props.onToggle - The callback function passed down to each `AnnotationItem` to handle the toggle action.
 * @param {boolean} props.isLoading - A flag to indicate if the annotations are currently being loaded.
 * @returns {JSX.Element} The JSX for the annotations list, or a message for loading/empty states.
 */
export const AnnotationsList = ({ annotations, onToggle, isLoading }) => {
  if (isLoading) {
    return (
      <div className="text-center text-gray-500 py-4">
        Chargement des annotations...
      </div>
    );
  }

  if (annotations.length === 0) {
    return (
      <div className="text-center text-gray-500 py-4">
        Aucune annotation sur la version précédente.
      </div>
    );
  }

  return (
    <div className="mt-4">
      <h3 className="text-xl font-medium mb-2 text-gray-300">
        Annotations actuelles
      </h3>
      <ul className="max-h-48 overflow-y-auto pr-2">
        {annotations.map((annotation) => (
          <AnnotationItem
            key={annotation.id}
            annotation={annotation}
            onToggle={onToggle}
          />
        ))}
      </ul>
    </div>
  );
};
