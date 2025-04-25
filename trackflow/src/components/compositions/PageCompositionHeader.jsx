import {
  CircleDot,
  Terminal,
  Plus,
  SquarePen,
  SquareChevronDown,
  Undo2,
} from "lucide-react";
import { toast } from "sonner";
import DataBadge from "../shared/DataBadge";
import Link from "next/link";
import { useEffect, useState } from "react";
import { DropdownMenuCompositionStatus } from "./DropdownMenuCompositionStatus";
import { updateCompositionById } from "@/lib/api/compositions";
export function PageCompositionHeader({
  composition,
  projectTitle,
  onCompositionChange,
  projectId,
  onUpdate,
}) {
  console.log("Titre du projet :", projectTitle);

  const subGenreText =
    composition.subGenders !== undefined && composition.subGenders !== null
      ? String(composition.subGenders).toLocaleUpperCase()
      : "N/A";
  const projectTitleUpperCase = projectTitle?.toLocaleUpperCase() || "N/A";

  const [isDropdownHovering, setIsDropdownHovering] = useState(null);
  const [isStatusCheckHovering, setIsStatusCheckHovering] = useState(false);
  const [isReturnHovering, setIsReturnHovering] = useState(false);
  const subGenreStyle = getSubGenreStyle(subGenreText);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedValue, setSelectedValue] = useState(
    composition.compositionStatus || ""
  );

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  function handleReturnAction() {
    setShowDropdown(false);
    setSelectedValue(composition.compositionStatus);
    setIsDropdownHovering(false);
  }

  async function handleCheckAction() {
    const compositionId = composition.id;

    if (selectedValue === composition.compositionStatus) {
      return;
    } else {
      setIsLoading(true);

      try {
        const updatedComposition = await updateCompositionById(
          projectId,
          compositionId,
          { compositionStatus: selectedValue }
        );
        onCompositionChange(updatedComposition);
        setShowDropdown(false);
        setIsLoading(false);
        onUpdate();
      } catch (error) {
        setError(true);
        console.log("Error with updating compositon. Error Status : ", error);
        setIsLoading(false);
      }
    }
  }

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex flex-col items-start gap-1">
        <div className="flex justify-start items-center gap-3">
          <span className="text-3xl glow-text">{composition.title}</span>
          <Terminal color="#e0e0e0" />

          {!showDropdown ? (
            <div className="flex justify-start items-center gap-2s">
              <DataBadge
                type="compositionStatus"
                value={composition.compositionStatus}
              >
                <span className="border text-xl border-gray-300">
                  {composition.compositionStatus}
                </span>
              </DataBadge>
              <SquarePen
                onMouseEnter={() => setIsDropdownHovering(true)}
                onMouseLeave={() => setIsDropdownHovering(false)}
                className=" cursor-pointer"
                size={20}
                color={isDropdownHovering ? "#a39e9e" : "#e0e0e0"}
                onClick={() => setShowDropdown(!showDropdown)}
              />
            </div>
          ) : (
            <div className="flex items-center justify-start gap-4">
              <DropdownMenuCompositionStatus
                selectedValue={selectedValue}
                onSelectedValueChange={(value) => {
                  setSelectedValue(value);
                }}
                initialStatus={composition.compositionStatus}
              />
              <button
                onMouseEnter={() => setIsStatusCheckHovering(true)}
                onMouseLeave={() => setIsStatusCheckHovering(false)}
                className="cursor-pointer"
                onClick={() => handleCheckAction()}
              >
                <SquareChevronDown
                  className="transition-all ease-linear "
                  size={isStatusCheckHovering ? "35" : "30"}
                  color="#2bff00"
                />
              </button>
              <button
                onMouseEnter={() => setIsReturnHovering(true)}
                onMouseLeave={() => setIsReturnHovering(false)}
                className="cursor-pointer"
                onClick={() => handleReturnAction()}
              >
                <Undo2
                  className="transition-all ease-linear "
                  size={isReturnHovering ? "35" : "30"}
                  color="#e0e0e0"
                />
              </button>
            </div>
          )}
        </div>
        <div className="flex justify-start items-center py-2 gap-2">
          <Link
            className="cursor-pointer hover:bg-neutral-800 rounded pr-2"
            href={`/projects/${projectId}`}
          >
            PROJECT : {projectTitleUpperCase}
          </Link>
          <CircleDot color="#e0e0e0" strokeWidth={0.5} />
          <span>
            {composition.totalBranches}{" "}
            {composition.totalBranches > 1 ? "BRANCHES" : "BRANCHE"}{" "}
          </span>
          <CircleDot color="#e0e0e0" strokeWidth={0.5} />
          <span>
            {composition.totalVersions}{" "}
            {composition.totalVersions > 1 ? "VERSIONS" : "VERSION"}
          </span>
        </div>

        <div className="flex items-center justify-start gap-1 ">
          {composition.subGenders?.map((genre, index) =>
            genre ? (
              <span
                key={index}
                className={`flex-1 text-center px-2  rounded-md border ${subGenreStyle} text-sm`}
              >
                {subGenreText}
              </span>
            ) : (
              " "
            )
          )}

          {composition.projectMusicalGenderPreDefinedList?.map((genre, index) =>
            genre ? (
              <DataBadge
                key={`${genre}-${index}`}
                type="projectMusicalGender"
                value={genre}
                label={genre}
                variant="badge"
                styleIndex={index}
                className="text-sm"
              />
            ) : (
              " "
            )
          )}
        </div>
      </div>

      <div className="p-4 flex text-gray-300 gap-2 border bg-neutral-800 border-gray-300 cursor-pointer hover:bg-gray-500 focus:outline-offset-2 focus:outline-bg-gray-500 active:bg-gray-700">
        <Plus color="#e0e0e0" />
        <div> NEW_VERSION</div>
      </div>
    </div>
  );
}

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
