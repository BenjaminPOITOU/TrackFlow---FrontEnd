"use client";
import { getCompositionById } from "@/lib/api/compositions";
import { use, useEffect, useState } from "react";
import { PageCompositionHeader } from "@/components/compositions/PageCompositionHeader";
import { Loader2 } from "lucide-react";

export default function compositionPage({ params }) {
  const compositionId = use(params)?.compositionId;
  const projectId = use(params)?.projectId;

  const [composition, setComposition] = useState(null);
  const [isLoadingComposition, setIsLoadingComposition] = useState(false);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  function handleCompositionUpdate() {
    setRefreshTrigger((prevTrigger) => prevTrigger + 1);
  }

  useEffect(() => {
    const fetchComposition = async () => {
      setComposition(null);

      if (projectId && compositionId) {
        try {
          setIsLoadingComposition(true);
          const fetchData = await getCompositionById(projectId, compositionId);
          setComposition(fetchData);
          setError(null);
        } catch (error) {
          setError(error);
          console.log("Error Stauts : ", error);
          setIsLoadingComposition(false);
          setComposition(null);
        } finally {
          setIsLoadingComposition(false);
        }
      } else {
        console.log("Project ID OR Composition Id not found...");
      }
    };

    fetchComposition();
  }, [projectId, compositionId, refreshTrigger]);

  return (
    <div className={`m-1 p-5 w-full h-screen overflow-y-auto flex flex-col`}>
      {composition && (
        <PageCompositionHeader
          composition={composition}
          projectTitle = {composition.projectTitle}
          onCompositionChange={setComposition}
          projectId={projectId}
          onUpdate={handleCompositionUpdate}
        />
      )}

      {isLoadingComposition && (
        <div className="flex justify-center items-center flex-grow">
          <Loader2 className="h-8 w-8 animate-spin mr-3" />
          <span>Loading composition details...</span>
        </div>
      )}
    </div>
  );
}

function handleOpenNewCompositionModal() {
  return null;
}
