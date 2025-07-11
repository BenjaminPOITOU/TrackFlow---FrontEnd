"use client";

import { useState } from "react";
import { format, isValid, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { FileMusic, Trash2, SquarePen, Check, X } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import DataBadge from "../shared/DataBadge";
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
export function CompositionCard({
  composition,
  background,
  projectId,
  onCompositionDeleted,
  onCompositionUpdated,
}) {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(composition.title);

  console.log("COMPOSITION STATUS  : ", composition?.status?.value)

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

        return isValid(dateObj)
          ? format(dateObj, "dd/MM/yyyy", { locale: fr })
          : "N/A";
      })()
    : "N/A";

  const handleSaveTitle = async () => {
    if (editedTitle === composition.title || !editedTitle.trim()) {
      setIsEditing(false);
      setEditedTitle(composition.title);
      return;
    }

    try {
      await updateCompositionById(projectId, composition.id, {
        title: editedTitle,
      });
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
    <tr
      className={`border-b border-gray-700 ${background} hover:bg-gray-800 transition-colors`}
    >
      <td className="p-3 w-full sm:w-auto">
        <div className="flex items-center gap-2">
          <FileMusic className="w-4 h-4 text-gray-300 flex-shrink-0" />
          {isEditing ? (
            <div className="flex items-center gap-2 w-full">
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveTitle();
                  if (e.key === "Escape") handleCancelEdit();
                }}
                className="bg-zinc-700 border border-cyan-500 rounded-md p-1 text-white w-full text-[0.875rem]"
                autoFocus
              />
              <button
                onClick={handleSaveTitle}
                className="p-1 text-green-400 hover:text-green-300"
                title="Save"
              >
                <Check size={16} />
              </button>
              <button
                onClick={handleCancelEdit}
                className="p-1 text-red-400 hover:text-red-300"
                title="Cancel"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 w-full">
              <Link
                href={compositionUrl}
                className="text-[0.875rem] hover:underline text-white flex-1"
              >
                {composition.title || "Composition Sans Titre"}
              </Link>
              <button
                onClick={() => setIsEditing(true)}
                className="p-1 text-gray-400 hover:text-white"
                title="Edit Title"
              >
                <SquarePen size={16} />
              </button>

              <div className="sm:hidden flex items-center gap-2 ml-auto">
                <DataBadge
                  type="compositionStatus"
                  value={composition?.status?.value}
                  className="text-[0.75rem] px-2 py-1"
                />
                <button
                  onClick={() => setIsAlertOpen(true)}
                  className="p-1 text-red-600 hover:text-red-400"
                  title="Supprimer"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </td>

      <td className="hidden sm:table-cell p-3 text-center">
        <Link href={compositionUrl} className="text-[0.875rem] hover:underline">
          {`${totalVersions} ${versionLabel}`}
        </Link>
      </td>

      <td className="hidden sm:table-cell p-3 text-center">
        <Link href={compositionUrl} className="text-[0.875rem] hover:underline">
          {`${totalBranches} ${brancheLabel}`}
        </Link>
      </td>

      <td className="hidden sm:table-cell p-3 text-center">
        <Link href={compositionUrl} className="inline-block">
          <DataBadge
                  type="compositionStatus"
                  value={composition?.status?.value}
                  className="text-[0.75rem] px-2 py-1"
                />
        </Link>
      </td>

      <td className="hidden sm:table-cell p-3 text-center">
        <Link href={compositionUrl} className="text-[0.875rem] hover:underline">
          {formattedDate}
        </Link>
      </td>

      <td className="hidden sm:table-cell p-3 text-center">
        <button
          onClick={() => setIsAlertOpen(true)}
          className="p-1 text-red-600 hover:text-red-400 transition-colors"
          title="Supprimer"
        >
          <Trash2 size={16} />
        </button>
      </td>
      
      {isAlertOpen && (
        <AlertDialogCompostion
          isOpen={isAlertOpen}
          onClose={() => setIsAlertOpen(false)}
          projectId={projectId}
          composition={composition}
          onCompositionDeleted={onCompositionDeleted}
        />
      )}
    </tr>
  );
}
