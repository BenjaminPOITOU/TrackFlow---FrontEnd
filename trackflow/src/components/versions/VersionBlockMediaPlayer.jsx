import { AudioPlayerContent } from "@/components/audioPlayer/AudioPlayerContent";
import { AddAnnotationBlock } from "../annotations/AddAnnotationBlock";
import { AnnotationList } from "../annotations/AnnotationList";
import { useEffect, useState } from "react";

import { createAnnotationByVersionId } from "@/lib/api/annotations";

export function VersionBlockMediaPlayer({
  versionId,
  versionName,
  branchName,
  versionAudioUrl,
}) {
  const [annotationToAdd, setAnnotationToAdd] = useState([]);
  const [annotationCreatedResponse, setAnnotationCreatedResponse] = useState(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const versionNameSplitted = versionName?.split("V")[1];
  const branchNameUpperCase = branchName?.toLocaleUpperCase();


   async function handleAnnotationSubmit(annotationData) {
    if (!versionId || !annotationData || !annotationData.content) {
      console.error("Données d'annotation ou ID de version manquants.");
      setError("Impossible d'enregistrer : données manquantes."); // Informer l'utilisateur
      return false; // Indiquer que la soumission a échoué
    }

    setIsSubmitting(true);
    setError(null);
    setAnnotationCreatedResponse([]); // Réinitialiser la réponse précédente

    try {
      const sendAnnotationResponse = await createAnnotationByVersionId(
        versionId,
        annotationData
      );
      setAnnotationCreatedResponse(sendAnnotationResponse);
      console.log("Annotation créée : ", sendAnnotationResponse);
      // Ici, vous pourriez vouloir déclencher un rafraîchissement de AnnotationList
      // par exemple, en passant une fonction de rafraîchissement ou en utilisant un état global/contexte.
      return true; 
    } catch (error) {
      setError(error);
      console.error(
        "Erreur lors de l'appel API de création d'annotation : ",
        error
      );
      return false; 
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col w-full border border-gray-300 bg-neutral-800 p-4 justify-center items-start rounded gap-4">
      <div className="flex flex-col justify-center items-start">
        <span className="text-xl">VERSION : {versionNameSplitted}</span>
        <span className="text-sm"> Branche : {branchNameUpperCase}</span>
      </div>

      <AudioPlayerContent versionAudioUrl={versionAudioUrl} />

      <div className="w-full border border-gray-300"></div>

      <div className="flex gap-2 justify-between w-full">
        <AddAnnotationBlock
          onAnnotationSubmit={handleAnnotationSubmit}
          isSubmitting={isSubmitting}
        />
        <AnnotationList />
      </div>
    </div>
  );
}
