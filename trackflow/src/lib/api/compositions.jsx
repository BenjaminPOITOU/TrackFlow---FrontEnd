import fetcher from './api-helpers'; // Adjust the path to your fetcher helper

/**
 * @file API service functions for managing compositions and their versions.
 * All functions use a centralized fetcher helper to interact with the API.
 */

/**
 * Fetches all compositions associated with a specific project ID.
 *
 * @async
 * @function getCompositionsByProjectId
 * @param {string|number} projectId - The unique identifier of the project.
 * @returns {Promise<object[]>} A promise that resolves to an array of composition objects.
 * @throws {Error} Throws an error if `projectId` is not provided. Re-throws any errors from the `fetcher` helper.
 */
export async function getCompositionsByProjectId(projectId) {
  if (!projectId) {
    throw new Error("getCompositionsByProjectId requires a projectId.");
  }
  const endpoint = `/api/projects/${projectId}/compositions`;
  try {
    return await fetcher(endpoint);
  } catch (error) {
    console.error(`getCompositionsByProjectId: Failed for project ${projectId}.`, error.message);
    throw error;
  }
}

/**
 * Permanently deletes a composition by its ID.
 *
 * @async
 * @function deleteCompositionById
 * @param {string|number} projectId - The unique identifier of the parent project.
 * @param {string|number} compositionId - The unique identifier of the composition to delete.
 * @returns {Promise<{success: boolean}>} A promise that resolves to a success object upon successful deletion.
 * @throws {Error} Throws an error if arguments are missing. Re-throws any errors from the `fetcher` helper.
 */
export async function deleteCompositionById(projectId, compositionId) {
  if (!projectId || !compositionId) {
    throw new Error("deleteCompositionById requires a projectId and a compositionId.");
  }
  const endpoint = `/api/projects/${projectId}/compositions/${compositionId}`;
  try {
    await fetcher(endpoint, { method: "DELETE" });
    return { success: true };
  } catch (error) {
    console.error(`deleteCompositionById: Failed for composition ${compositionId}.`, error.message);
    throw error;
  }
}

/**
 * Creates a new composition within a specified project.
 *
 * @async
 * @function createComposition
 * @param {string|number} projectId - The unique identifier of the project where the composition will be created.
 * @param {object} formData - An object containing the data for the new composition.
 * @returns {Promise<object>} A promise that resolves to the newly created composition object returned by the API.
 * @throws {Error} Throws an error if `projectId` is not provided. Re-throws any errors from the `fetcher` helper.
 */
export async function createComposition(projectId, formData) {
  if (!projectId) {
    throw new Error("createComposition requires a projectId.");
  }
  const endpoint = `/api/projects/${projectId}/compositions`;
  const fetchOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  };
  try {
    return await fetcher(endpoint, fetchOptions);
  } catch (error) {
    console.error(`createComposition: Failed for project ${projectId}.`, error.message);
    throw error;
  }
}

/**
 * Fetches a single composition by its unique ID.
 *
 * @async
 * @function getCompositionById
 * @param {string|number} projectId - The unique identifier of the parent project.
 * @param {string|number} compositionId - The unique identifier of the composition to fetch.
 * @returns {Promise<object>} A promise that resolves to the composition data object.
 * @throws {Error} Throws an error if arguments are missing. Re-throws any errors from the `fetcher` helper.
 */
export async function getCompositionById(projectId, compositionId) {
  if (!projectId || !compositionId) {
    throw new Error("getCompositionById requires a projectId and a compositionId.");
  }
  const endpoint = `/api/projects/${projectId}/compositions/${compositionId}`;
  try {
    return await fetcher(endpoint);
  } catch (error) {
    console.error(`getCompositionById: Failed for composition ${compositionId}.`, error.message);
    throw error;
  }
}

/**
 * Updates an existing composition with new data using a PATCH request.
 *
 * @async
 * @function updateCompositionById
 * @param {string|number} projectId - The unique identifier of the parent project.
 * @param {string|number} compositionId - The unique identifier of the composition to update.
 * @param {object} compositionUpdated - An object containing the fields of the composition to be updated.
 * @returns {Promise<object>} A promise that resolves to the updated composition object.
 * @throws {Error} Throws an error if arguments are missing. Re-throws any errors from the `fetcher` helper.
 */
export async function updateCompositionById(projectId, compositionId, compositionUpdated) {
  if (!projectId || !compositionId) {
    throw new Error("updateCompositionById requires a projectId and a compositionId.");
  }
  const endpoint = `/api/projects/${projectId}/compositions/${compositionId}`;
  const fetchOptions = {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(compositionUpdated),
  };
  try {
    return await fetcher(endpoint, fetchOptions);
  } catch (error) {
    console.error(`updateCompositionById: Failed for composition ${compositionId}.`, error.message);
    throw error;
  }
}

/**
 * Fetches all versions associated with a specific composition ID.
 *
 * @async
 * @function getVersionsByCompositionId
 * @param {string|number} compositionId - The unique identifier of the composition.
 * @returns {Promise<object[]>} A promise that resolves to an array of version objects.
 * @throws {Error} Throws an error if `compositionId` is not provided. Re-throws any errors from the `fetcher` helper.
 */
export async function getVersionsByCompositionId(compositionId) {
  if (!compositionId) {
    throw new Error("getVersionsByCompositionId requires a compositionId.");
  }
  const endpoint = `/api/compositions/${compositionId}/versions`;
  try {
    return await fetcher(endpoint);
  } catch (error) {
    console.error(`getVersionsByCompositionId: Failed for composition ${compositionId}.`, error.message);
    throw error;
  }
}