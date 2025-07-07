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
  console.log('📄 [ProjectsPage] Début de la page');
  
  const { user, authToken, isTokenExpired } = await getUserSession();
  
  console.log('📄 [ProjectsPage] Résultat getUserSession:', {
    hasUser: !!user,
    hasToken: !!authToken,
    isTokenExpired
  });

  if (!user || isTokenExpired) {
    console.log('🚫 [ProjectsPage] Redirection vers login - user:', !!user, 'expired:', isTokenExpired);
    redirect('/');
  }

  console.log('✅ [ProjectsPage] Utilisateur authentifié, chargement des projets');

  let initialData = { content: [] };
  let error = null;

  try {
    console.log('🔄 [ProjectsPage] Appel getAllProjects...');
    initialData = await getAllProjects({ page: 0, size: 12, sort: "createdDate,desc" }, authToken);
    console.log('✅ [ProjectsPage] Projets chargés:', initialData.content?.length || 0, 'projets');
  } catch (err) {
    console.error('❌ [ProjectsPage] Erreur chargement projets:', err);
    error = err.message || "Impossible de charger les projets. Veuillez réessayer.";
  }

  console.log('🎉 [ProjectsPage] Rendu du composant client');
  return (
    <ProjectsPageClient
      initialProjects={initialData.content}
      error={error}
      authToken={authToken}
    />
  );
}