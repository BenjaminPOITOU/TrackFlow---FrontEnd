import React from 'react';
import { redirect, notFound } from 'next/navigation';
import { getUserSession } from '@/lib/api/authService';
import { getProjectById } from '@/lib/api/projects';
import { getCompositionsByProjectId } from '@/lib/api/compositions';
import ProjectDetailPageClient from '@/components/projects/ProjectDetailPageClient';

/**
 * Server Component for the project detail page.
 * It fetches user session, project details, and compositions on the server.
 * It defers accessing the `params` properties until they are needed within
 * an asynchronous context, adhering to Next.js best practices for dynamic routes.
 * It also handles authorization and not-found states before rendering the client component.
 *
 * @param {object} props
 * @param {object} props.params - The dynamic URL parameters from Next.js.
 * @param {string} props.params.projectId - The ID of the project to display.
 * @returns {Promise<React.ReactElement>}
 */
export default async function ProjectDetailPage({ params }) {
    const { user } = await getUserSession();
    if (!user) {
        redirect('/');
    }

    try {
        const [projectData, compositionsData] = await Promise.all([
            getProjectById(user.id, params.projectId),
            getCompositionsByProjectId(params.projectId)
        ]);

        if (!projectData) {
            notFound();
        }

        return (
            <ProjectDetailPageClient
                initialProject={projectData}
                initialCompositions={compositionsData || []}
                user={user}
            />
        );
    } catch (error) {
        console.error(`[SERVER ERROR] Failed to load data for project ${params.projectId}:`, error);
        notFound();
    }
}