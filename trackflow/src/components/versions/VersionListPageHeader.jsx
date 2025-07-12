"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CircleDot,
  Terminal,
  Plus,
  SquarePen,
  SquareChevronDown,
  Undo2,
} from "lucide-react";

import { updateCompositionById } from "@/lib/api/compositions";
import DataBadge from "../shared/DataBadge";
import { DropdownMenuCompositionStatus } from "../compositions/DropdownMenuCompositionStatus";
import { CreateVersionModal } from "../modals/versionCreateModal/CreateVersionModal";
import { ArrowLeft } from "lucide-react";

/**
 * Generates a consistent style for a sub-genre tag based on its string content.
 * @param {string | undefined} subGenre - The sub-genre string.
 * @returns {string} A Tailwind CSS class string for styling.
 */
function getSubGenreStyle(subGenre) {
  if (!subGenre) return "bg-gray-800 text-gray-400 border-gray-700";
  const subGenreString = String(subGenre);
  let hash = 0;
  for (let i = 0; i < subGenreString.length; i++) {
    hash += subGenreString.charCodeAt(i);
  }
  const styles = [
    "bg-purple-900 text-pink-300 border-pink-500",
    "bg-blue-900 text-cyan-300 border-cyan-500",
    "bg-indigo-900 text-indigo-300 border-indigo-500",
    "bg-pink-900 text-purple-300 border-purple-500",
    "bg-cyan-900 text-blue-300 border-blue-500",
  ];
  return styles[hash % styles.length];
}

/**
 * A client component that serves as the header for the version list page.
 * It displays composition details, such as title, status, and total branch/version counts.
 * It also provides the trigger to open the "Create Version" modal, to which it passes
 * the list of available branches.
 * @param {object} props
 * @param {object} props.composition - The composition data object, expected to contain `totalBranches` and `totalVersions`.
 * @param {string} props.projectId - The ID of the parent project.
 * @param {Array<object>} props.branchList - The list of branches associated with the composition.
 */
export function VersionListPageHeader({ composition, projectId, branchList }) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedValue, setSelectedValue] = useState(
    composition.compositionStatus || ""
  );

  const handleUpdateStatus = useCallback(
    async (event) => {
      event.preventDefault();
      if (isUpdating || selectedValue === composition.compositionStatus) return;

      setIsUpdating(true);
      try {
        await updateCompositionById(projectId, composition.id, {
          compositionStatus: selectedValue,
        });
        setShowDropdown(false);
        router.refresh();
      } catch (error) {
        console.error("Error updating status:", error);
      } finally {
        setIsUpdating(false);
      }
    },
    [isUpdating, selectedValue, composition, projectId, router]
  );

  const handleCancelEdit = useCallback(() => {
    setShowDropdown(false);
    setSelectedValue(composition.compositionStatus);
  }, [composition.compositionStatus]);

  const subGenreText = composition?.subGenders.map((g) =>
    g.toLocaleUpperCase()
  );
  const projectTitleUpperCase =
    composition?.projectTitle?.toLocaleUpperCase() || "N/A";

  const isSubmitDisabled =
    isUpdating || selectedValue === composition.compositionStatus;

  return (
    <div className="flex flex-col lg:flex-row w-full items-start lg:items-center justify-between gap-4">
      <div className="flex flex-col items-start gap-2 w-full">
        <Link
          href={`/projects/${projectId}`}
          className="p-2 rounded-full hover:bg-zinc-700"
          title="Back to projects list"
        >
          <ArrowLeft size={24} className="text-gray-300" />
        </Link>
        <div className="flex flex-col sm:flex-row sm:min-h-[40px] items-start sm:items-center justify-start gap-3 w-full">
          <span className="text-3xl lg:text-4xl glow-text whitespace-nowrap">
            {composition.title}
          </span>
          <Terminal
            color="#e0e0e0"
            className="hidden sm:block self-end"
            size={60}
          />
          {!showDropdown ? (
            <div className="flex items-center justify-start w-[75%] sm:w-full gap-2">
              <DataBadge
                type="compositionStatus"
                value={composition.compositionStatus}
              >
                <span className="border text-base md:text-xl border-gray-300">
                  {composition.compositionStatus}
                </span>
              </DataBadge>
              <SquarePen
                onClick={() => setShowDropdown(true)}
                className="cursor-pointer transition-colors hover:text-gray-400"
                size={20}
                color="#e0e0e0"
              />
            </div>
          ) : (
            <form
              onSubmit={handleUpdateStatus}
              className="flex items-center justify-start gap-2 w-[80%] sm:w-full sm:gap-4"
            >
              <DropdownMenuCompositionStatus
                selectedValue={selectedValue}
                onSelectedValueChange={setSelectedValue}
                initialStatus={composition.compositionStatus}
                disabled={isUpdating}
              />
              <button
                type="submit"
                disabled={isSubmitDisabled}
                className="transition-opacity disabled:opacity-50"
              >
                <SquareChevronDown
                  size={30}
                  color={isSubmitDisabled ? "#ccc" : "#2bff00"}
                />
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={isUpdating}
                className="transition-opacity disabled:opacity-50"
              >
                <Undo2 size={30} color="#e0e0e0" />
              </button>
              {isUpdating && (
                <span className="text-sm text-gray-400">Updating...</span>
              )}
            </form>
          )}
        </div>
        <div className="hidden md:flex flex-wrap items-center justify-start gap-x-2 gap-y-1 text-sm text-gray-400 py-2">
          <CircleDot color="#e0e0e0" strokeWidth={0.5} />
          <span>
            {composition.totalBranches}{" "}
            {composition.totalBranches > 1 ? "BRANCHES" : "BRANCH"}
          </span>
          <CircleDot color="#e0e0e0" strokeWidth={0.5} />
          <span>
            {composition.totalVersions}{" "}
            {composition.totalVersions > 1 ? "VERSIONS" : "VERSION"}
          </span>
        </div>
        <div className="hidden md:flex w-full items-center gap-1 overflow-x-auto whitespace-nowrap pb-2 md:flex-wrap md:whitespace-normal md:pb-0">
          {subGenreText?.map((genre, index) => (
            <DataBadge
              key={`subgenre-${index}`}
              type="projectMusicalGender"
              value={genre}
              variant="badge"
              className="text-sm"
            />
          ))}
          {composition.projectMusicalGenderPreDefinedList?.map(
            (genre, index) => (
              <DataBadge
                key={`predefined-${index}`}
                type="projectMusicalGender"
                value={genre}
                variant="badge"
                className="text-sm"
              />
            )
          )}
        </div>
      </div>
      <button
        onClick={() => setShowModal(true)}
        className="hidden sm:flex items-center gap-2 cursor-pointer rounded-md border border-gray-300 bg-neutral-800 px-4 py-2 text-gray-300 transition-colors hover:bg-neutral-700"
      >
        <Plus color="#e0e0e0" />
        <div className="hidden md:block">NEW_VERSION</div>
      </button>

      <CreateVersionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        compositionId={composition?.id}
        projectId={projectId}
        branchList={branchList}
      />
    </div>
  );
}
