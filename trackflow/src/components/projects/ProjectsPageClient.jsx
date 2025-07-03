"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import ProjectListPageHeader from "./ProjectListPageHeader";
import ProjectCreateModal from "@/components/modals/projectCreateModal/ProjectCreateModal";
import { ProjectListHeader } from "@/components/projects/ProjectListHeader";
import ProjectCardList from "@/components/projects/ProjectCardList";

/**
 * Client-side component for the projects page.
 * Manages all user interactions, such as opening the creation modal,
 * and handles data refreshing after actions. It uses the useAuth hook
 * to get user session information.
 * @param {object} props - The component props.
 * @param {Array} props.initialProjects - The list of projects fetched from the server.
 * @param {string|null} props.error - An error message if the initial fetch failed.
 * @returns {JSX.Element} The interactive projects page UI.
 */
export default function ProjectsPageClient({ initialProjects, error }) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProjectCreationSuccess = () => {
    setIsModalOpen(false);
    toast.success("Project created! Refreshing list...");
    router.refresh();
  };

  const handleOpenModal = () => {
    if (isAuthenticated) {
      setIsModalOpen(true);
    } else {
      toast.error("You must be logged in to create a project.");
    }
  };

  return (
    <div className="flex w-full flex-col">
      <ProjectListPageHeader onActionClick={handleOpenModal} />

      {isAuthenticated && (
        <ProjectCreateModal
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
          onProjectCreated={handleProjectCreationSuccess}
        />
      )}

      <div className="mt-4 flex flex-grow flex-col gap-4">
        <ProjectListHeader />
        {error ? (
          <div className="py-10 text-center text-destructive">{error}</div>
        ) : initialProjects && initialProjects.length > 0 ? (
          <ProjectCardList projects={initialProjects} />
        ) : (
          <div className="py-10 text-center text-muted-foreground">
            Aucun projet trouvé. Commencez par en créer un nouveau !
          </div>
        )}
      </div>
    </div>
  );
}