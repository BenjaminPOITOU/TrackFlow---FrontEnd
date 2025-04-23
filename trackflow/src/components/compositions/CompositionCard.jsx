import { format, isValid, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { FileMusic } from "lucide-react";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { AlertDialogCompostion } from "./AlertDialogComposition";

export function CompositionCard({
  composition,
  background,
  projectId,
  onDeleteResponseChange
}) {
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  


  const compositionUrl = `/compositions/${composition?.id}`;
  let branche = "BRANCHE";
  let version = "VERSION";
  const totalBranches =
    composition?.totalBranches || "Composition sans Branche";
  const totalVersions =
    composition?.totalVersions || "Composition sans Version";
  const formattedDate = composition?.lastUpdateDate
    ? (() => {
        const dateObj = parseISO(composition.lastUpdateDate);

        return isValid(dateObj)
          ? format(dateObj, "dd/MM/yyyy", { locale: fr })
          : "N/A";
      })()
    : "N/A";
  const [isHovering, setIsHovering] = useState(false);

  if ({ totalBranches } > 1) {
    branche = "BRANCHES";
  }
  if ({ totalVersions } > 1) {
    version = "VERSIONS";
  }

  const getSubGenreStyle = (subGenre) => {
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
  };

  function handleMouseEnter() {
    setIsHovering(true);
  }

  function handleMouseLeave() {
    setIsHovering(false);
  }

  const subGenreText =
    composition.subGenders !== undefined && composition.subGenders !== null
      ? String(composition.subGenders).toLocaleUpperCase()
      : "N/A";

  const subGenreStyle = getSubGenreStyle(subGenreText);
  return (
    <div className="flex h-full relative border border-gray-700">
      <Link href={compositionUrl} className="w-full cursor-pointer">
        <div className={`flex w-full items-center py-2 px-2 ${background}`}>
          <div className="w-1/3 self-start">
            <span className="flex gap-2 items-center justify-start text-lg">
              <FileMusic className="w-4 h-4" color="#e0e0e0" />{" "}
              {composition.title || "Composition Sans Titre"}
            </span>
          </div>
          <div className="w-2/3 flex items-center">
            <span className="flex-1 text-center">{`${composition.totalVersions} ${version}`}</span>
            <span className="flex-1 text-center">{`${composition.totalBranches} ${branche}`}</span>
            <span
              className={`flex-1 text-center px-2 py-1 rounded-md border ${subGenreStyle} text-sm`}
            >
              {subGenreText}
            </span>
            <span className="flex-1 text-center">{`${formattedDate}`}</span>
          </div>
        </div>
      </Link>
      <button onClick={() => setIsAlertOpen(true)}>
        <Trash2
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={`absolute cursor-pointer ${
            isHovering
              ? "w-6 h-6 top-2 right-1 transition-all ease-linear"
              : "w-5 h-5 top-3 right-1 transition-all ease-linear"
          }`}
          color="#ff0505"
        />
      </button>

      {isAlertOpen && (
        <AlertDialogCompostion
          showDeleteConfirm={isAlertOpen}
          setShowDeleteConfirm={setIsAlertOpen}
          projectId={projectId}
          composition={composition}
          onDeleteResponseChange={onDeleteResponseChange}
        />
      )}
    </div>
  );
}
