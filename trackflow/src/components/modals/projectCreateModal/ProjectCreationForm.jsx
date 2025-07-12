"use client";

/**
 * @file components/forms/ProjectCreationForm.js (or .tsx)
 * @description A comprehensive, stateful form for creating a new project. It manages its own state,
 * fetches necessary data (like dropdown options), handles validation, and manages the API submission process.
 */

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { getProjectEnums } from "@/lib/api/enum";
import { sendCreatedProject } from "@/lib/api/projects";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { FormFields } from "./FormFields";

/**
 * Renders a full-featured, stateful form for creating a new project.
 *
 * This component handles the entire creation lifecycle:
 * 1.  Fetches required data (enums for dropdowns) on mount.
 * 2.  Manages the form's data state (`formState`).
 * 3.  Provides a development utility for auto-filling the form.
 * 4.  Handles the API submission, including loading and error states.
 * 5.  Communicates success or cancellation back to the parent component via callbacks.
 *
 * @param {object} props - The component props.
 * @param {function(): void} props.onSuccess - Callback executed after a successful project creation, used to close the modal and/or refresh data.
 * @param {function(): void} props.onCancel - Callback to cancel the operation, typically used to close the form/modal.
 * @returns {JSX.Element} The project creation form, or a loading/error state UI.
 */
export default function ProjectCreationForm({ onSuccess, onCancel }) {
  const { user } = useAuth();
  const [enums, setEnums] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [formState, setFormState] = useState({
    title: "",
    description: "",
    projectType: "",
    progress: "",
    commercialStatus: "",
    musicalGenders: [],
    purposes: [],
  });
  const [devAutoFill, setDevAutoFill] = useState(false);

  useEffect(() => {
    const fetchEnums = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const enumData = await getProjectEnums();
        setEnums(enumData);
      } catch (err) {
        setError(err.message || "Failed to load selection options");
        toast.error(`Erreur de chargement des options: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEnums();
  }, []);

  const handleFieldChange = (field, value) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleDevAutoFill = useCallback(
    (isChecked) => {
      setDevAutoFill(isChecked);
      if (isChecked) {
        setFormState({
          title: "Projet de Dév. " + Date.now().toString().slice(-5),
          description: "Description auto-générée pour les tests.",
          projectType: enums.types?.[0]?.value || "",
          progress: enums.statuses?.[0]?.value || "",
          commercialStatus: enums.commercialStatuses?.[0]?.value || "",
          musicalGenders: enums.musicalGenders?.[0]?.value
            ? [enums.musicalGenders[0].value]
            : [],
          purposes: enums.purposes?.[0]?.value ? [enums.purposes[0].value] : [],
        });
      } else {
        setFormState({
          title: "",
          description: "",
          projectType: "",
          progress: "",
          commercialStatus: "",
          musicalGenders: [],
          purposes: [],
        });
      }
    },
    [enums]
  );

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      if (!user?.id) {
        toast.error(
          "Utilisateur non identifié. Impossible de créer le projet."
        );
        return;
      }
      const {
        title,
        description,
        progress,
        projectType,
        commercialStatus,
        purposes,
        musicalGenders,
      } = formState;
      const projectData = {
        title,
        description,
        projectStatus: progress,
        projectType,
        projectCommercialStatus: commercialStatus,
        projectPurposes: purposes,
        projectMusicalGendersPreDefined: musicalGenders,
      };

      setIsSubmitting(true);
      setError(null);
      try {
        await sendCreatedProject(user.id, projectData);
        toast.success("Projet créé avec succès !");
        if (onSuccess) onSuccess();
      } catch (err) {
        setError(err.message || "La création du projet a échoué.");
        toast.error(`Échec de la création du projet : ${err.message}`);
      } finally {
        setIsSubmitting(false);
      }
    },
    [user, formState, onSuccess]
  );

  const isSubmitDisabled =
    isSubmitting ||
    isLoading ||
    !formState.title ||
    !formState.projectType ||
    !formState.progress ||
    !formState.commercialStatus;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 h-96 text-gray-300">
        <Loader2 className="h-12 w-12 animate-spin mb-4" />
        <span>Chargement des options...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 h-96 text-red-400">
        <h3 className="text-lg font-semibold mb-2">Échec du chargement</h3>
        <p className="text-center mb-4">
          Impossible de charger les options du projet.
        </p>
        <p className="text-xs text-center text-gray-400">Détails : {error}</p>
        <Button
          variant="outline"
          className="mt-4 border-gray-300 text-white hover:bg-gray-700"
          onClick={onCancel}
        >
          Fermer
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="space-y-8 p-6">
          <div className="flex items-center space-x-2 p-3 border border-gray-300 rounded-lg bg-zinc-700">
            <Checkbox
              id="dev-autofill"
              checked={devAutoFill}
              onCheckedChange={handleDevAutoFill}
              className="border-gray-300"
            />
            <Label
              htmlFor="dev-autofill"
              className="cursor-pointer select-none text-gray-300"
            >
              Remplissage auto (Dév.)
            </Label>
          </div>

          <FormFields
            formState={formState}
            onFieldChange={handleFieldChange}
            enums={enums}
            disabled={isSubmitting}
          />
        </div>
      </div>
      <div className="sticky bottom-0 flex justify-end gap-4 border-t border-gray-300 p-6 bg-zinc-800 shadow-lg z-10">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
          className="border-gray-300 text-white hover:bg-gray-700"
        >
          Annuler
        </Button>
        <Button
          type="submit"
          disabled={isSubmitDisabled}
          className="bg-gray-300 hover:bg-gray-200 text-gray-900 border border-gray-300 px-6 font-medium"
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting ? "Création en cours..." : "Créer le Projet"}
        </Button>
      </div>
    </form>
  );
}
