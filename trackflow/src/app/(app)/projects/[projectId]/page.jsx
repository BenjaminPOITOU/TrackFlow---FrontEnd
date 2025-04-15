"use client";

import { getProjectById } from "@/lib/api/projects";
import { useAuth } from "@/contexts/AuthContext";
import React, { useEffect, useState, use, useCallback } from "react"; // 'use' est importé
import PageHeader from "@/components/pageHeader/PageHeader";
import { ProjectDetails } from "@/components/projects/ProjectDetails";
import { CompositionList } from "@/components/compositions/CompositionList";
import CompositionCreateNewModal from "@/components/modals/CompositionCreateNewModal";
import { Loader2 } from "lucide-react";
import { toast } from "sonner"; // Importer toast si pas déjà fait

export default function CompositionPage({ params }) {

  // ---> CORRECTION ERREUR 2: Utiliser use(params) pour obtenir projectId <---
  // TOUS les hooks doivent être appelés AVANT toute condition/return
  const resolvedParams = use(params); // Déballer la promesse/l'objet params
  const projectId = resolvedParams?.projectId; // Accéder après use()

  // ---> Appeler useAuth() <---
  const { user: authUser, isLoading: isLoadingAuth, error: errorAuth } = useAuth();

  // ---> Appeler TOUS les useState <---
  const [project, setProject] = useState(null);
  const [isLoadingProject, setIsLoadingProject] = useState(true); // COMMENCER en true si on fetch immédiatement
  const [errorProject, setErrorProject] = useState(null);
  const [isCompositionModalOpen, setIsCompositionModalOpen] = useState(false);

  console.log(`CompositionPage - Initial Render - ProjectId: ${projectId}`);
  console.log(`CompositionPage - Initial Render - Auth State:`, { authUser, isLoadingAuth, errorAuth });


  // ---> useEffect pour le fetch <---
  useEffect(() => {
    // Logique interne de l'effet (ne viole pas les règles car useEffect est un hook appelé au top level)
    console.log(`CompositionPage useEffect triggered. isLoadingAuth: ${isLoadingAuth}, User: ${!!authUser}, ProjectId: ${projectId}`);

    if (!isLoadingAuth) { // Attendre que l'auth soit prête
        const userId = authUser?.id;

        if (authUser && userId && projectId) {
            // --- Lancer le fetch ---
            console.log(`CompositionPage: Conditions met. Fetching project ${projectId} for user ${userId}...`);
            setIsLoadingProject(true); // Mettre loading projet ici
            setErrorProject(null);
            setProject(null);

            getProjectById(userId, projectId)
                .then(fetchedProject => {
                    console.log("CompositionPage: Fetched project data:", fetchedProject);
                    if (fetchedProject) {
                        setProject(fetchedProject);
                    } else {
                        console.warn("CompositionPage: getProjectById returned no data.");
                        setErrorProject("Project not found or access denied.");
                    }
                })
                .catch(err => {
                    console.error("CompositionPage: Fetch project error:", err);
                    setErrorProject(err.message || "Failed to load project details.");
                })
                .finally(() => {
                    setIsLoadingProject(false);
                });
             // --- Fin du fetch ---
        } else {
             // Conditions non remplies APRES que l'auth soit chargée
             console.log("CompositionPage: Auth ready, but user/projectId missing.");
             setIsLoadingProject(false); // Stopper le loading projet
             setProject(null);
             setErrorProject(!authUser || !userId ? "You need to be logged in to view this project." : "Project ID is missing.");
        }
    } else {
        // Auth encore en chargement, on peut déjà mettre le loading projet
        console.log("CompositionPage: Waiting for authentication...");
        setIsLoadingProject(true); // Afficher le loader projet pendant que l'auth charge aussi
    }
  }, [authUser, isLoadingAuth, projectId]); // Dépendances : état d'auth et projectId

  // ---> useCallback pour la fonction modale <---
  const handleOpenNewCompositionModal = useCallback(() => {
    if (authUser && authUser.id) {
      setIsCompositionModalOpen(true);
    } else {
      toast.error("Cannot add composition: user not identified.");
    }
  }, [authUser]); // Dépend de authUser

  // ---> CORRECTION ERREUR 1 & 3: Logique de rendu conditionnel DANS le return <---

  // 1. Déterminer le contenu principal à afficher
  let mainContent;
  if (isLoadingAuth || isLoadingProject) { // Si l'auth OU le projet charge
    mainContent = (
      <div className="flex justify-center items-center flex-grow p-6 text-zinc-400">
        <Loader2 className="h-8 w-8 animate-spin mr-3"/>
        {isLoadingAuth ? "Verifying user session..." : "Loading project details..."}
      </div>
    );
  } else if (errorAuth) { // Si erreur d'auth
    mainContent = (
      <div className="p-6 text-center text-red-500 flex-grow">
        Authentication Error: {errorAuth}
      </div>
    );
  } else if (errorProject) { // Si erreur de projet (et pas d'erreur d'auth)
     mainContent = (
      <div className="p-6 text-center text-red-500 flex-grow">
        Error: {errorProject}
      </div>
    );
  } else if (!project) { // Si pas d'erreur mais projet non trouvé
    mainContent = (
      <div className="p-6 text-center text-muted-foreground flex-grow">
        Project not found or access impossible. Please check the ID or your permissions.
      </div>
    );
  } else { 
    mainContent = (
      <>
       
        <CompositionCreateNewModal
          isOpen={isCompositionModalOpen}
          onOpenChange={setIsCompositionModalOpen}
          projectId={projectId} 
          user={authUser} 
        />
     
        <div className="flex flex-col gap-4 justify-center items-start mt-4"> 
          <ProjectDetails project={project} user={authUser} />
          <CompositionList projectId={projectId} />
        </div>
      </>
    );
  }


  return (
   
    <div className="flex flex-col h-screen w-full gap-3 p-5">
      
       {project && !isLoadingProject && !errorProject ? ( 
          <div>
             <PageHeader
                title={project.title}
                subtitle="PROJECT_DETAILS_AND_COMPOSITIONS"
                buttonText="NEW_COMPOSITION"
                onActionClick={handleOpenNewCompositionModal}
            />
          </div>
        ) : !isLoadingAuth && !isLoadingProject ? (
            <div>
             <PageHeader
                title={"Project"} 
                subtitle={"Details and Compositions"}
            
             />
          </div>
        ) : null }
      {mainContent}

    </div>
  );
}