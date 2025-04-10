"use client";

import React, { useEffect, useCallback } from "react";
import PageHeader from "@/components/pageHeader/PageHeader";
import { useState } from "react";
import ProjectCreateNewModal from "@/components/modals/ProjectCreateNewModal";
import { ProjectListHeader } from "@/components/projects/ProjectListHeader";
import ProjectCardList from "@/components/projects/ProjectCardList";
import { getAllProjects } from "@/lib/api/projects";
import { useAuth } from "@/contexts/AuthContext";




export default function ProjectPage() {

  const user = useAuth();
  console.log("ProjectPage rendered. User:", user)
  const [projects, setProjects]= useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchProjects = useCallback(async () => {
    // Vérifie 'user' et 'user.id' au moment de l'exécution
    if (!user || !user.id) {
      console.log("fetchProjects: No user or user.id, resetting.");
      setProjects([]);
      setIsLoading(false); // Assure-toi d'arrêter le chargement
      return;
    }

    console.log(`fetchProjects: Fetching for user ID: ${user.id}`); // Log au moment de l'exécution
    setIsLoading(true);
    setError(null);
    try {
      const userProjectList = await getAllProjects(user.id);
      setProjects(userProjectList);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
      setError("Impossible de charger les projets.");
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  // Dépendances : user (pour user.id) et les fonctions setState (qui sont stables)
  }, [user, setIsLoading, setError, setProjects]); 
   

  useEffect(() => {
    // Appelle fetchProjects seulement si user est prêt
    if (user && user.id) {
      console.log("useEffect: User ready, calling fetchProjects");
      fetchProjects();
    } else {
       console.log("useEffect: User not ready");
       // Assure-toi que l'état initial est géré
       setIsLoading(false);
       setProjects([]);
    }
    // Le fetch se fera via fetchProjects, qui dépend de user
  }, [user, fetchProjects]);



    function handleOpenNewProjectModal() {
    setIsModalOpen(true);
   
  }

   const handleProjectCreationSuccess = useCallback(() => {
 
    setIsModalOpen(false);

 
    setTimeout(() => {
         console.log("Timeout finished. Refetching project list now!");
         fetchProjects(); 
    }, 500); 
}, [fetchProjects]);


   return (
    <div className="m-1 px-5 w-full">
      <PageHeader
        title="PROJECTS"
        subtitle="MANAGE_YOUR_CREATIVE_PROJECTS"
        buttonText="NEW_PROJECT"
        onActionClick={() => handleOpenNewProjectModal()}
      ></PageHeader>

    <div className="flex flex-col gap-4">
      <ProjectListHeader />
    
      {!isLoading && !error && <ProjectCardList projects={projects} />}
    </div>

      <ProjectCreateNewModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        onProjectCreated={handleProjectCreationSuccess}
      />
    </div>
  );

  }




 

