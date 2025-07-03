"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { getCompositionStatuses } from "@/lib/api/enum";
import { createComposition } from "@/lib/api/compositions";
import { createBranch } from "@/lib/api/branches";

const initialFormState = {
  title: "",
  compositionStatus: "",
  subGender: [],
  description: "",
};

export function useCompositionCreateForm({ projectId, onSuccess }) {
  const [formData, setFormData] = useState(initialFormState);
  const [statusEnums, setStatusEnums] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);

  /**
   * A custom hook to manage state and logic for the composition creation form.
   * It handles the creation of the composition AND its default 'main' branch in sequence.
   *
   * @param {object} props - The hook's props.
   * @param {string} props.projectId - The ID of the project to which the new composition will belong.
   * @param {Function} props.onSuccess - A callback function to execute after successful creation.
   * @returns {object} An object containing form state, status, and event handlers.
   */
  useEffect(() => {
    const fetchEnums = async () => {
      try {
        const statuses = await getCompositionStatuses();
        setStatusEnums(statuses || []);
        setStatus("idle");
      } catch (err) {
        toast.error("Failed to load composition options.");
        setError(err.message);
        setStatus("error");
      }
    };
    fetchEnums();
  }, []);

  const handleFieldChange = useCallback((key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleAutofill = useCallback(() => {
    setFormData({
      title: "Nouvelle Piste",
      compositionStatus: statusEnums[0]?.value || "",
      subGender: ["Pop", "Rock"],
      description: "Description de la nouvelle piste.",
    });
  }, [statusEnums]);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      if (!formData.title || !formData.compositionStatus) {
        toast.error("Le titre et le statut de la composition sont requis.");
        return;
      }
      setStatus("submitting");
      setError(null);
      try {
        const newComposition = await createComposition(projectId, {
          ...formData,
          illustration: null,
        });

        const branchData = {
            branchName: "main",
            description: "Branche principale par défaut.",
            branchParentId: null,
        };


        await createBranch({
          projectId: projectId,
          compositionId: newComposition.id,
          branchData: branchData,
        });

        toast.success("Composition et branche 'main' créées avec succès !");
        if (onSuccess) onSuccess(); 
        
      } catch (err) {
        setError(err.message);
        setStatus("error");
        toast.error(`Échec de la création : ${err.message}`);
      }
    },
    [projectId, formData, onSuccess]
  );

  return {
    status,
    error,
    formData,
    statusEnums,
    handlers: {
      handleFieldChange,
      handleSubmit,
      handleAutofill,
    },
  };
}