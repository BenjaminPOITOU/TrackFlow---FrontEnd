"use client";

import { ModalWrapper } from "../ModalWrapper";
import { ProjectUpdateForm } from "./ProjectUpdateForm";

/**
 * A lightweight shell component for the project update modal.
 * It handles the open/closed state and renders the update form inside.
 * @param {object} props
 * @param {boolean} props.isOpen - Whether the modal is open.
 * @param {(open: boolean) => void} props.onOpenChange - Function to change the open state.
 * @param {string} props.projectId - The ID of the project to update.
 * @param {string} props.userId - The ID of the current user.
 * @param {() => void} props.onProjectUpdated - Callback for successful project update.
 * @returns {JSX.Element} The dialog component containing the update form.
 */
export function ProjectUpdateModal({
  isOpen,
  onOpenChange,
  projectId,
  userId,
  onProjectUpdated,
}) {
  const handleSuccess = () => {
    onOpenChange(false);
    if (onProjectUpdated) {
      onProjectUpdated();
    }
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={() => onOpenChange(false)}
      title="MODIFIER LE PROJET"
      description="METTEZ À JOUR LES DÉTAILS DE VOTRE PROJET AUDIO"
      className="sm:max-w-4xl max-h-[90vh]"
    >
      <ProjectUpdateForm
        projectId={projectId}
        userId={userId}
        onCancel={() => onOpenChange(false)}
        onSuccess={handleSuccess}
      />
    </ModalWrapper>
  );
}