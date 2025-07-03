import { cookies } from 'next/headers';

// Exceptionnellement, on utilise une constante URL_BASE comme demandé.
const URL_BASE = "http://localhost:8080";

/**
 * @file API service for server-side project data fetching.
 */

/**
 * Fetches a paginated list of projects for the currently authenticated user.
 * This function is designed to be called only from Next.js Server Components.
 * It reads the 'auth-token' from HttpOnly cookies and sends it as a Bearer
 * token to the backend's '/api/projects/me' endpoint.
 *
 * @param {object} options - The pagination and sorting options.
 * @param {number} options.page - The page number to fetch (0-indexed).
 * @param {number} options.size - The number of items per page.
 * @param {string} options.sort - The sorting criteria (e.g., "createdDate,desc").
 * @returns {Promise<object>} A promise that resolves to the paginated list of projects.
 * @throws {Error} If the authentication token is not found or if the fetch operation fails.
 */
export async function getAllProjects({ page, size, sort }) {
  const cookieStore = await cookies();
  const authToken = cookieStore.get('auth-token')?.value;

  if (!authToken) {
    throw new Error('Authentication token not found. User must be logged in.');
  }

  const queryParams = new URLSearchParams({ page, size, sort }).toString();
  const url = `${URL_BASE}/api/projects/me?${queryParams}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${authToken}`,
    },
    cache: 'no-store' 
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`Failed to fetch projects. Status: ${response.status}. URL: ${url}. Body: ${errorBody}`);
    throw new Error(`Failed to fetch projects. Server responded with status ${response.status}.`);
  }

  return response.json();
}