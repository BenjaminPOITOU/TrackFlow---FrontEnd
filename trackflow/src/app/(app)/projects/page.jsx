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
    if (!user || !user.id) {
      console.log("fetchProjects: No user or user.id, resetting.");
      setProjects([]);
      setIsLoading(false); 
      return;
    }

    console.log(`fetchProjects: Fetching for user ID: ${user.id}`);
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
  }, [user, setIsLoading, setError, setProjects]); 
   

  useEffect(() => {
 
    if (user && user.id) {
      console.log("useEffect: User ready, calling fetchProjects");
      fetchProjects();
    } else {
       console.log("useEffect: User not ready");
 
       setIsLoading(false);
       setProjects([]);
    }

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




 

