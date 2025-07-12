"use client";

import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import { deleteCompositionById } from "@/lib/api/compositions";
import { toast } from "sonner";
import ActionConfirmationDialog from "@/components/shared/ActionConfirmationDialog";

/**
 * A centralized dialog for confirming deletion of a composition.
 * @param {object} props
 * @param {boolean} props.isOpen - Whether the dialog is open.
 * @param {(open: boolean) => void} props.onClose - Function to close the dialog.
 * @param {string} props.projectId - ID of the project.
 * @param {object} props.composition - The composition object.
 * @param {(compositionId: string) => void} props.onCompositionDeleted - Callback on successful deletion.
 */
export function DeleteCompositionDialog({
  isOpen,
  onClose,
  projectId,
  composition,
  onCompositionDeleted,
}) {
  const [isConfirming, setIsConfirming] = useState(false);

  const handleConfirmDelete = async () => {
    setIsConfirming(true);
    try {
      await deleteCompositionById(projectId, composition.id);
      toast.success(`La composition "${composition.title}" a été supprimée.`);
      onCompositionDeleted(composition.id);
      onClose();
    } catch (error) {
      toast.error("Échec de la suppression de la composition.");
      console.error(error);
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <ActionConfirmationDialog
      isOpen={isOpen}
      onOpenChange={(open) => !open && onClose()}
      onConfirm={handleConfirmDelete}
      isConfirming={isConfirming}
      title="Supprimer la composition définitivement ?"
      titleIcon={<AlertTriangle className="h-5 w-5 text-red-500" />}
      description={`Cette action est irréversible. La composition "${composition.title}" sera définitivement supprimée.`}
      confirmText="Oui, supprimer de manière permanente"
      variant="danger"
    />
  );
}
