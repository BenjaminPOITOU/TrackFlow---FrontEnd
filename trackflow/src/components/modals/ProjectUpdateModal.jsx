import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { getProjectById, updateProjectById } from "@/lib/api/projects";
import {
  getProjectTypes,
  getProjectCommercialStatuses,
  getProjectMusicalGenders,
  getProjectProgresses,
  getProjectPurposes,
} from "@/lib/api/enum";
import { MiniVisualizer } from "../MiniVisualizer";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import SelectEnum from "../selects/SelectEnum";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export function ProjectUpdateModal({
  isOpen,
  onOpenChange,
  projectId,
  userId,
  onProjectUpdated,
}) {
  const { user } = useAuth();

  // --- États ---
  const [projectDetails, setProjectDetails] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Options
  const [projectTypesOptions, setProjectTypesOptions] = useState([]);
  const [
    projectCommercialStatusesOptions,
    setProjectCommercialStatusesOptions,
  ] = useState([]);
  const [projectMusicalGendersOptions, setProjectMusicalGendersOptions] =
    useState([]);
  const [projectProgressesOptions, setProjectProgressesOptions] = useState([]);
  const [projectPurposesOptions, setProjectPurposesOptions] = useState([]);

  // Valeurs Formulaire
  const [selectedProjectType, setSelectedProjectType] = useState("");
  const [
    selectedProjectCommercialStatuses,
    setSelectedProjectCommercialStatuses,
  ] = useState("");
  const [selectedProjectMusicalGenders, setSelectedProjectMusicalGenders] =
    useState([]);
  const [selectedProjectProgresses, setSelectedProjectProgresses] =
    useState("");
  const [selectedProjectPurposes, setSelectedProjectPurposes] = useState([]);
  const [projectTitleInput, setProjectTitleInput] = useState("");
  const [projectDescriptionInput, setProjectDescriptionInput] = useState("");

  // Filtres Checkbox
  const [genreFilter, setGenreFilter] = useState("");
  const [purposeFilter, setPurposeFilter] = useState("");

  // ---> useEffect pour charger TOUT (Enums + Détails) <---
  useEffect(() => {
    if (isOpen && userId && projectId) {
      const loadAllData = async () => {
        setIsLoadingData(true);
        setError(null);
        try {
          const [
            types,
            commercialStatuses,
            musicalGenders,
            progresses,
            purposes,
            fetchedDetails,
          ] = await Promise.all([
            getProjectTypes(),
            getProjectCommercialStatuses(),
            getProjectMusicalGenders(),
            getProjectProgresses(),
            getProjectPurposes(),
            getProjectById(userId, projectId),
          ]);
          setProjectTypesOptions(types || []);
          setProjectCommercialStatusesOptions(commercialStatuses || []);
          setProjectMusicalGendersOptions(musicalGenders || []);
          setProjectProgressesOptions(progresses || []);
          setProjectPurposesOptions(purposes || []);
          if (fetchedDetails) {
            setProjectDetails(fetchedDetails);
            setProjectTitleInput(fetchedDetails.title || "");
            setProjectDescriptionInput(fetchedDetails.description || "");
            setSelectedProjectType(fetchedDetails.projectType || "");
            setSelectedProjectProgresses(fetchedDetails.projectStatus || "");
            setSelectedProjectCommercialStatuses(
              fetchedDetails.projectCommercialStatus || ""
            );
            setSelectedProjectMusicalGenders(
              fetchedDetails.projectMusicalGendersPreDefined || []
            );
            setSelectedProjectPurposes(fetchedDetails.projectPurposes || []);
          } else {
            throw new Error("Failed to retrieve project details.");
          }
        } catch (err) {
          console.error("Error loading data for modal:", err);
          setError(err.message || "Could not load project data.");
          toast.error(`Error loading data: ${err.message}`);
        } finally {
          setIsLoadingData(false);
        }
      };
      loadAllData();
    } else if (!isOpen) {
      setError(null);
      setGenreFilter("");
      setPurposeFilter("");
    }
  }, [isOpen, projectId, userId]);

  // ---> Fonctions handler (useCallback) <---
  const handleGenderChange = useCallback((checked, genderValue) => {
    setSelectedProjectMusicalGenders((prev) =>
      checked ? [...prev, genderValue] : prev.filter((v) => v !== genderValue)
    );
  }, []);
  const handlePurposeChange = useCallback((checked, purposeValue) => {
    setSelectedProjectPurposes((prev) =>
      checked ? [...prev, purposeValue] : prev.filter((v) => v !== purposeValue)
    );
  }, []);

  // ---> Filtrage (useMemo) <---
  const filteredGenderOptions = useMemo(() => {
    if (!genreFilter) return projectMusicalGendersOptions;
    return projectMusicalGendersOptions.filter((o) =>
      o.label.toLowerCase().includes(genreFilter.toLowerCase())
    );
  }, [projectMusicalGendersOptions, genreFilter]);
  const filteredPurposeOptions = useMemo(() => {
    if (!purposeFilter) return projectPurposesOptions;
    return projectPurposesOptions.filter((o) =>
      o.label.toLowerCase().includes(purposeFilter.toLowerCase())
    );
  }, [projectPurposesOptions, purposeFilter]);

  // ---> Soumission (useCallback) <---
  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      if (error) {
        toast.error("Cannot update due to a previous error.");
        return;
      }
      if (!userId || !projectId) return;
      const projectData = {
        title: projectTitleInput,
        description: projectDescriptionInput,
        projectStatus: selectedProjectProgresses,
        projectType: selectedProjectType,
        projectCommercialStatus: selectedProjectCommercialStatuses,
        projectPurposes: selectedProjectPurposes,
        projectMusicalGendersPreDefined: selectedProjectMusicalGenders,
      };
      setIsSubmitting(true);
      setError(null);
      try {
        await updateProjectById(userId, projectId, {
          projectDetailsToUpdate: projectData,
        });
        toast.success("Project updated successfully!");
        if (onProjectUpdated) onProjectUpdated();
        onOpenChange(false);
      } catch (err) {
        console.error("Error updating project:", err);
        setError(err.message || "Failed to update project.");
        toast.error(
          `Failed to update project: ${err.message}. Please try again.`
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      userId,
      projectId,
      error,
      projectTitleInput,
      projectDescriptionInput,
      selectedProjectProgresses,
      selectedProjectType,
      selectedProjectCommercialStatuses,
      selectedProjectPurposes,
      selectedProjectMusicalGenders,
      onProjectUpdated,
      onOpenChange,
    ]
  );

  // --- Rendu ---
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {/* Contenu Dialog avec contrainte de hauteur et layout flex */}
      <DialogContent className="bg-zinc-900 sm:max-w-4xl my-2 p-0 border border-gray-300 flex flex-col max-h-[85vh]">
        {" "}
        {/* HAUTEUR REDUITE: max-h-[85vh] */}
        {/* Header Non-Scrollable */}
        <div className="w-full p-3 border-b border-gray-300">
          {/* On utilise flex (qui par défaut est row), items-center et gap-3 */}
          <DialogHeader className="flex px-4 items-center gap-3">
            {/* Bloc Titre/Description */}
            <div className="flex flex-col gap-1">
              <DialogTitle>EDIT_PROJECT</DialogTitle>
              <DialogDescription>
                UPDATE YOUR AUDIO PROJECT DETAILS
              </DialogDescription>
            </div>
            {/* Visualizer */}
            <MiniVisualizer className="w-12 h-12" type="cube" />
          </DialogHeader>
        </div>
        {/* Zone de Contenu Scrollable (Formulaire ou états alternatifs) */}
        <div className="w-full p-3 overflow-y-auto flex-grow">
          {" "}
          {/* Scroll + prend hauteur restante */}
          {isLoadingData ? (
            <div className="flex flex-col items-center justify-center py-16 text-zinc-400">
              <Loader2 className="h-12 w-12 animate-spin mb-4" />
              <span>Loading project data...</span>
            </div>
          ) : error && !isSubmitting ? (
            <div className="flex flex-col items-center justify-center py-10 text-red-500 border border-red-700 bg-red-950 rounded p-4 mx-1">
              <DialogTitle className="text-red-500 text-lg mb-2">
                Loading Failed
              </DialogTitle>
              <p className="text-center mb-4">
                Could not load the project data.
              </p>
              <p className="text-xs text-red-400 text-center">
                Details: {error}
              </p>
              {/* On ajoute quand même un bouton close ici car pas de footer en cas d'erreur */}
              <Button
                type="button"
                className="mt-4 border border-gray-300 p-2 cursor-pointer bg-transparent hover:bg-zinc-700 text-gray-300"
                onClick={() => onOpenChange(false)}
              >
                {" "}
                CLOSE{" "}
              </Button>
            </div>
          ) : (
            // ---> FORMULAIRE <---
            <form onSubmit={handleSubmit} className="space-y-6 px-1">
              {/* Affichage de l'erreur de SOUMISSION */}
              {error &&
                isSubmitting /* Affiché seulement pendant la tentative de soumission échouée */ && (
                  <div className="p-3 bg-red-950 border border-red-700 rounded text-red-400 text-sm">
                    Update failed: {error}
                  </div>
                )}

              {/* Section Titre */}
              <div className="grid md:grid-cols-2 gap-x-6 pb-4">
                <div className="flex flex-col gap-2">
                  {" "}
                  <Label htmlFor="projectTitle">PROJECT_TITLE</Label>{" "}
                  <Input
                    id="projectTitle"
                    placeholder="Enter project title..."
                    className="bg-zinc-700"
                    name="projectTitle"
                    value={projectTitleInput}
                    onChange={(e) => setProjectTitleInput(e.target.value)}
                    disabled={isSubmitting}
                  />{" "}
                </div>
              </div>

              {/* Section Sélecteurs et Description */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-8">
                {/* Colonne Gauche */}
                <div className="flex flex-col justify-start gap-6">
                  <div className="flex flex-col gap-2">
                    {" "}
                    <Label htmlFor="projectType">PROJECT_TYPE</Label>{" "}
                    <SelectEnum
                      options={projectTypesOptions}
                      name="projectType"
                      placeholder="Select project type..."
                      value={selectedProjectType}
                      onValueChange={setSelectedProjectType}
                      disabled={isSubmitting}
                    />{" "}
                  </div>
                  <div className="flex flex-col gap-2">
                    {" "}
                    <Label htmlFor="projectProgress">
                      PROJECT_PROGRESS
                    </Label>{" "}
                    <SelectEnum
                      options={projectProgressesOptions}
                      name="projectProgress"
                      placeholder="Select progress..."
                      value={selectedProjectProgresses}
                      onValueChange={setSelectedProjectProgresses}
                      disabled={isSubmitting}
                    />{" "}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>MUSICAL_GENRE(S)</Label>
                    <div className="relative">
                      {" "}
                      <Input
                        type="text"
                        placeholder="Filter genres..."
                        value={genreFilter}
                        onChange={(e) => setGenreFilter(e.target.value)}
                        className="bg-zinc-800 border-zinc-600 pl-8 text-sm"
                        disabled={isSubmitting}
                      />{" "}
                      <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />{" "}
                    </div>
                    <div className="space-y-2 mt-1 rounded border border-zinc-600 p-3 min-h-[8rem] max-h-48 overflow-y-auto bg-zinc-700">
                      {" "}
                      {filteredGenderOptions.length > 0 ? (
                        filteredGenderOptions.map((option) => (
                          <div
                            key={option.value}
                            className="flex items-center space-x-2"
                          >
                            {" "}
                            <Checkbox
                              id={`genre-${option.value}`}
                              checked={selectedProjectMusicalGenders.includes(
                                option.value
                              )}
                              onCheckedChange={(checked) =>
                                !isSubmitting &&
                                handleGenderChange(checked, option.value)
                              }
                              disabled={isSubmitting}
                            />{" "}
                            <Label
                              htmlFor={`genre-${option.value}`}
                              className="font-normal cursor-pointer text-gray-300"
                            >
                              {" "}
                              {option.label}{" "}
                            </Label>{" "}
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-zinc-400 italic">
                          {" "}
                          {genreFilter
                            ? "No matching genres found."
                            : "No genres loaded."}{" "}
                        </p>
                      )}{" "}
                    </div>
                  </div>
                </div>
                {/* Colonne de Droite */}
                <div className="flex flex-col justify-start gap-6">
                  <div className="flex flex-col gap-2">
                    {" "}
                    <Label htmlFor="commercialStatus">
                      COMMERCIAL_STATUS
                    </Label>{" "}
                    <SelectEnum
                      options={projectCommercialStatusesOptions}
                      name="commercialStatus"
                      placeholder="Select status..."
                      value={selectedProjectCommercialStatuses}
                      onValueChange={setSelectedProjectCommercialStatuses}
                      disabled={isSubmitting}
                    />{" "}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>PURPOSE(S)</Label>
                    <div className="relative">
                      {" "}
                      <Input
                        type="text"
                        placeholder="Filter purposes..."
                        value={purposeFilter}
                        onChange={(e) => setPurposeFilter(e.target.value)}
                        className="bg-zinc-800 border-zinc-600 pl-8 text-sm"
                        disabled={isSubmitting}
                      />{" "}
                      <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />{" "}
                    </div>
                    <div className="space-y-2 mt-1 rounded border border-zinc-600 p-3 min-h-[8rem] max-h-48 overflow-y-auto bg-zinc-700">
                      {" "}
                      {filteredPurposeOptions.length > 0 ? (
                        filteredPurposeOptions.map((option) => (
                          <div
                            key={option.value}
                            className="flex items-center space-x-2"
                          >
                            {" "}
                            <Checkbox
                              id={`purpose-${option.value}`}
                              checked={selectedProjectPurposes.includes(
                                option.value
                              )}
                              onCheckedChange={(checked) =>
                                !isSubmitting &&
                                handlePurposeChange(checked, option.value)
                              }
                              disabled={isSubmitting}
                            />{" "}
                            <Label
                              htmlFor={`purpose-${option.value}`}
                              className="font-normal cursor-pointer text-gray-300"
                            >
                              {" "}
                              {option.label}{" "}
                            </Label>{" "}
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-zinc-400 italic">
                          {" "}
                          {purposeFilter
                            ? "No matching purposes found."
                            : "No purposes loaded."}{" "}
                        </p>
                      )}{" "}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 flex-grow">
                    {" "}
                    <Label htmlFor="projectDescription">DESCRIPTION</Label>{" "}
                    <Textarea
                      id="projectDescription"
                      className="bg-zinc-700 border-zinc-600 text-gray-300 min-h-[100px] max-h-[200px] flex-grow"
                      placeholder="Add description..."
                      name="projectDescription"
                      value={projectDescriptionInput}
                      onChange={(e) =>
                        setProjectDescriptionInput(e.target.value)
                      }
                      disabled={isSubmitting}
                    />{" "}
                  </div>
                </div>
              </div>

              {/* ---> FOOTER INTÉGRÉ À LA FIN DU FORMULAIRE <--- */}
              <DialogFooter className="flex justify-end items-center gap-3 pt-4 px-0 pb-0 mt-6">
                {" "}
                {/* mt-6 pour espace avant footer */}
                <Button
                  type="button"
                  className="border border-gray-300 p-2 cursor-pointer bg-transparent hover:bg-zinc-700 text-gray-300"
                  onClick={() => onOpenChange(false)}
                  disabled={isSubmitting}
                >
                  CANCEL
                </Button>
                <Button
                  type="submit"
                  className="border border-zinc-900 bg-gray-300 text-zinc-900 hover:bg-gray-400 cursor-pointer p-2"
                  disabled={isSubmitting || isLoadingData}
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  {isSubmitting ? "UPDATING..." : "UPDATE_PROJECT"}
                </Button>
              </DialogFooter>
            </form>
          )}{" "}
          {/* Fin du else (Formulaire) */}
        </div>{" "}
        {/* Fin de la Zone Scrollable */}
        {/* Pas de footer sticky séparé ici */}
      </DialogContent>
    </Dialog>
  );
}
