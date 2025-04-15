"use client";

import PageHeader from "@/components/pageHeader/PageHeader";
import ProjectCreateNewModal from "@/components/modals/ProjectCreateNewModal"; // Adaptez chemin si besoin
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext"; // Adaptez chemin si besoin
import { getRecentProjects } from "@/lib/api/projects"; // Adaptez chemin si besoin
import ProjectCardList from "@/components/projects/ProjectCardList"; // Adaptez chemin si besoin
import { toast } from "sonner"; // Importer toast pour les messages

export default function DashboardPage() {
  const { user, isLoading: isLoadingAuth, error: errorAuth } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recentProjects, setRecentProjects] = useState([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [errorProjects, setErrorProjects] = useState(null);

  console.log("DashboardPage - Current user state:", user);
  console.log("DashboardPage - Auth loading state:", isLoadingAuth);
  console.log("DashboardPage - Recent Projects:", recentProjects);

  useEffect(() => {
    if (!isLoadingAuth && user && user.login) {
      const apiParams = {
        page: 0,
        size: 4,
        sort: "createdDate,desc",
        login: user.login,
      };

      console.log(
        `Dashboard useEffect: User ready (ID: ${user.id}). Fetching recent projects...`,
        apiParams
      );

      const fetchRecentProjects = async () => {
        setIsLoadingProjects(true);
        setErrorProjects(null);

        try {
          const projects = await getRecentProjects(apiParams);
          setRecentProjects(projects || []);
        } catch (error) {
          console.error("Failed to fetch recent projects:", error);
          setErrorProjects("Impossible de charger les projets récents.");
          setRecentProjects([]);
        } finally {
          setIsLoadingProjects(false);
        }
      };

      fetchRecentProjects();
    } else if (!isLoadingAuth) {
      console.log(
        "Dashboard useEffect: Auth loaded, but no user logged in or user ID missing."
      );
      setIsLoadingProjects(false);
      setRecentProjects([]);
    } else {
      console.log("Dashboard useEffect: Waiting for authentication...");
    }
  }, [user, isLoadingAuth]);

  function handleOpenNewProjectModal() {
    if (!isLoadingAuth && user && user.id) {
      setIsModalOpen(true);
    } else if (isLoadingAuth) {
      toast.info("Please wait, verifying user session...");
    } else {
      toast.error("You must be logged in to create a new project.");
    }
  }

  const handleProjectCreated = () => {
    console.log(
      "DashboardPage: Project created! Refreshing recent projects..."
    );
    setIsModalOpen(false);

    if (user && user.id) {
      const fetchAgain = async () => {
        setIsLoadingProjects(true);
        setErrorProjects(null);
        try {
          const apiParams = {
            page: 0,
            size: 4,
            sort: "createdDate,desc",
            userId: user.id,
          };
          const projects = await getRecentProjects(apiParams);
          setRecentProjects(projects || []);
        } catch (error) {
          console.error("Refresh failed:", error);
          setErrorProjects("Refresh failed.");
        } finally {
          setIsLoadingProjects(false);
        }
      };
      fetchAgain();
    }
  };

  return (
    <div className="m-1 p-5 h-screen w-full flex flex-col">
      <PageHeader
        title="DASHBOARD"
        subtitle="WELCOME_TO_YOUR_CREATIVE_SPACE"
        buttonText="NEW_PROJECT"
        onActionClick={handleOpenNewProjectModal}
      />

      {isModalOpen && user && (
        <ProjectCreateNewModal
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
          onProjectCreated={handleProjectCreated}
          user={user}
        />
      )}

      <div className="flex flex-col flex-grow gap-4 mt-4">
        <div className="flex w-full border justify-center items-center border-gray-300 p-4 h-20 bg-zinc-800 text-zinc-500">
          {" "}
          {/* Style placeholder */}[ PLAYER TRACK PLACEHOLDER ]
        </div>

        <div className="flex flex-col w-full gap-2 mt-4">
          <div className="flex border-t w-52 border-t-gray-300 pt-1 text-xl glow-text">
            RECENTS_PROJECTS
          </div>

          {isLoadingProjects ? (
            <div className="text-center text-zinc-400 py-4">
              Loading recent projects...
            </div>
          ) : errorProjects ? (
            <div className="text-center text-red-500 py-4">{errorProjects}</div>
          ) : recentProjects.length > 0 ? (
            <ProjectCardList projects={recentProjects} />
          ) : (
            <div className="text-center text-zinc-500 py-4">
              No recent projects found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
