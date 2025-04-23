import { getCompositionsByProjectId } from "@/lib/api/compositions";
import { useState, useEffect } from "react";
import { CompositionCard } from "./CompositionCard";
import { Funnel, ArrowDownNarrowWide } from "lucide-react";

export function CompositionList({ projectId }) {
  const [compositionList, setCompositionList] = useState([]);
  const [deleteResponse, setDeleteResponse] = useState(null);
  const [isLoadind, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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
  }, [projectId, deleteResponse]);

  return (
    <div className="flex flex-col w-full gap-2 justify-start items-center">
      <div className="w-full flex border-b border-b-gray-300 pb-1 items-center justify-between uppercase">
        <span className="text-xl  tracking-wider text-gray-300">
          COMPOSITIONS
        </span>
        <div className="flex justify-center items-center gap-2">
          <button className="border rounded flex justify-center items-center w-full gap-4 p-2 border-gray-300 hover:bg-zinc-500 cursor-pointer">
            <span className="text-md"> Filter </span> <Funnel color="#e0e0e0" />
          </button>
          <button className="border rounded flex justify-center items-center w-full gap-4 p-2 border-gray-300 hover:bg-zinc-500 cursor-pointer">
            <span className="text-md"> Sort </span>
            <ArrowDownNarrowWide color="#e0e0e0" />
          </button>
        </div>
      </div>

      <div className="flex w-full border border-gray-300 px-2">
        <div className="w-1/3 self-start">
          <span className="text-xs">TITLE</span>
        </div>
        <div className="w-2/3 flex items-center">
          <span className="flex-1 text-xs text-center">VERSIONS</span>
          <span className="flex-1 text-xs text-center">BRANCHES</span>
          <span className="flex-1 text-xs text-center">SUB_GENRE</span>
          <span className="flex-1 text-xs text-center">LAST_UPDATE</span>
        </div>
      </div>

      <div className="w-full flex flex-col gap-1">
        {compositionList.length > 0
          ? compositionList.map((composition, index) => {
              const backgroundClass =
                index % 2 === 0
                  ? "bg-neutral-800 hover:bg-neutral-700"
                  : "bg-zinc-900 hover:bg-zinc-700";

              return (
                <CompositionCard
                  key={composition.id || index}
                  composition={composition}
                  background={backgroundClass}
                  projectId={projectId}
                  onDeleteResponseChange={setDeleteResponse}
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
