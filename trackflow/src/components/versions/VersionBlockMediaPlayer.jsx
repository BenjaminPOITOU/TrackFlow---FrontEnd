/**
 * @file A component that combines an audio player with annotation management.
 */
"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { 
  getAnnotationsByVersionId,
  createAnnotation,
  updateAnnotation,
  deleteAnnotation 
} from '@/lib/api/annotations';
import { AddAnnotationBlock } from "../annotations/AddAnnotationBlock";
import { AnnotationList } from "../annotations/AnnotationList";
import AudioPlayer from "../audioPlayer/AudioPlayer";

/**
 * A self-contained component that displays an audio player for a specific version
 * and handles the entire lifecycle of its associated annotations. It fetches,
 * creates, updates, and deletes annotations independently while preserving its
 * sophisticated internal UI logic for form display and player time synchronization.
 * It will only display the annotation section once a valid versionId is provided.
 *
 * @param {object} props
 * @param {string} props.versionId - The ID of the currently loaded version. Can be undefined during initial load.
 * @param {string} props.versionName - The name of the version.
 * @param {string} props.branchName - The name of the version's parent branch.
 * @param {string} props.versionAudioUrl - The URL of the audio file for the player.
 */
export function VersionBlockMediaPlayer({
  versionId,
  versionName,
  branchName,
  versionAudioUrl,
}) {
  const [annotations, setAnnotations] = useState([]);
  const [isLoadingAnnotations, setIsLoadingAnnotations] = useState(false);
  const [error, setError] = useState(null);

  const [currentTime, setCurrentTime] = useState(0);
  const [isAnnotationFormOpen, setIsAnnotationFormOpen] = useState(false);

  useEffect(() => {
    if (!versionId) {
      setIsLoadingAnnotations(false);
      setAnnotations([]);
      return;
    }

    const fetchAnnotations = async () => {
      setIsLoadingAnnotations(true);
      setError(null);
      try {
        const data = await getAnnotationsByVersionId({ versionId });
        setAnnotations(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoadingAnnotations(false);
      }
    };

    fetchAnnotations();
  }, [versionId]);

  const handleAnnotationAdded = useCallback((annotations) => {
    setAnnotations(prev => [annotations, ...prev].sort((a, b) => b.createdDate - a.createdDate));
    setIsAnnotationFormOpen(false);
  }, [annotations]);

  const handleAnnotationUpdate = useCallback(async (annotationId, updateData) => {
    try {
      const updated = await updateAnnotation({ annotationId, updateData });
      setAnnotations(prev => prev.map(anno => (anno.id === annotationId ? updated : anno)));
    } catch (err) {
      console.error(`Failed to update annotation ${annotationId} in component:`, err);
      setError("Could not update the annotation.");
    }
  }, []);

  const handleAnnotationDelete = useCallback(async (annotationId) => {
    try {
      await deleteAnnotation({ annotationId });
      setAnnotations(prev => prev.filter(anno => anno.id !== annotationId));
    } catch (err) {
      console.error(`Failed to delete annotation ${annotationId} in component:`, err);
      setError("Could not delete the annotation.");
    }
  }, []);

  return (
  
    <div className="flex flex-col w-full border border-gray-300 bg-neutral-800 px-2 md:px-4 py-4 min-h-0 gap-6 justify-between rounded-lg">
      <div className="w-full">
        <AudioPlayer
          versionAudioUrl={versionAudioUrl}
          versionName={versionName}
          branchName={branchName}
          onTimeUpdate={setCurrentTime}
        />
      </div>

      <div className="border-t border-neutral-700 pt-4">
        {!versionId ? (
          <div className="flex items-center justify-center p-6 text-gray-500 text-center">
            <p>Aucun détail de la version disponible</p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6 w-full">
            <div className="w-full lg:w-1/3 flex flex-col gap-2">
              <button
                onClick={() => setIsAnnotationFormOpen(!isAnnotationFormOpen)}
                className="flex w-full items-center justify-between rounded-md bg-zinc-700 p-3 text-gray-300 transition-colors hover:bg-zinc-600 md:hidden"
              >
                <span>Ajouter une Annotation</span>
                {isAnnotationFormOpen ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </button>

              <div
                className={`${isAnnotationFormOpen ? "block" : "hidden"} md:block`}
              >
                <AddAnnotationBlock
                  currentTime={currentTime}
                  versionId={versionId}
                  onAnnotationCreated={handleAnnotationAdded}
                  onCancel={() => setIsAnnotationFormOpen(false)}
                />
              </div>
            </div>

            <div className="w-full lg:w-2/3">
              {isLoadingAnnotations ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="animate-spin text-gray-400" />
                  <span className="ml-2 text-gray-400">Chargement des annotations...</span>
                </div>
              ) : (
                <AnnotationList
                  annotationList={annotations}
                  onAnnotationUpdate={handleAnnotationUpdate}
                  onAnnotationDelete={handleAnnotationDelete}
                />
              )}
              {error && <p className="text-red-500 mt-2">{error}</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}