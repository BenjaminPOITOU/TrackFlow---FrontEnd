"use client";

import React, { useEffect, useCallback, useState } from "react";
import PageHeader from "@/components/pageHeader/PageHeader";
import ProjectCreateNewModal from "@/components/modals/ProjectCreateNewModal";
import { ProjectListHeader } from "@/components/projects/ProjectListHeader";
import ProjectCardList from "@/components/projects/ProjectCardList";
import { getAllProjects } from "@/lib/api/projects";
import { useAuth } from "@/contexts/AuthContext"; 
import { Loader2 } from "lucide-react"; 
import { toast } from "sonner";

export default function ProjectPage() {

  const { user, isLoading: isLoadingAuth, error: errorAuth } = useAuth();

  console.log("ProjectPage rendered. Auth State:", { user, isLoadingAuth, errorAuth });

  const [projects, setProjects] = useState([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false); 
  const [errorProjects, setErrorProjects] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10); 
  const [totalPages, setTotalPages] = useState(0);

  const fetchProjects = useCallback(async (pageToFetch = 0) => {

      if (!user || !user.id) {
        console.warn("fetchProjects called without valid user, skipping.");
        setProjects([]); setIsLoadingProjects(false); 
        return;
      }
      console.log(`fetchProjects: Fetching page ${pageToFetch} for user ID: ${user.id}, page size: ${pageSize}`);
      setIsLoadingProjects(true); 
      setErrorProjects(null); 
      try {
        const pageData = await getAllProjects({
          userId: user.id,
          page: pageToFetch,
          size: pageSize, 
          sort: 'createdDate,desc' 
        });
        console.log("fetchProjects: Received page data:", pageData);
        setProjects(pageData.content || []); 
        setTotalPages(pageData.totalPages);
        setCurrentPage(pageData.currentPage);
      } catch (err) {
        console.error("Failed to fetch projects:", err);
        setErrorProjects(err.message || "Impossible de charger les projets.");
        setProjects([]); 
      } finally {
        setIsLoadingProjects(false); 
      }
    }, [user, pageSize] 
  );



  useEffect(() => {
    console.log("ProjectPage useEffect triggered. isLoadingAuth:", isLoadingAuth, "User:", !!user);

    if (!isLoadingAuth) {
      if (user && user.id) {

        console.log("useEffect: Auth ready, user found. Calling fetchProjects.");
        fetchProjects(0); 
      } else {

        console.log("useEffect: Auth ready, no user found.");
        setIsLoadingProjects(false);
        setProjects([]); 
        setTotalPages(0);
        setCurrentPage(0);
        setErrorProjects(null); 
      }
    } else {

       console.log("useEffect: Waiting for authentication to complete...");
  
    }
  
  }, [user, isLoadingAuth, fetchProjects]); 


 function handleOpenNewProjectModal() {
    if (!isLoadingAuth && user && user.id) {
      setIsModalOpen(true);
    } else if (isLoadingAuth) {
      toast.info("Please wait, verifying user session...");
    } else {
      toast.error("You must be logged in to create a new project.");
    }
 }


  const handleProjectCreationSuccess = useCallback(() => {
    setIsModalOpen(false);
     toast.info("Refreshing project list...");

    console.log("Project created. Refetching project list now!");
    fetchProjects(0); 
  }, [fetchProjects]); 

  return (
 
    <div className="m-1 p-5 w-full h-screen overflow-y-auto flex flex-col">
      <PageHeader
        title="PROJECTS"
        subtitle="MANAGE_YOUR_CREATIVE_PROJECTS"
        buttonText="NEW_PROJECT"
        onActionClick={handleOpenNewProjectModal} 
      />


      {isModalOpen && user && ( 
          <ProjectCreateNewModal
            isOpen={isModalOpen}
            onOpenChange={setIsModalOpen}
            onProjectCreated={handleProjectCreationSuccess}
            user={user} 
          />
      )}


      <div className="flex flex-col flex-grow gap-4 mt-4">
          <ProjectListHeader />

          {isLoadingAuth ? ( 
             <div className="flex justify-center items-center py-10 text-zinc-400"> <Loader2 className="h-8 w-8 animate-spin mr-3"/> Loading user data... </div>
          ) : isLoadingProjects ? ( 
             <div className="flex justify-center items-center py-10 text-zinc-400"> <Loader2 className="h-8 w-8 animate-spin mr-3"/> Loading projects... </div>
          ) : errorProjects ? ( 
            <div className="text-center text-red-500 py-10">Error loading projects: {errorProjects}</div>
          ) : projects.length > 0 ? ( 
            <ProjectCardList userId={user.id} projects={projects} />
          ) : ( 
            <div className="text-center text-zinc-500 py-10">No projects found.</div>
          )}
      </div>
        {/* TODO: Ajouter la pagination ici si totalPages > 1 */}
    </div>
  );
}