"use client";

import { getProjectById } from "@/lib/api/projects";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState, use, useCallback } from "react";
import PageHeader from "@/components/pageHeader/PageHeader";
import { ProjectDetails } from "@/components/projects/ProjectDetails";
import { CompositionList } from "@/components/compositions/CompositionList";
import CompositionCreateNewModal from "@/components/modals/CompositionCreateNewModal";

export default function compositionPage({ params }) {
  const resolvedParams = use(params);
  const projectId = resolvedParams.projectId;

  const user = useAuth();

  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  

  useEffect(() => {
    const userId = user.id;

    if (user && userId && projectId) {
      const fetchData = async () => {
        setIsLoading(true);
        setError(null);

        try {
          const fetchedProject = await getProjectById(userId, projectId);
          setProject(fetchedProject);
        } catch (err) {
          setError("Erreur chargement projet");
          console.log(err);
          console.error("Fetch error:", err);
          setProject(null);
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    } else {
      setIsLoading(false);
      setProject(null);
    }
  }, [user, projectId]);

  if (!project) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Projet non trouvé ou accès impossible.
      </div>
    );
  }
function handleOpenNewCompositionModal(){

  setIsModalOpen(!isModalOpen)
}
 



  return (
    <div className="flex flex-col h-screen w-full gap-3 p-5">
      <div>
        <PageHeader
          title={project.title}
          subtitle="PROJECT_DETAILS_AND_COMPOSITIONS"
          buttonText="NEW_COMPOSITION"
          onActionClick={() => handleOpenNewCompositionModal()}
        ></PageHeader>
      </div>
      <CompositionCreateNewModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        projectId={projectId}
            />
      <div className="flex flex-col gap-4 justify-center items-start">
        <ProjectDetails project={project} />
        <CompositionList projectId={projectId}/>
      </div>
    </div>
  );
}
