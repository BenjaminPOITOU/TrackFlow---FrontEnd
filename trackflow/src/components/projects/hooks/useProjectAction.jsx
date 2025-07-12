"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { archiveProjectById, deleteProjectById } from "@/lib/api/projects";

/**
 * Custom hook to handle project actions like archiving and deleting.
 * It manages loading states, API calls, and UI feedback via toasts and router refresh.
 * @returns {{
 *  isLoading: boolean,
 *  isProcessing: (actionType: 'archive' | 'delete') => boolean,
 *  handleArchive: (userId: string, projectId: string) => Promise<void>,
 *  handleDelete: (userId: string, projectId: string) => Promise<void>
 * }}
 */
export function useProjectAction() {
  const router = useRouter();
  const [processingAction, setProcessingAction] = useState(null);

  const handleArchive = useCallback(
    async (userId, projectId) => {
      setProcessingAction("archive");
      try {
        await archiveProjectById(userId, projectId);
        toast.success("Projet archivé avec succés !");
        router.refresh();
      } catch (err) {
        toast.error(err.message || "Echec de l'archivage du projet.");
      } finally {
        setProcessingAction(null);
      }
    },
    [router]
  );

  const handleDelete = useCallback(
    async (userId, projectId) => {
      if (!userId) {
        toast.error(
          "Erreur d'autehnfication. S'il vous plait, reconnectez vous."
        );
        return;
      }
      setProcessingAction("delete");
      try {
        await deleteProjectById(userId, projectId);
        toast.success("Projet supprimé avec succés !");
        router.refresh();
      } catch (err) {
        toast.error(err.message || "Erreur de la suppression du projet.");
      } finally {
        setProcessingAction(null);
      }
    },
    [router]
  );

  return {
    isLoading: !!processingAction,
    isProcessing: (actionType) => processingAction === actionType,
    handleArchive,
    handleDelete,
  };
}
