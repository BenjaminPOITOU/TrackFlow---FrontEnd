"use client";

import { ModalWrapper } from "../ModalWrapper";
import { CompositionCreateForm } from "./CompositionCreateForm";

/**
 * A shell component for the composition creation modal.
 * It manages the open/closed state and renders the creation form inside.
 * @param {object} props
 * @param {boolean} props.isOpen - Whether the modal is open.
 * @param {(open: boolean) => void} props.onOpenChange - Function to change the open state.
 * @param {string} props.projectId - The ID of the parent project.
 * @param {() => void} props.onCompositionCreated - Callback for successful creation.
 * @returns {JSX.Element}
 */
export function CompositionCreateModal({
  isOpen,
  onOpenChange,
  projectId,
  onCompositionCreated,
}) {
  const handleSuccess = () => {
    onOpenChange(false);
    if (onCompositionCreated) {
      onCompositionCreated();
    }
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={() => onOpenChange(false)}
      title="NOUVELLE COMPOSITION"
      description="AJOUTEZ UNE NOUVELLE PISTE À VOTRE PROJET"
      className="sm:max-w-4xl px-4"
    >
      <CompositionCreateForm
        projectId={projectId}
        onCancel={() => onOpenChange(false)}
        onSuccess={handleSuccess}
      />
    </ModalWrapper>
  );
}
