"use client";
/**
 * @file components/modals/ProjectCreateModal.js (or .tsx)
 * @description Defines a specialized modal for creating a new project.
 * It acts as a shell, composing the generic `ModalWrapper` and the specific `ProjectCreationForm`
 * to provide a complete user experience for project creation.
 */

import { ModalWrapper } from "../ModalWrapper";
import ProjectCreationForm from "./ProjectCreationForm";

/**
 * Renders a modal dialog that contains the form for creating a new project.
 *
 * This component is a lightweight wrapper that orchestrates the interaction between
 * a generic modal and the project creation form. It passes down props to control visibility
 * and handle the outcomes (success or cancellation).
 *
 * @param {object} props - The component props.
 * @param {boolean} props.isOpen - Controls the visibility of the modal.
 * @param {function(boolean): void} props.onOpenChange - Callback function to update the modal's open state.
 * @param {function(object): void} props.onProjectCreated - Callback executed when the form submission is successful. It is passed down to the `ProjectCreationForm`.
 * @returns {JSX.Element} The JSX for the fully composed project creation modal.
 */
export default function ProjectCreateModal({
  isOpen,
  onOpenChange,
  onProjectCreated,
}) {
  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={() => onOpenChange(false)}
      title="Créer un nouveau Projet"
      description="Complétez les détails ci-dessous pour démarrer votre projet."
      className="sm:max-w-4xl"
    >
      <ProjectCreationForm
        onCancel={() => onOpenChange(false)}
        onSuccess={onProjectCreated}
      />
    </ModalWrapper>
  );
}
