/**
 * @file hooks/useAnnotationForm.js (or .ts)
 * @description A custom React hook to manage the state and logic for an annotation creation form.
 * It handles form data, submission state, and two distinct modes of operation:
 * - Sync Mode: The annotation is time-stamped based on the current media playback time.
 * - Manual Mode: The user can input the timestamp and content freely.
 */


import { useState } from "react";
import { createAnnotation } from "@/lib/api/annotations";

/**
 * Manages the entire lifecycle of an annotation form, from user input to API submission.
 *
 * @param {object} config - The configuration object for the hook.
 * @param {string|number} config.versionId - The unique identifier of the track version to which the annotation will be attached.
 * @param {number} config.currentTime - The current playback time (in seconds) from the media player, used for timestamping in sync mode.
 * @param {function(object): void} config.onAnnotationCreated - A callback function that is executed after an annotation is successfully created. It receives the new annotation object as its argument.
 * @returns {{
 *   isSyncMode: boolean,
 *   isTextareaActive: boolean,
 *   isSubmitting: boolean,
 *   formData: object,
 *   actions: {
 *     toggleSyncMode: () => void,
 *     startAnnotation: () => void,
 *     cancel: () => void,
 *     submit: (e: React.FormEvent) => Promise<void>,
 *     updateField: (field: string, value: any) => void
 *   }
 * }} An object containing the form's state and action handlers.
 */
export function useAnnotationForm({
  versionId,
  currentTime,
  onAnnotationCreated,
}) {
  const [isSyncMode, setIsSyncMode] = useState(true);
  const [isTextareaActive, setIsTextareaActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    content: "",
    timePosition: "",
    category: "Mixage",
    status: "À traiter",
  });

  const toggleSyncMode = () => {
    const newModeIsSync = !isSyncMode;
    setIsSyncMode(newModeIsSync);
    setIsTextareaActive(!newModeIsSync);
    setFormData({
      content: "",
      timePosition: "",
      category: "Mixage",
      status: "À traiter",
    });
  };

  const handleStartAnnotationInSync = () => {
    setIsTextareaActive(true);
    setFormData((prev) => ({ ...prev, timePosition: currentTime }));
  };

  const handleCancel = () => {
    setIsTextareaActive(!isSyncMode);
    setFormData((prev) => ({
      ...prev,
      content: "",
      timePosition: isSyncMode ? "" : prev.timePosition,
    }));
  };

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.content.trim() === "") return;

    setIsSubmitting(true);
    try {
      const newAnnotation = await createAnnotation({
        versionId: versionId,
        annotationData: formData,
      });
      if (newAnnotation) {
        onAnnotationCreated(newAnnotation);
      }
      handleCancel();
    } catch (err) {
      console.error("Erreur pendant l'envoi de l'annotation :", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSyncMode,
    isTextareaActive,
    isSubmitting,
    formData,
    actions: {
      toggleSyncMode,
      startAnnotation: handleStartAnnotationInSync,
      cancel: handleCancel,
      submit: handleSubmit,
      updateField: handleFormChange,
    },
  };
}
