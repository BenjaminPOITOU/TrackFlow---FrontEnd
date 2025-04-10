import React, { use } from "react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "../ui/textarea";
import SelectEnum from "../selects/SelectEnum";
import { useState } from "react";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { MiniVisualizer } from "../MiniVisualizer";

import {
  getProjectTypes,
  getProjectCommercialStatuses,
  getProjectMusicalGenders,
  getProjectProgresses,
  getProjectPurposes,
} from "@/lib/api/enum";

import { sendCreatedProject } from "@/lib/api/projects";

export default function ProjectCreateNewModal({ isOpen, onOpenChange, onProjectCreated }) {
  const [projectTypesOptions, setProjectTypesOptions] = useState([]);
  const [
    projectCommercialStatusesOptions,
    setProjectCommercialStatusesOptions,
  ] = useState([]);
  const [projectMusicalGendersOptions, setProjectMusicalGendersOptions] =
    useState([]);
  const [projectProgressesOptions, setProjectProgressesOptions] = useState([]);
  const [projectPurposesOptions, setProjectPurposesOptions] = useState([]);

  const [selectedProjectType, setSelectedProjectType] = useState("");
  const [
    selectedProjectCommercialStatuses,
    setSelectedProjectCommercialStatuses,
  ] = useState("");
  const [selectedProjectMusicalGenders, setSelectedProjectMusicalGenders] =
    useState("");
  const [selectedProjectProgresses, setSelectedProjectProgresses] =
    useState("");
  const [selectedProjectPurposes, setSelectedProjectPurposes] = useState("");

  const [projectTitleInput, setProjectTitleInput] = useState("");
  const [projectDescriptionInput, setProjectDescriptionInput] = useState("");

  const [isLoadingEnums, setIsLoadingEnums] = useState(false);
  const [errorEnums, setErrorEnums] = useState(null);

  const [devAutoFill, setDevAutoFill] = useState(false);

  const user = useAuth();

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Submitting form...");

    if (!user || !user.id) {
      console.error("User not found or missing ID in AuthContext");

      return;
    }

    const userId = user.id;

    const projectData = {
      title: projectTitleInput,
      description: projectDescriptionInput,
      projectStatus: selectedProjectProgresses,
      projectType: selectedProjectType,
      projectCommercialStatus: selectedProjectCommercialStatuses,
      projectPurposes: [selectedProjectPurposes],
      projectMusicalGendersPreDefined: [selectedProjectMusicalGenders],
    };

    console.log("Project data to send:", projectData);

    sendCreatedProject(userId, projectData);

    toast.success("Project created successfully!");
     if (onProjectCreated) {
                onProjectCreated(); 
            } else {
                
                 onOpenChange(false);
            }

    onOpenChange(false);
  };

  const handleDevAutoFill = (isChecked) => {
    setDevAutoFill(isChecked); // Met à jour l'état de la case

    if (isChecked) {
      // Si on coche, on remplit tout
      setProjectTitleInput("Dev Auto-Filled Project " + Date.now()); // Ajoute un timestamp pour unicité
      setProjectDescriptionInput(
        "This is an automatically filled description for development testing purposes."
      );

      // Pour les selects, prends la première option disponible ou une valeur par défaut valide
      setSelectedProjectType(projectTypesOptions?.[0]?.value || "ALBUM"); // Utilise la 1ère option si elle existe, sinon 'ALBUM'
      setSelectedProjectProgresses(
        projectProgressesOptions?.[0]?.value || "EN_COURS"
      );
      setSelectedProjectMusicalGenders(
        projectMusicalGendersOptions?.[0]?.value || "ELECTRONIC"
      );
      setSelectedProjectCommercialStatuses(
        projectCommercialStatusesOptions?.[0]?.value || "LIBRE"
      );
      setSelectedProjectPurposes(
        projectPurposesOptions?.[0]?.value || "PERSONNEL"
      );
    } else {
      // Si on décoche, on vide les champs (optionnel, mais souvent utile)
      setProjectTitleInput("");
      setProjectDescriptionInput("");
      setSelectedProjectType("");
      setSelectedProjectProgresses("");
      setSelectedProjectMusicalGenders("");
      setSelectedProjectCommercialStatuses("");
      setSelectedProjectPurposes("");
    }
  };

  useEffect(() => {
    const fetchAllEnums = async () => {
      setIsLoadingEnums(true);
      setErrorEnums(null);

      try {
        // Lance tous les appels API en parallèle
        const results = await Promise.all([
          getProjectTypes(),
          getProjectCommercialStatuses(),
          getProjectMusicalGenders(),
          getProjectProgresses(),
          getProjectPurposes(),
        ]);

        // Si tous les appels réussissent, Promise.all retourne un tableau avec les résultats DANS LE MÊME ORDRE
        setProjectTypesOptions(results[0]);
        setProjectCommercialStatusesOptions(results[1]);
        setProjectMusicalGendersOptions(results[2]);
        setProjectProgressesOptions(results[3]);
        setProjectPurposesOptions(results[4]);
      } catch (error) {
        // Si UN SEUL des appels échoue, Promise.all rejette et on arrive ici
        console.error("Failed to fetch one or more enums:", error);
        setErrorEnums(error.message || "Failed to load enum options");
      } finally {
        setIsLoadingEnums(false);
      }
    };

    fetchAllEnums();
  }, []);

  return (
    <Dialog className="flex flex-col" open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 sm:max-w-4xl my-2 p-2 border border-gray-300">
        <div className="w-full p-3 border border-gray-300">
          <DialogHeader className="flex px-4 items-center gap-3">
            <div className="flex flex-col gap-1">
              <DialogTitle>NEW_PROJECT</DialogTitle>
              <DialogDescription>CREATE YOUR AUDIO PROJECT</DialogDescription>
            </div>
            <MiniVisualizer className="w-12 h-12" type="cube" />
          </DialogHeader>

          <div className="h-px w-72 bg-gray-300 my-4"></div>

          {process.env.NODE_ENV === "development" && (
            <div className="my-4 flex items-center space-x-2 px-1">
              {" "}
              {/* Ajout padding horizontal */}
              <input
                type="checkbox"
                id="dev-autofill"
                checked={devAutoFill}
                onChange={(e) => handleDevAutoFill(e.target.checked)}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer" // Style simple
              />
              <label
                htmlFor="dev-autofill"
                className="text-sm text-gray-400 cursor-pointer select-none" // Style simple
              >
                Auto-fill form (Dev Only)
              </label>
            </div>
          )}
          {/* --- Fin Section Auto-remplissage --- */}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Section Titre */}
            <div className="grid md:grid-cols-2 gap-x-6 pb-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="projectTitle">PROJECT_TITLE</Label>
                <Input
                  id="projectTitle"
                  placeholder="Enter project title..."
                  className="bg-zinc-700"
                  name="projectTitle"
                  value={projectTitleInput}
                  onChange={(event) => setProjectTitleInput(event.target.value)}
                />
              </div>
            </div>

            {/* Section Sélecteurs et Description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-8">
              <div className="flex flex-col justify-start gap-6">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="projectType">PROJECT_TYPE</Label>
                  <SelectEnum
                    options={projectTypesOptions}
                    name="projectType"
                    placeholder="Select project type..."
                    value={selectedProjectType}
                    onValueChange={setSelectedProjectType}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="projectProgress">PROJECT_PROGRESS</Label>
                  <SelectEnum
                    options={projectProgressesOptions}
                    name="projectProgress"
                    placeholder="Select progress..."
                    value={selectedProjectProgresses}
                    onValueChange={setSelectedProjectProgresses}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="musicalGenre">MUSICAL_GENRE</Label>
                  <SelectEnum
                    options={projectMusicalGendersOptions}
                    name="musicalGenre"
                    placeholder="Select genre..."
                    value={selectedProjectMusicalGenders}
                    onValueChange={setSelectedProjectMusicalGenders}
                  />
                </div>
              </div>

              {/* Colonne de Droite (Autres Selects + Description) */}
              <div className="flex flex-col justify-start gap-6">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="commercialStatus">COMMERCIAL_STATUS</Label>
                  <SelectEnum
                    options={projectCommercialStatusesOptions}
                    name="commercialStatus"
                    placeholder="Select status..."
                    value={selectedProjectCommercialStatuses}
                    onValueChange={setSelectedProjectCommercialStatuses}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="purpose">PURPOSE</Label>
                  <SelectEnum
                    options={projectPurposesOptions}
                    name="purpose"
                    placeholder="Select purpose..."
                    value={selectedProjectPurposes}
                    onValueChange={setSelectedProjectPurposes}
                  />
                </div>
                <div className="flex flex-col gap-2 flex-grow">
                  <Label htmlFor="projectDescription">DESCRIPTION</Label>
                  <Textarea
                    id="projectDescription"
                    className="bg-zinc-700 border-zinc-600 text-gray-300 min-h-[100px] max-h-[200px] flex-grow"
                    placeholder="Add description..."
                    name="projectDescription"
                    value={projectDescriptionInput}
                    onChange={(event) =>
                      setProjectDescriptionInput(event.target.value)
                    }
                  />
                </div>
              </div>
            </div>
            <DialogFooter className="flex justify-end items-center gap-3 pt-4 px-0 pb-0">
              <Button
                className="border border-gray-300 p-2 cursor-pointer"
                onClick={() => onOpenChange(false)}
              >
                CANCEL
              </Button>
              <Button
                className="border border-zinc-900 bg-gray-300 text-zinc-900 cursor-pointer"
                type="submit"
              >
                CREATE_PROJECT
              </Button>
            </DialogFooter>
          </form>
          <div className="h-px w-72 bg-gray-300 my-4"></div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
