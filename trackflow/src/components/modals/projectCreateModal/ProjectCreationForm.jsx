"use client";

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
 * A comprehensive form for creating a new project.
 * It handles state, data fetching, validation, and submission logic.
 * @param {object} props - The component props.
 * @param {() => void} props.onSuccess - Callback for successful project creation.
 * @param {() => void} props.onCancel - Callback to cancel and close the form.
 * @returns {JSX.Element} The project creation form.
 */
export default function ProjectCreationForm({ onSuccess, onCancel }) {
  const {user} = useAuth();
  const [enums, setEnums] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [formState, setFormState] = useState({
    title: "", description: "", projectType: "", progress: "",
    commercialStatus: "", musicalGenders: [], purposes: [],
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
        toast.error(`Error loading options: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEnums();
  }, []);
  
  const handleFieldChange = (field, value) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };
  
  const handleDevAutoFill = useCallback((isChecked) => {
      setDevAutoFill(isChecked);
      if (isChecked) {
        setFormState({
          title: "Projet de Dév. " + Date.now().toString().slice(-5),
          description: "Description auto-générée pour les tests.",
          projectType: enums.types?.[0]?.value || "",
          progress: enums.statuses?.[0]?.value || "",
          commercialStatus: enums.commercialStatuses?.[0]?.value || "",
          musicalGenders: enums.musicalGenders?.[0]?.value ? [enums.musicalGenders[0].value] : [],
          purposes: enums.purposes?.[0]?.value ? [enums.purposes[0].value] : [],
        });
      } else {
        setFormState({ title: "", description: "", projectType: "", progress: "", commercialStatus: "", musicalGenders: [], purposes: [] });
      }
    }, [enums]);

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();
    if (!user?.id) {
      toast.error("Utilisateur non identifié. Impossible de créer le projet.");
      return;
    }
    const { title, description, progress, projectType, commercialStatus, purposes, musicalGenders } = formState;
    const projectData = { title, description, projectStatus: progress, projectType, projectCommercialStatus: commercialStatus, projectPurposes: purposes, projectMusicalGendersPreDefined: musicalGenders };
    
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
  }, [user, formState, onSuccess]);
  
  const isSubmitDisabled = isSubmitting || isLoading || !formState.title;

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
        <p className="text-center mb-4">Impossible de charger les options du projet.</p>
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
          {process.env.NODE_ENV === "development" && (
            <div className="flex items-center space-x-2 p-3 border border-gray-300 rounded-lg bg-zinc-700">
              <Checkbox 
                id="dev-autofill" 
                checked={devAutoFill} 
                onCheckedChange={handleDevAutoFill}
                className="border-gray-300" 
              />
              <Label htmlFor="dev-autofill" className="cursor-pointer select-none text-gray-300">
                Remplissage auto (Dév.)
              </Label>
            </div>
          )}
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