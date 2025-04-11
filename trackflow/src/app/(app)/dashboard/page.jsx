"use client";

import PageHeader from "@/components/pageHeader/PageHeader";
import ProjectCreateNewModal from "@/components/modals/ProjectCreateNewModal";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getRecentProjects } from "@/lib/api/projects";
import ProjectCardList from "@/components/projects/ProjectCardList";

export default function DashboardPage() {
  const user = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recentProjects, setRecentProjects] = useState([]);
  const [isLoading, setIsLoading] = useState([false]);
  const [error, setError] = useState(null);

  console.log("user recent Projects : ", recentProjects);

  useEffect(() => {
    if (user && user.login) {

      const login = user.login;
      const apiParams = {
        page: 0,
        size: 4,
        sort: "createdDate,desc",
        login: login
      };

      console.log(
        `Dashboard useEffect: User ready (Login: ${login}). Fetching recent projects...`
      );

      const fetchRecentProjects = async () => {
        setIsLoading(true);
        setError(null);

        try {
          const projects = await getRecentProjects(apiParams);
          setRecentProjects(projects);
        } catch (error) {
          console.error("Failed to fetch recent projects:", error);
          setError("Impossible de charger les projets récents.");
          setRecentProjects([]);
        } finally {
          setIsLoading(false);
        }
      };

      fetchRecentProjects();
    } else {
      console.log(
        "Dashboard useEffect: User or user login/email not available yet."
      );
      setIsLoading(false);
      setRecentProjects([]);
    }
  }, [user]);

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
      <ProjectCardList projects={recentProjects} />
    </div>
  );
}
