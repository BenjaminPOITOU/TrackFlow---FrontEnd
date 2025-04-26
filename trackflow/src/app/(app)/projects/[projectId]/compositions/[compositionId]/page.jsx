"use client";
import {
  getCompositionById,
  getVersionsByCompositionId,
} from "@/lib/api/compositions";
import { use, useEffect, useState } from "react";
import { PageCompositionHeader } from "@/components/compositions/PageCompositionHeader";
import { Loader2 } from "lucide-react";
import { VersionBlockDetails } from "@/components/versions/VersionBlockDetails";
import { AudioPlayerContent } from "@/components/audioPlayer/AudioPlayerContent";

export default function compositionPage({ params }) {
  const compositionId = use(params)?.compositionId;
  const projectId = use(params)?.projectId;
  const indexVersionList = 0;

  const [composition, setComposition] = useState(null);
  const [isLoadingComposition, setIsLoadingComposition] = useState(false);
  const [error, setError] = useState(null);

  const [versionList, setVersionList] = useState(null);
  const [isLoadingVersionsList, setIsLoadingVersionList] = useState(false);

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
        console.log("Project Id or Composition Id not found...");
      }
    };

    fetchComposition();
  }, [projectId, compositionId, refreshTrigger]);

  useEffect(() => {
    const fetchVersions = async () => {
      setVersionList(null);

      setIsLoadingComposition(true);

      if (compositionId) {
        try {
          const fetchData = await getVersionsByCompositionId(compositionId);
          setVersionList(fetchData);
          setError(null);
        } catch (error) {
          setError(error);
          console.log("Error Stauts : ", error);
          setIsLoadingVersionList(false);
          setVersionList(null);
        }
      } else {
        console.log("Composition Id not found...");
      }
    };

    fetchVersions();
  }, [projectId, compositionId]);

  return (
    <div className={`m-1 p-5 w-full h-screen overflow-y-auto flex flex-col`}>
      {composition && (
        <div className="flex flex-col gap-4">
          <PageCompositionHeader
            composition={composition}
            projectTitle={composition.projectTitle}
            onCompositionChange={setComposition}
            projectId={projectId}
            onUpdate={handleCompositionUpdate}
          />

          <div className="w-75 border border-gray-300"></div>
          {versionList && (
            <VersionBlockDetails
              versionId={versionList[indexVersionList]?.versionId}
            />
          )}
          <AudioPlayerContent />
        </div>
      )}

      {isLoadingComposition && (
        <div className="flex justify-center items-center flex-grow">
          <Loader2 className="h-8 w-8 animate-spin mr-3" />
          <span>Loading composition details...</span>
        </div>
      )}

      {isLoadingVersionsList && (
        <div className="flex justify-center items-center flex-grow">
          <Loader2 className="h-8 w-8 animate-spin mr-3" />
          <span>Loading versions list...</span>
        </div>
      )}
    </div>
  );
}
