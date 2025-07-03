"use client";

import { ModalWrapper } from "../ModalWrapper";
import ProjectCreationForm from "./ProjectCreationForm";

/**
 * A lightweight shell component for the project creation modal.
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