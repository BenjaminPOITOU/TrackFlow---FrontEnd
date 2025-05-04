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
  const [annotationData, setAnnotationData] = useState([]);
  const [annotationCreatedResponse, setAnnotationCreatedResponse] = useState(
    []
  );
  const [currentTime, setCurrentTime] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const versionNameSplitted = versionName?.split("V")[1];
  const branchNameUpperCase = branchName?.toLocaleUpperCase();


   async function handleAnnotationSubmit(annotationData) {
    if (!versionId || !annotationData) {

      console.log("annotationData : ", annotationData);
      
      console.error("Données d'annotation ou ID de version manquants.");
      setError("Impossible d'enregistrer : données manquantes."); 
      return false; 
    }

     if (!annotationData.content) {
      console.error("Contenu d'annotation manquant.");
      setError("Impossible d'enregistrer : veuillez ajouter un contenu à votre annotation.");
      return false;
    }

    setIsSubmitting(true);
    setError(null);
    setAnnotationCreatedResponse([]);

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

      <AudioPlayerContent currentTime={currentTime} onCurrentTime ={setCurrentTime} versionAudioUrl={versionAudioUrl} />

      <div className="w-full border border-gray-300"></div>

      <div className="flex gap-2 justify-between w-full">
        <AddAnnotationBlock
          onAnnotationSubmit={handleAnnotationSubmit}
          isSubmitting={isSubmitting}
          currentTime={currentTime}
        />
        <AnnotationList />
      </div>
    </div>
  );
}
