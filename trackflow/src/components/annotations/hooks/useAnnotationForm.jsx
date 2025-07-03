

import { useState } from "react";
import { createAnnotation } from "@/lib/api/annotations";

export function useAnnotationForm({ versionId, currentTime, onAnnotationCreated }) {

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
    setFormData({ content: "", timePosition: "", category: "Mixage", status: "À traiter" });
  };

  const handleStartAnnotationInSync = () => {
    setIsTextareaActive(true);
    setFormData((prev) => ({ ...prev, timePosition: currentTime }));
  };

  const handleCancel = () => {
    setIsTextareaActive(!isSyncMode);
    setFormData((prev) => ({ ...prev, content: "", timePosition: isSyncMode ? "" : prev.timePosition }));
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