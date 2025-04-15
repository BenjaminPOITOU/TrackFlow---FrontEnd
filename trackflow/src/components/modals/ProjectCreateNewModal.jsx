import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from "sonner";
import {
  getProjectTypes,
  getProjectCommercialStatuses,
  getProjectMusicalGenders,
  getProjectProgresses,
  getProjectPurposes,
} from "@/lib/api/enum"; // Assurez-vous que le chemin est correct
import { sendCreatedProject } from "@/lib/api/projects"; // Assurez-vous que le chemin est correct
import { MiniVisualizer } from "../MiniVisualizer"; // Assurez-vous que le chemin est correct
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import SelectEnum from "../selects/SelectEnum"; // Doit être memoized pour une perf optimale
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Search } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from '@/lib/utils';

export default function ProjectCreateNewModal({ isOpen, onOpenChange, onProjectCreated, user }) {


  // --- États ---
  const [isLoadingEnums, setIsLoadingEnums] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null); // Erreur générale (enums ou soumission)

  // Options Enums
  const [projectTypesOptions, setProjectTypesOptions] = useState([]);
  const [projectCommercialStatusesOptions, setProjectCommercialStatusesOptions] = useState([]);
  const [projectMusicalGendersOptions, setProjectMusicalGendersOptions] = useState([]);
  const [projectProgressesOptions, setProjectProgressesOptions] = useState([]);
  const [projectPurposesOptions, setProjectPurposesOptions] = useState([]);

  // Valeurs Formulaire
  const [selectedProjectType, setSelectedProjectType] = useState("");
  const [selectedProjectCommercialStatuses, setSelectedProjectCommercialStatuses] = useState("");
  const [selectedProjectMusicalGenders, setSelectedProjectMusicalGenders] = useState([]); // Multi
  const [selectedProjectProgresses, setSelectedProjectProgresses] = useState("");
  const [selectedProjectPurposes, setSelectedProjectPurposes] = useState([]); // Multi
  const [projectTitleInput, setProjectTitleInput] = useState("");
  const [projectDescriptionInput, setProjectDescriptionInput] = useState("");

  // Filtres Checkbox
  const [genreFilter, setGenreFilter] = useState("");
  const [purposeFilter, setPurposeFilter] = useState("");

  // Dev Autofill
  const [devAutoFill, setDevAutoFill] = useState(false);

  // ---> useEffect pour charger les ENUMS au montage/ouverture <---
  useEffect(() => {
    if (isOpen) { // Charger seulement si la modale s'ouvre
      const fetchAllEnums = async () => {
        setIsLoadingEnums(true); setError(null); // Reset error
        try {
          const [ types, commercialStatuses, musicalGenders, progresses, purposes ] = await Promise.all([
            getProjectTypes(), getProjectCommercialStatuses(), getProjectMusicalGenders(),
            getProjectProgresses(), getProjectPurposes(),
          ]);
          setProjectTypesOptions(types || []);
          setProjectCommercialStatusesOptions(commercialStatuses || []);
          setProjectMusicalGendersOptions(musicalGenders || []);
          setProjectProgressesOptions(progresses || []);
          setProjectPurposesOptions(purposes || []);
        } catch (err) {
          console.error("Failed to fetch one or more enums:", err);
          setError(err.message || "Failed to load selection options");
          toast.error(`Error loading options: ${err.message}`);
        } finally {
          setIsLoadingEnums(false);
        }
      };
      fetchAllEnums();
    } else if (!isOpen) {
        // Reset états à la fermeture
        setError(null);
        setGenreFilter("");
        setPurposeFilter("");
        setDevAutoFill(false); // Reset autofill
        // Optionnel: reset les champs du formulaire ? Peut-être préférable de garder la saisie en cours
        // setProjectTitleInput(""); setProjectDescriptionInput(""); setSelectedProjectType(""); ...etc.
    }
  }, [isOpen]); // Dépend seulement de isOpen

  // ---> Fonctions handler pour Checkboxes (useCallback) <---
  const handleGenderChange = useCallback((checked, genderValue) => {
    setSelectedProjectMusicalGenders((prev) => checked ? [...prev, genderValue] : prev.filter((v) => v !== genderValue));
  }, []);
  const handlePurposeChange = useCallback((checked, purposeValue) => {
    setSelectedProjectPurposes((prev) => checked ? [...prev, purposeValue] : prev.filter((v) => v !== purposeValue));
  }, []);

  // ---> Filtrage des options Checkbox (useMemo) <---
  const filteredGenderOptions = useMemo(() => { if (!genreFilter) return projectMusicalGendersOptions; return projectMusicalGendersOptions.filter(o => o.label.toLowerCase().includes(genreFilter.toLowerCase())); }, [projectMusicalGendersOptions, genreFilter]);
  const filteredPurposeOptions = useMemo(() => { if (!purposeFilter) return projectPurposesOptions; return projectPurposesOptions.filter(o => o.label.toLowerCase().includes(purposeFilter.toLowerCase())); }, [projectPurposesOptions, purposeFilter]);

  // ---> Handler pour Dev Autofill (useCallback) <---
  const handleDevAutoFill = useCallback((isChecked) => {
    setDevAutoFill(isChecked);
    if (isChecked) {
      setProjectTitleInput("Dev Auto-Filled Project " + Date.now().toString().slice(-5)); // Plus court
      setProjectDescriptionInput("Auto-filled description for dev testing.");
      setSelectedProjectType(projectTypesOptions?.[0]?.value || ""); // Prend le premier ou vide
      setSelectedProjectProgresses(projectProgressesOptions?.[0]?.value || "");
      setSelectedProjectCommercialStatuses(projectCommercialStatusesOptions?.[0]?.value || "");
      // Met la première option dans un tableau pour les multi-select
      setSelectedProjectMusicalGenders(projectMusicalGendersOptions?.[0]?.value ? [projectMusicalGendersOptions[0].value] : []);
      setSelectedProjectPurposes(projectPurposesOptions?.[0]?.value ? [projectPurposesOptions[0].value] : []);
    } else {
      setProjectTitleInput(""); setProjectDescriptionInput("");
      setSelectedProjectType(""); setSelectedProjectProgresses("");
      setSelectedProjectCommercialStatuses("");
      setSelectedProjectMusicalGenders([]); // Reset en tableau vide
      setSelectedProjectPurposes([]); // Reset en tableau vide
    }
  }, [ // Dépendances : les options pour pouvoir remplir
      projectTypesOptions, projectProgressesOptions, projectCommercialStatusesOptions,
      projectMusicalGendersOptions, projectPurposesOptions
  ]);


  // ---> Soumission du formulaire (useCallback) <---
  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();
    if (error && !isSubmitting) { // Vérifier si erreur de chargement existe déjà
        toast.error("Cannot create due to a previous loading error.");
        return;
    }
    if (!user || !user.id) {
      toast.error("User not identified. Cannot create project.");
      console.error("User not found or missing ID in AuthContext");
      return;
    }

    const userId = user.id;
    const projectData = {
      title: projectTitleInput, description: projectDescriptionInput,
      projectStatus: selectedProjectProgresses, projectType: selectedProjectType,
      projectCommercialStatus: selectedProjectCommercialStatuses,
      projectPurposes: selectedProjectPurposes, // Déjà un tableau
      projectMusicalGendersPreDefined: selectedProjectMusicalGenders, // Déjà un tableau
    };

    console.log("Project data to send:", projectData);
    setIsSubmitting(true); setError(null); // Reset error avant de soumettre

    try {

      await sendCreatedProject(userId, projectData);

      toast.success("Project created successfully!");
      if (onProjectCreated) {
        onProjectCreated(); // Appeler le callback parent
      }
      onOpenChange(false); // Fermer la modale
      // Reset du formulaire (optionnel, si on ne reset pas à la fermeture)
      // setProjectTitleInput(""); setProjectDescriptionInput(""); ... etc.

    } catch (err) {
      console.error("Error creating project:", err);
      setError(err.message || "Failed to create project."); // Afficher l'erreur
      toast.error(`Failed to create project: ${err.message}. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  }, [ // Liste des dépendances pour handleSubmit
    user, error, projectTitleInput, projectDescriptionInput, selectedProjectProgresses,
    selectedProjectType, selectedProjectCommercialStatuses, selectedProjectPurposes,
    selectedProjectMusicalGenders, onProjectCreated, onOpenChange // sendCreatedProject est stable (importé)
  ]);

  // --- Rendu ---
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 sm:max-w-4xl my-2 p-0 border border-gray-300 flex flex-col max-h-[85vh]">

        {/* Header Non-Scrollable */}
        <div className="w-full p-3 border-b border-gray-300">
          <DialogHeader className="flex px-4 items-center gap-3">
            <div className="flex flex-col gap-1">
              <DialogTitle>NEW_PROJECT</DialogTitle>
              <DialogDescription>CREATE YOUR AUDIO PROJECT</DialogDescription>
            </div>
            <MiniVisualizer className="w-12 h-12" type="cube" />
          </DialogHeader>
        </div>

        {/* Zone de Contenu Scrollable */}
        <div className="w-full p-3 overflow-y-auto flex-grow">
          {isLoadingEnums ? (
            <div className="flex flex-col items-center justify-center py-16 text-zinc-400"> <Loader2 className="h-12 w-12 animate-spin mb-4" /> <span>Loading options...</span> </div>
          ) : error && !isSubmitting ? ( // Erreur de chargement des enums
             <div className="flex flex-col items-center justify-center py-10 text-red-500 border border-red-700 bg-red-950 rounded p-4 mx-1">
                <DialogTitle className="text-red-500 text-lg mb-2">Loading Failed</DialogTitle>
                <p className="text-center mb-4">Could not load project options.</p>
                <p className="text-xs text-red-400 text-center">Details: {error}</p>
                <Button type="button" className="mt-4 border border-gray-300 p-2 cursor-pointer bg-transparent hover:bg-zinc-700 text-gray-300" onClick={() => onOpenChange(false)} > CLOSE </Button>
             </div>
          ) : (
            // ---> FORMULAIRE <---
            <form onSubmit={handleSubmit} className="space-y-6 px-1">
              {/* Affichage de l'erreur de SOUMISSION */}
              {error && isSubmitting && ( <div className="p-3 bg-red-950 border border-red-700 rounded text-red-400 text-sm"> Creation failed: {error} </div> )}

              {/* Dev Autofill */}
              {process.env.NODE_ENV === "development" && (
                <div className="my-4 flex items-center space-x-2 px-1">
                  <Checkbox // Utiliser le Checkbox de shadcn/ui
                    id="dev-autofill"
                    checked={devAutoFill}
                    onCheckedChange={handleDevAutoFill} // Utiliser le handler callback
                    className="data-[state=checked]:bg-indigo-600 data-[state=checked]:text-white border-gray-400" // Style un peu plus shadcn
                  />
                  <Label htmlFor="dev-autofill" className="text-sm text-gray-400 cursor-pointer select-none font-normal"> Auto-fill form (Dev Only) </Label>
                </div>
               )}

              {/* Section Titre */}
              <div className="grid md:grid-cols-2 gap-x-6 pb-4">
                <div className="flex flex-col gap-2"> <Label htmlFor="projectTitle">PROJECT_TITLE</Label> <Input id="projectTitle" placeholder="Enter project title..." className="bg-zinc-700" name="projectTitle" value={projectTitleInput} onChange={(e) => setProjectTitleInput(e.target.value)} disabled={isSubmitting} /> </div>
              </div>
              {/* Section Sélecteurs et Description */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-8">
                 {/* Colonne Gauche */}
                 <div className="flex flex-col justify-start gap-6">
                   <div className="flex flex-col gap-2"> <Label htmlFor="projectType">PROJECT_TYPE</Label> <SelectEnum options={projectTypesOptions} name="projectType" placeholder="Select project type..." value={selectedProjectType} onValueChange={setSelectedProjectType} disabled={isSubmitting || isLoadingEnums} /> </div>
                   <div className="flex flex-col gap-2"> <Label htmlFor="projectProgress">PROJECT_PROGRESS</Label> <SelectEnum options={projectProgressesOptions} name="projectProgress" placeholder="Select progress..." value={selectedProjectProgresses} onValueChange={setSelectedProjectProgresses} disabled={isSubmitting || isLoadingEnums} /> </div>
                   <div className="flex flex-col gap-2">
                      <Label>MUSICAL_GENRE(S)</Label>
                      <div className="relative"> <Input type="text" placeholder="Filter genres..." value={genreFilter} onChange={(e) => setGenreFilter(e.target.value)} className="bg-zinc-800 border-zinc-600 pl-8 text-sm" disabled={isSubmitting || isLoadingEnums} /> <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" /> </div>
                      <div className="space-y-2 mt-1 rounded border border-zinc-600 p-3 min-h-[8rem] max-h-48 overflow-y-auto bg-zinc-700"> {isLoadingEnums ? <span className='text-xs italic text-zinc-400'>Loading...</span> : filteredGenderOptions.length > 0 ? ( filteredGenderOptions.map((option) => ( <div key={option.value} className="flex items-center space-x-2"> <Checkbox id={`genre-${option.value}`} checked={selectedProjectMusicalGenders.includes(option.value)} onCheckedChange={(checked) => !isSubmitting && handleGenderChange(checked, option.value)} disabled={isSubmitting} /> <Label htmlFor={`genre-${option.value}`} className="font-normal cursor-pointer text-gray-300"> {option.label} </Label> </div> ))) : ( <p className="text-sm text-zinc-400 italic"> {genreFilter ? "No matching genres found." : "No genres available."} </p> )} </div>
                   </div>
                 </div>
                 {/* Colonne de Droite */}
                 <div className="flex flex-col justify-start gap-6">
                   <div className="flex flex-col gap-2"> <Label htmlFor="commercialStatus">COMMERCIAL_STATUS</Label> <SelectEnum options={projectCommercialStatusesOptions} name="commercialStatus" placeholder="Select status..." value={selectedProjectCommercialStatuses} onValueChange={setSelectedProjectCommercialStatuses} disabled={isSubmitting || isLoadingEnums}/> </div>
                   <div className="flex flex-col gap-2">
                      <Label>PURPOSE(S)</Label>
                      <div className="relative"> <Input type="text" placeholder="Filter purposes..." value={purposeFilter} onChange={(e) => setPurposeFilter(e.target.value)} className="bg-zinc-800 border-zinc-600 pl-8 text-sm" disabled={isSubmitting || isLoadingEnums} /> <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" /> </div>
                      <div className="space-y-2 mt-1 rounded border border-zinc-600 p-3 min-h-[8rem] max-h-48 overflow-y-auto bg-zinc-700"> {isLoadingEnums ? <span className='text-xs italic text-zinc-400'>Loading...</span> : filteredPurposeOptions.length > 0 ? ( filteredPurposeOptions.map((option) => ( <div key={option.value} className="flex items-center space-x-2"> <Checkbox id={`purpose-${option.value}`} checked={selectedProjectPurposes.includes(option.value)} onCheckedChange={(checked) => !isSubmitting && handlePurposeChange(checked, option.value)} disabled={isSubmitting} /> <Label htmlFor={`purpose-${option.value}`} className="font-normal cursor-pointer text-gray-300"> {option.label} </Label> </div> ))) : ( <p className="text-sm text-zinc-400 italic"> {purposeFilter ? "No matching purposes found." : "No purposes available."} </p> )} </div>
                   </div>
                   <div className="flex flex-col gap-2 flex-grow"> <Label htmlFor="projectDescription">DESCRIPTION</Label> <Textarea id="projectDescription" className="bg-zinc-700 border-zinc-600 text-gray-300 min-h-[100px] max-h-[200px] flex-grow" placeholder="Add description..." name="projectDescription" value={projectDescriptionInput} onChange={(e) => setProjectDescriptionInput(e.target.value)} disabled={isSubmitting} /> </div>
                 </div>
              </div>
              {/* Footer intégré */}
               <DialogFooter className="flex justify-end items-center gap-3 pt-4 px-0 pb-0 mt-6">
                  <Button type="button" className="border border-gray-300 p-2 cursor-pointer bg-transparent hover:bg-zinc-700 text-gray-300" onClick={() => onOpenChange(false)} disabled={isSubmitting} > CANCEL </Button>
                  <Button type="submit" className="border border-zinc-900 bg-gray-300 text-zinc-900 hover:bg-gray-400 cursor-pointer p-2" disabled={isSubmitting || isLoadingEnums} >
                    {isSubmitting ? ( <Loader2 className="h-4 w-4 animate-spin mr-2" /> ) : null}
                    {isSubmitting ? 'CREATING...' : 'CREATE_PROJECT'}
                  </Button>
                </DialogFooter>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}