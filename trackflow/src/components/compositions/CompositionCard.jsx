"use client";

import { useState } from "react";
import { format, isValid, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { FileMusic, Trash2, SquarePen, Check, X } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { AlertDialogCompostion } from "./AlertDialogComposition";
import { updateCompositionById } from "@/lib/api/compositions";

/**
 * @file Defines a card component to display and manage a single composition.
 * It includes functionality for in-place title editing, navigation, and deletion.
 */

/**
 * Renders a card for a single composition, allowing for title editing, deletion,
 * and navigation to the composition's detail page.
 *
 * @param {object} props The component props.
 * @param {object} props.composition The composition object to display.
 * @param {string} props.background The background CSS class for the card.
 * @param {string|number} props.projectId The ID of the parent project.
 * @param {Function} props.onCompositionDeleted A callback function executed after a composition is deleted.
 * @param {Function} props.onCompositionUpdated A callback function executed after a composition is successfully updated.
 * @returns {JSX.Element} The rendered composition card component.
 */
export function CompositionCard({ composition, background, projectId, onCompositionDeleted, onCompositionUpdated }) {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(composition.title);

  const compositionUrl = `/projects/${projectId}/compositions/${composition?.id}`;

  const totalBranches = composition?.totalBranches || 0;
  const totalVersions = composition?.totalVersions || 0;
  const brancheLabel = totalBranches > 1 ? "BRANCHES" : "BRANCHE";
  const versionLabel = totalVersions > 1 ? "VERSIONS" : "VERSION";

  const formattedDate = composition?.lastUpdateDate
  ? (() => {
      let dateObj;
      const dateInput = composition.lastUpdateDate;

      if (typeof dateInput === "string") {
        dateObj = parseISO(dateInput);
      } else if (typeof dateInput === "number") {
        dateObj = new Date(dateInput * 1000);
      } else {
        return "N/A";
      }

      return isValid(dateObj) ? format(dateObj, "dd/MM/yyyy", { locale: fr }) : "N/A";
    })()
  : "N/A";

  const handleSaveTitle = async () => {
    if (editedTitle === composition.title || !editedTitle.trim()) {
      setIsEditing(false);
      setEditedTitle(composition.title);
      return;
    }

    try {
      await updateCompositionById(projectId, composition.id, { title: editedTitle });
      toast.success("Composition title updated successfully.");
      if (onCompositionUpdated) {
        onCompositionUpdated();
      }
    } catch (error) {
      toast.error("Failed to update composition title.");
      setEditedTitle(composition.title);
    } finally {
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedTitle(composition.title);
  };

  return (
    <div className={`relative flex w-full items-center py-2 px-2 border border-gray-700 ${background}`}>
      <div className="w-1/3 self-start flex items-center gap-2">
        <FileMusic className="w-4 h-4 text-gray-300 flex-shrink-0" />
        {isEditing ? (
          <div className="flex items-center gap-2 w-full">
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveTitle();
                if (e.key === 'Escape') handleCancelEdit();
              }}
              className="bg-zinc-700 border border-cyan-500 rounded-md p-1 text-white w-full"
              autoFocus
            />
            <button onClick={handleSaveTitle} className="p-1 text-green-400 hover:text-green-300" title="Save"><Check size={20} /></button>
            <button onClick={handleCancelEdit} className="p-1 text-red-400 hover:text-red-300" title="Cancel"><X size={20} /></button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link href={compositionUrl} className="text-lg hover:underline">
              {composition.title || "Composition Sans Titre"}
            </Link>
            <button onClick={() => setIsEditing(true)} className="p-1 text-gray-400 hover:text-white" title="Edit Title"><SquarePen size={16} /></button>
          </div>
        )}
      </div>

      <Link href={compositionUrl} className="w-2/3 flex items-center cursor-pointer">
        <div className="flex items-center w-full">
          <span className="flex-1 text-center">{`${totalVersions} ${versionLabel}`}</span>
          <span className="flex-1 text-center">{`${totalBranches} ${brancheLabel}`}</span>
          <span className="flex-1 text-center px-2 py-1 rounded-md border text-sm">{composition.status.value}</span>
          <span className="flex-1 text-center">{formattedDate}</span>
        </div>
      </Link>
      
      <button onClick={() => setIsAlertOpen(true)} className="absolute top-0 right-0 h-full px-2 flex items-center cursor-pointer">
        <Trash2 className="text-red-600 transition-transform duration-200 hover:scale-110" size={20} />
      </button>

      {isAlertOpen && (
        <AlertDialogCompostion
          isOpen={isAlertOpen}
          onClose={() => setIsAlertOpen(false)}
          projectId={projectId}
          composition={composition}
          onCompositionDeleted={onCompositionDeleted}
        />
      )}
    </div>
  );
}