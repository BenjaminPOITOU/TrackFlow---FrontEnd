"use client";

import PageHeader from "@/components/pageHeader/PageHeader";
import ProjectCreateNewModal from "@/components/modals/ProjectCreateNewModal";
import { useState } from "react";

export default function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  function handleOpenNewProjectModal() {
    setIsModalOpen(true);
  }

  return (
    <div className="m-1 px-5 w-full">
      <PageHeader
        title="DASHBOARD"
        subtitle="WELCOME_TO_YOUR_CREATIVE_SPACE"
        buttonText="NEW_PROJECT"
        onActionClick={() => handleOpenNewProjectModal()}
      ></PageHeader>

      <ProjectCreateNewModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />

      <p className="mt-4">Contenu du Dashboard...</p>
    </div>
  );
}
