"use client";

import { getProjectById } from "@/lib/api/projects";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState, use } from "react";
import PageHeader from "@/components/pageHeader/PageHeader";
import { ProjectDetails } from "@/components/projects/ProjectDetails";

export default function compositionPage({ params }) {
  const resolvedParams = use(params);
  const projectId = resolvedParams.projectId;

  const user = useAuth();

  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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

  return (
    <div className="flex flex-col h-screen w-full gap-3 p-5">
      <div>
        <PageHeader
          title={project.title}
          subtitle="PROJECT_DETAILS_AND_COMPOSITIONS"
          buttonText="NEW_COMPOSITION"
          onActionClick={() => handleOpenNewProjectModal()}
        ></PageHeader>
      </div>
      <div className="">
        <ProjectDetails project={project} />
      </div>
    </div>
  );
}
