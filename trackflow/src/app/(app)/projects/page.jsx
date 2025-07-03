import { redirect } from 'next/navigation';
import { getUserSession } from '@/lib/api/authService';
import { getAllProjects } from '@/lib/api/projectsServeur';
import ProjectsPageClient from '@/components/projects/ProjectsPageClient';

/**
 * @file The server-side page for displaying the list of projects.
 */
export default async function ProjectsPage({ searchParams }) {

  const { user, token } = await getUserSession();

  if (!user) {
    console.log("[PAGE /projects] - No user session found. Redirecting to /.");
    redirect('/');
  }
  
  console.log("[PAGE /projects] - User session is VALID. Proceeding to fetch projects.");

  const page = parseInt(searchParams?.page, 10) || 0;
  const size = parseInt(searchParams?.size, 10) || 12;
  const sort = searchParams?.sort || "createdDate,desc";

  let initialData = { content: [] };
  let error = null;

  try {
    initialData = await getAllProjects({ page, size, sort });
    console.log("[PAGE /projects] - Successfully fetched projects data.");
  } catch (err) {
    console.error("[PAGE /projects] - Failed to fetch initial projects data on the server:", err);
    error = err.message || "Could not load projects. Please try again.";
  }

  return (
    <ProjectsPageClient
      initialProjects={initialData.content}
      error={error}
      authToken={token} 
    />
  );
}