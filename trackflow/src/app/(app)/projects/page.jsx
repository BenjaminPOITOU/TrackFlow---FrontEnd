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
   const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
   const [totalPages, setTotalPages] = useState(0);

  

    const fetchProjects = useCallback(async (pageToFetch = 0) => { 
    if (!user || !user.id) {
      setProjects([]); setIsLoading(false); return;
    }
    console.log(`fetchProjects: Fetching page ${pageToFetch} for user ID: ${user.id}`);
    setIsLoading(true); setError(null);
    try {

      const pageData = await getAllProjects({
        userId: user.id,
        page: pageToFetch,
      
      });

      setProjects(pageData.content);
      setTotalPages(pageData.totalPages);
      setCurrentPage(pageData.currentPage); 

    } catch (err) {
      console.error("Failed to fetch projects:", err);
      setError("Impossible de charger les projets.");
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  }, [user, pageSize, setIsLoading, setError, setProjects, setTotalPages, setCurrentPage]);

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
    <div className="m-1 p-5 w-full h-screen overflow-y-auto">
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




 

