"use client";

import { getProjectById } from "@/lib/api/projects";
import { useAuth } from "@/contexts/AuthContext";
import React, { useEffect, useState, use } from "react";
import PageHeader from "@/components/pageHeader/PageHeader";
import { ProjectDetails } from "@/components/projects/ProjectDetails";
import { CompositionList } from "@/components/compositions/CompositionList";
import CompositionCreateNewModal from "@/components/modals/CompositionCreateNewModal";
import { Loader2 } from "lucide-react";

export default function ProjectPage({ params }) {
  const projectId = use(params)?.projectId;
  const {
    user: authUser,
    isLoading: isLoadingAuth,
    error: errorAuth,
  } = useAuth();

  const [project, setProject] = useState(null);
  const [isLoadingProject, setIsLoadingProject] = useState(false);
  const [errorProject, setErrorProject] = useState(null);
  const [isCompositionModalOpen, setIsCompositionModalOpen] = useState(false);
  const [responseCreateModal, setResponseCreateModal] = useState(null);

  useEffect(() => {
    if (authUser?.id && projectId && !project) {
      fetchProject();
    }
  }, [authUser, projectId]);


  useEffect(() => {
    if (responseCreateModal && authUser?.id && projectId) {
      fetchProject();
      setResponseCreateModal(null);
    }
  }, [responseCreateModal]);

  const fetchProject = () => {
    setIsLoadingProject(true);

    getProjectById(authUser.id, projectId)
      .then((fetchedProject) => setProject(fetchedProject))
      .catch((err) =>
        setErrorProject(err.message || "Échec du chargement du projet")
      )
      .finally(() => setIsLoadingProject(false));
  };


  const handleOpenNewCompositionModal = () => {
    setIsCompositionModalOpen(true);
  };

  return (
    <div className="flex flex-col h-screen w-full gap-3 p-5">
      {/* En-tête de la page */}
      <div>
        {project ? (
          <PageHeader
            title={project.title}
            subtitle="PROJECT_DETAILS_AND_COMPOSITIONS"
            buttonText="NEW_COMPOSITION"
            onActionClick={handleOpenNewCompositionModal}
          />
        ) : (
          <PageHeader title="Project" subtitle="Details and Compositions" />
        )}
      </div>

      {/* Affichage du chargement */}
      {isLoadingProject && (
        <div className="flex justify-center items-center flex-grow">
          <Loader2 className="h-8 w-8 animate-spin mr-3" />
          <span>Loading project details...</span>
        </div>
      )}

      {/* Affichage des erreurs */}
      {(errorAuth || errorProject) && (
        <div className="p-6 text-center text-red-500 flex-grow">
          Error: {errorAuth || errorProject}
        </div>
      )}

      {/* Contenu principal */}
      {!isLoadingProject && !errorProject && project && (
        <>
          <CompositionCreateNewModal
            isOpen={isCompositionModalOpen}
            onOpenChange={setIsCompositionModalOpen}
            projectId={projectId}
            onResponseCreateCompositionChange={setResponseCreateModal}
          />

          <div className="flex flex-col gap-4 justify-center items-start mt-4">
            <ProjectDetails project={project} user={authUser} />
            <CompositionList projectId={projectId} />
          </div>
        </>
      )}
    </div>
  );
}
