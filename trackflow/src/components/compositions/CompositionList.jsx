import { getCompositionsByProjectId } from "@/lib/api/compositions";
import { useState, useEffect } from "react";
import { CompositionCard } from "./CompositionCard";
import { Trash2 } from "lucide-react";

export function CompositionList({ projectId }) {
  const [compositionList, setCompositionList] = useState([]);
  const [isLoadind, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [bgValue, setBgValue] = useState("zinc-800");

  console.log("Composition List content : ", compositionList);
  console.log("project Id : ", projectId);

  useEffect(() => {
    const fetchData = async () => {
      if (!projectId) {
        console.log("useEffect: No projectId, clearing list.");
        setCompositionList([]);
        return;
      }

      console.log(`useEffect: Starting fetch for projectId: ${projectId}`);

      setIsLoading(true);
      setError(null);

      try {
        const fetchedCompositions = await getCompositionsByProjectId(projectId);
        console.log("useEffect: Fetched data:", fetchedCompositions);
        setCompositionList(fetchedCompositions || []);
      } catch (err) {
        console.error("useEffect: Fetch error:", err);
        setError("Erreur lors de la récupération des compositions.");
        setCompositionList([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [projectId]);

  return (
    <div className="flex flex-col w-full gap-2 justify-start items-center">
      <span className=" w-full border-b border-b-gray-300 pb-1 text-xl uppercase tracking-wider text-gray-300">
        COMPOSITIONS
      </span>
      <div className="flex w-full border border-gray-300 px-2">
        <div className="flex-1 self-start">
          <span>TITLE</span>
        </div>
        <div className="flex-2 flex justify-between px-2">
          <span>VERSIONS</span>
          <span>BRANCHES</span>
          <span>SUB_GENRE</span>
          <span>LAST_UPDATE</span>
        </div>
      </div>

      <div className="w-full flex flex-col gap-1">
        {compositionList.length > 0
          ? compositionList.map((composition, index) => {
              const backgroundClass =
                index % 2 === 0 ? "bg-neutral-800" : "bg-zinc-900";

              return (
                <CompositionCard
                  key={composition.id || index}
                  composition={composition}
                  background={backgroundClass}
                />
              );
            })
          : !isLoadind && (
              <p className="text-sm text-gray-500">
                Aucune composition trouvée.
              </p>
            )}
      </div>
    </div>
  );
}
