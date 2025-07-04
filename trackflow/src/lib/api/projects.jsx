import fetcher from "./api-helpers";
/**
 * Creates a new project for a specified user.
 * It sends project data to the backend API via a POST request.
 *
 * @async
 * @function sendCreatedProject
 * @param {string|number} userId - The unique identifier of the user creating the project.
 * @param {object} projectData - An object containing the details of the project to be created.
 * @returns {Promise<object>} A promise that resolves to the newly created project object returned by the API.
 * @throws {Error} Re-throws any errors from the `fetcher` helper, which can occur due to network issues or non-OK HTTP responses.
 */
export async function sendCreatedProject(userId, projectData) {
  const endpoint = `/api/users/${userId}/projects`;
  const fetchOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(projectData),
  };

  try {
    const createdProject = await fetcher(endpoint, fetchOptions);
    console.log("Project created successfully:", createdProject);
    return createdProject;
  } catch (error) {
    console.error("Failed to send created project:", error.message);
    throw error;
  }
}

/**
 * Fetches a paginated list of projects for the currently authenticated user.
 * This function must be executed on the server, as it reads HttpOnly cookies.
 * It retrieves the auth token and uses the `fetcher` helper to call the `/api/projects/me` endpoint.
 *
 * @async
 * @function getAllProjects
 * @param {object} options - The pagination and sorting options for the request.
 * @param {number} options.page - The page number to fetch (0-indexed).
 * @param {number} options.size - The number of items to retrieve per page.
 * @param {string} options.sort - The sorting criteria for the results (e.g., "createdDate,desc").
 * @returns {Promise<object>} A promise that resolves to the paginated list of projects from the API.
 * @throws {Error} Throws an error if the 'auth-token' is not found in the cookies.
 * @throws {Error} Re-throws any errors from the `fetcher` helper.
 */
export async function getAllProjects({ page, size, sort }, authToken) {
  if (!authToken) {
    throw new Error(
      "Authentication token not found. User must be logged in to perform this action."
    );
  }

  const queryParams = new URLSearchParams({ page, size, sort }).toString();
  const endpoint = `/api/projects/me?${queryParams}`;

  const fetchOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
    cache: "no-store",
  };

  return fetcher(endpoint, fetchOptions);
}
/**
 * Fetches a single project by its ID for a specific user.
 *
 * @async
 * @function getProjectById
 * @param {string|number} userId - The unique identifier of the user.
 * @param {string|number} projectId - The unique identifier of the project to fetch.
 * @returns {Promise<object>} A promise that resolves to the project data object.
 * @throws {Error} Re-throws any errors from the `fetcher` helper.
 */
export async function getProjectById(userId, projectId) {
  const endpoint = `/api/users/${userId}/projects/${projectId}`;
  try {
    const data = await fetcher(endpoint, { method: "GET" });
    return data;
  } catch (error) {
    console.error(
      `getProjectById: Failed to fetch project ${projectId} for user ${userId}.`,
      error.message
    );
    throw error;
  }
}

/**
 * Updates a project with new details using a PATCH request.
 *
 * @async
 * @function updateProjectById
 * @param {string|number} userId - The unique identifier of the user.
 * @param {string|number} projectId - The unique identifier of the project to update.
 * @param {object} projectDetailsToUpdate - An object containing the project fields to be updated.
 * @returns {Promise<object | void>} A promise that resolves to the updated project data. It may resolve to `undefined` if the API returns a 204 No Content response.
 * @throws {Error} Re-throws any errors from the `fetcher` helper.
 */
export async function updateProjectById(
  userId,
  projectId,
  projectDetailsToUpdate
) {
  const endpoint = `/api/users/${userId}/projects/${projectId}`;
  const fetchOptions = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(projectDetailsToUpdate),
  };
  try {
    const data = await fetcher(endpoint, fetchOptions);
    return data;
  } catch (error) {
    console.error(
      `[updateProjectById] ERREUR lors de la mise à jour du projet ${projectId}:`,
      error.message
    );
    throw error;
  }
}

/**
 * Archives a project by its ID via a POST request to the archive endpoint.
 *
 * @async
 * @function archiveProjectById
 * @param {string|number} userId - The unique identifier of the user.
 * @param {string|number} projectId - The unique identifier of the project to archive.
 * @returns {Promise<object | void>} A promise that resolves with the API response. It may be `undefined` for 204 No Content responses.
 * @throws {Error} Re-throws any errors from the `fetcher` helper.
 */
export async function archiveProjectById(userId, projectId) {
  const endpoint = `/api/users/${userId}/projects/${projectId}/archive`;
  const fetchOptions = {
    method: "POST",
  };

  try {
    const data = await fetcher(endpoint, fetchOptions);
    console.log(`archiveProjectById: Success for project ${projectId}.`);
    return data || { success: true };
  } catch (error) {
    console.error(
      `archiveProjectById: CATCH block error for project ${projectId}.`,
      error.message
    );
    throw error;
  }
}

/**
 * Permanently deletes a project by its ID.
 *
 * @async
 * @function deleteProjectById
 * @param {string|number} userId - The unique identifier of the user.
 * @param {string|number} projectId - The unique identifier of the project to delete.
 * @returns {Promise<void>} A promise that resolves when the deletion is successful. The `fetcher` will return `undefined` for a 204 No Content response.
 * @throws {Error} Re-throws any errors from the `fetcher` helper.
 */
export async function deleteProjectById(userId, projectId) {
  const endpoint = `/api/users/${userId}/projects/${projectId}`;
  const fetchOptions = {
    method: "DELETE",
  };

  try {
    await fetcher(endpoint, fetchOptions);
    console.log(`deleteProjectById: Success for project ${projectId}.`);
    return { success: true };
  } catch (error) {
    console.error(
      `deleteProjectById: CATCH block error for project ${projectId}.`,
      error.message
    );
    throw error;
  }
}
