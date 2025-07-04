import { redirect } from 'next/navigation';
import { getUserSession } from '@/lib/api/authService';
import { getAllProjects } from '@/lib/api/projects';
import ProjectsPageClient from '@/components/projects/ProjectsPageClient';
import { Toaster } from 'sonner';

/**
 * @file Server-side page component for the list of projects.
 * This page handles authentication and initial data fetch.
 *
 * @param {Object} props - The page parameters.
 * @param {Record<string, string>} props.searchParams - The query parameters from the URL.
 * @returns {Promise<JSX.Element>} The rendered projects page.
 */
export default async function ProjectsPage() {
  const { user, authToken, isTokenExpired } = await getUserSession();

  if (!user || isTokenExpired) {
    redirect('/');
  }


  let initialData = { content: [] };
  let error = null;

  try {
    initialData = await getAllProjects({ page: 0, size: 12, sort: "createdDate,desc" }, authToken);
  } catch (err) {
    error = err.message || "Impossible de charger les projets. Veuillez réessayer.";
  }

  return (
    <ProjectsPageClient
      initialProjects={initialData.content}
      error={error}
      authToken={authToken}
    />
  );
}
