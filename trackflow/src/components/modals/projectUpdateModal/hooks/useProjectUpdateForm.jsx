"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { getProjectById, updateProjectById } from "@/lib/api/projects";
import { getProjectEnums } from "@/lib/api/enum";

const initialFormState = {
  title: "",
  description: "",
  projectType: "",
  projectStatus: "",
  projectCommercialStatus: "",
  projectMusicalGendersPreDefined: [],
  projectPurposes: [],
};

/**
 * A custom hook to manage the entire state and logic for the project update form.
 * @param {object} params
 * @param {string} params.projectId - The ID of the project to update.
 * @param {string} params.userId - The ID of the current user.
 * @param {() => void} params.onSuccess - Callback for successful submission.
 * @returns {object} The state and handlers for the form.
 */
export function useProjectUpdateForm({ projectId, userId, onSuccess }) {
  const [formData, setFormData] = useState(initialFormState);
  const [enums, setEnums] = useState({});
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ genre: "", purpose: "" });

  useEffect(() => {
    if (!userId || !projectId) return;
    const loadData = async () => {
      setStatus("loading");
      setError(null);
      try {
        const [enumsData, projectDetails] = await Promise.all([
          getProjectEnums(),
          getProjectById(userId, projectId),
        ]);
        if (!enumsData || !projectDetails)
          throw new Error("Failed to retrieve required project data.");

        setEnums({
          projectTypes: enumsData.types || [],
          projectCommercialStatuses: enumsData.commercialStatuses || [],
          projectMusicalGenders: enumsData.musicalGenders || [],
          projectStatuses: enumsData.statuses || [],
          projectPurposes: enumsData.purposes || [],
        });

        setFormData({
          title: projectDetails.title || "",
          description: projectDetails.description || "",
          projectType: projectDetails.projectType || "",
          projectStatus: projectDetails.projectStatus || "",
          projectCommercialStatus: projectDetails.projectCommercialStatus || "",
          projectMusicalGendersPreDefined:
            projectDetails.projectMusicalGendersPreDefined || [],
          projectPurposes: projectDetails.projectPurposes || [],
        });
        setStatus("idle");
      } catch (err) {
        setError(err.message);
        setStatus("error");
        toast.error(`Error loading data: ${err.message}`);
      }
    };
    loadData();
  }, [projectId, userId]);

  const handleFieldChange = useCallback((key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleCheckboxChange = useCallback((key, value, isChecked) => {
    setFormData((prev) => {
      const currentValues = prev[key] || [];
      const newValues = isChecked
        ? [...currentValues, value]
        : currentValues.filter((v) => v !== value);
      return { ...prev, [key]: newValues };
    });
  }, []);

  const handleFilterChange = useCallback((filterName, value) => {
    setFilters((prev) => ({ ...prev, [filterName]: value }));
  }, []);

  const filteredGenderOptions = useMemo(() => {
    if (!filters.genre) return enums.projectMusicalGenders || [];
    return (enums.projectMusicalGenders || []).filter((o) =>
      o.label.toLowerCase().includes(filters.genre.toLowerCase())
    );
  }, [enums.projectMusicalGenders, filters.genre]);

  const filteredPurposeOptions = useMemo(() => {
    if (!filters.purpose) return enums.projectPurposes || [];
    return (enums.projectPurposes || []).filter((o) =>
      o.label.toLowerCase().includes(filters.purpose.toLowerCase())
    );
  }, [enums.projectPurposes, filters.purpose]);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      setStatus("submitting");
      setError(null);
      try {
        await updateProjectById(userId, projectId, {
          projectDetailsToUpdate: formData,
        });
        toast.success("Project updated successfully!");
        if (onSuccess) onSuccess();
      } catch (err) {
        setError(err.message);
        setStatus("error");
        toast.error(`Failed to update project: ${err.message}`);
      }
    },
    [userId, projectId, formData, onSuccess]
  );

  return {
    status,
    error,
    formData,
    enums,
    filters,
    filteredOptions: {
      genres: filteredGenderOptions,
      purposes: filteredPurposeOptions,
    },
    handlers: {
      handleFieldChange,
      handleCheckboxChange,
      handleFilterChange,
      handleSubmit,
    },
  };
}