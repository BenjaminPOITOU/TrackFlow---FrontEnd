import { format, isValid, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { FileMusic } from "lucide-react";
import Link from "next/link";


 

export function CompositionCard({ composition, background }) {



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

  if ({ totalBranches } > 1) {
    branche = "BRANCHES";
  }
  if ({ totalVersions } > 1) {
    version = "VERSIONS";
  }

  const getSubGenreStyle = (subGenre) => {
    if (!subGenre) return "bg-gray-800 text-gray-400 border-gray-700";
    
    // Conversion en chaîne de caractères et gestion sécurisée
    const subGenreString = String(subGenre);
    
    // Calculer un hash simple à partir de la chaîne
    let hash = 0;
    for (let i = 0; i < subGenreString.length; i++) {
      hash += subGenreString.charCodeAt(i);
    }
    
    const styles = [
      "bg-purple-900 text-pink-300 border-pink-500",
      "bg-blue-900 text-cyan-300 border-cyan-500",
      "bg-indigo-900 text-indigo-300 border-indigo-500",
      "bg-pink-900 text-purple-300 border-purple-500",
      "bg-cyan-900 text-blue-300 border-blue-500"
    ];
    
    return styles[hash % styles.length];
  };
  
  // Assurer que subGenreText est une chaîne de caractères
  const subGenreText = composition.subGenders !== undefined && composition.subGenders !== null 
    ? String(composition.subGenders).toLocaleUpperCase() 
    : "N/A";
  
  const subGenreStyle = getSubGenreStyle(subGenreText);
  return (
    <Link href={compositionUrl} className="w-full py-2 cursor-pointer">
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
          <span className={`flex-1 text-center px-2 py-1 rounded-md border ${subGenreStyle} font-medium text-sm shadow-lg`}>
            {subGenreText}
          </span>
          <span className="flex-1 text-center">{`${formattedDate}`}</span>
         
        </div>
             
      </div>
  
    </Link>
  );
}
