"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ProjectDetails } from "@/components/projects/ProjectDetails";
import { CompositionList } from "@/components/compositions/CompositionList";
import { CompositionCreateModal } from "@/components/modals/compositionCreateModal/CompositionCreateModal";
import CompositionListPageHeader from "@/components/compositions/CompositionListPageHeader";

/**
 * @file Client-side orchestrator for the project detail page.
 */

/**
 * Manages client-side state, user interactions (modals), and data refresh logic.
 * It receives its initial data from a Server Component parent.
 *
 * @param {object} props The component props.
 * @param {object} props.initialProject The initial project data.
 * @param {Array<object>} props.initialCompositions The initial list of compositions.
 * @param {object} props.user The current user object.
 * @returns {React.ReactElement} The rendered client-side page orchestrator.
 */
export default function ProjectDetailPageClient({
  initialProject,
  initialCompositions,
  user,
}) {
  const router = useRouter();

  const [project, setProject] = useState(initialProject);
  const [compositions, setCompositions] = useState(initialCompositions);
  const [isCompositionModalOpen, setIsCompositionModalOpen] = useState(false);

  useEffect(() => {
    setProject(initialProject);
    setCompositions(initialCompositions);
  }, [initialProject, initialCompositions]);

  const refreshPageData = useCallback(() => {
    router.refresh();
  }, [router]);

  const handleCompositionCreated = () => {
    refreshPageData();
  };

  const handleCompositionDeleted = () => {
    refreshPageData();
  };
  
  const handleCompositionUpdated = () => {
    refreshPageData();
  };

  const handleProjectUpdated = () => {
    refreshPageData();
  };

  return (
    <div className="flex flex-col h-full w-full gap-3 p-5">
      <CompositionListPageHeader
        title={project.title}
        onActionClick={() => setIsCompositionModalOpen(true)}
      />

      <CompositionCreateModal
        isOpen={isCompositionModalOpen}
        onOpenChange={setIsCompositionModalOpen}
        projectId={project.id}
        onCompositionCreated={handleCompositionCreated}
      />

      <div className="flex flex-col gap-4 justify-center items-start mt-4">
        <ProjectDetails
          project={project}
          user={user}
          onProjectUpdated={handleProjectUpdated}
        />
        <CompositionList
          projectId={project.id}
          compositions={compositions}
          onCompositionDeleted={handleCompositionDeleted}
          onCompositionUpdated={handleCompositionUpdated}
        />
      </div>
    </div>
  );
}