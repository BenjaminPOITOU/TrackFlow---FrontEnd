"use client";

import React from "react";
import PageHeader from "@/components/pageHeader/PageHeader";
import { useState } from "react";
import ProjectCreateNewModal from "@/components/modals/ProjectCreateNewModal";
import ProjectCard from "@/components/projects/ProjectCard";
import ProjectHeader from "@/components/projects/ProjectHeader";

export default function ProjectPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  function handleOpenNewProjectModal() {
    setIsModalOpen(true);
  }

  return (
    <div className="m-1 px-5 w-full">
      <PageHeader
        title="PROJECTS"
        subtitle="MANAGE_YOUR_CREATIVE_PROJECTS"
        buttonText="NEW_PROJECT"
        onActionClick={() => handleOpenNewProjectModal()}
      ></PageHeader>

      <ProjectHeader />

      <ProjectCreateNewModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />

      <ProjectCard />
    </div>
  );
}
