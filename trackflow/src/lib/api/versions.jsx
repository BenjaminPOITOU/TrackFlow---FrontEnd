import fetcher from "./api-helpers";

/**
 * Creates a new version within a specific branch.
 * Corresponds to: POST /api/projects/{projectId}/compositions/{compositionId}/branches/{branchId}/versions
 *
 * @param {object} params
 * @param {number} params.projectId - The ID of the parent project.
 * @param {number} params.compositionId - The ID of the parent composition.
 * @param {number} params.branchId - The ID of the parent branch.
 * @param {object} params.versionData - The data for the new version (VersionCreateDto).
 * @returns {Promise<object>} A promise that resolves to the created version view (VersionViewDto).
 */
export async function createVersion({ projectId, compositionId, branchId, versionData }) {
  const endpoint = `/api/projects/${projectId}/compositions/${compositionId}/branches/${branchId}/versions`;
  try {
    return await fetcher(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(versionData),
    });
  } catch (error) {
    console.error("Failed to create version:", error);
    throw new Error("Could not create the new version.");
  }
}

/**
 * Retrieves all versions for a specific branch in a summary format.
 * Corresponds to: GET /api/projects/{projectId}/compositions/{compositionId}/branches/{branchId}/versions
 *
 * @param {object} params
 * @param {number} params.projectId - The ID of the parent project.
 * @param {number} params.compositionId - The ID of the parent composition.
 * @param {number} params.branchId - The ID of the branch.
 * @returns {Promise<Array<object>>} A promise that resolves to a list of version summaries (VersionSummaryDto[]).
 */
export async function getVersionsByBranch({ projectId, compositionId, branchId }) {
  const endpoint = `/api/projects/${projectId}/compositions/${compositionId}/branches/${branchId}/versions`;
  try {
    return await fetcher(endpoint);
  } catch (error) {
    console.error("Failed to fetch versions for branch:", error);
    throw new Error("Could not load the list of versions.");
  }
}


/**
 * Retrieves the latest version for a specific branch.
 * Corresponds to the API endpoint:
 * GET /api/projects/{projectId}/compositions/{compositionId}/branches/{branchId}/versions/latest
 *
 * @param {object} params - The parameters for the API call.
 * @param {string} params.projectId - The ID of the parent project.
 * @param {string} params.compositionId - The ID of the parent composition.
 * @param {string} params.branchId - The ID of the branch to fetch the latest version from.
 * @returns {Promise<object>} A promise that resolves to the latest version view DTO (VersionViewDto).
 * @throws {Error} Throws an error if the fetch operation fails.
 */
export async function getLatestVersionByBranch({ projectId, compositionId, branchId }) {
  const endpoint = `/api/projects/${projectId}/compositions/${compositionId}/branches/${branchId}/versions/latest`;
  try {
    return await fetcher(endpoint);
  } catch (error) {
    console.error("Failed to fetch the latest version:", error);
    throw new Error("Could not load the latest version.");
  }
}
/**
 * Retrieves a single, detailed version by its ID.
 * Corresponds to: GET /api/projects/{projectId}/compositions/{compositionId}/branches/{branchId}/versions/{versionId}
 *
 * @param {object} params
 * @param {number} params.projectId - The ID of the parent project.
 * @param {number} params.compositionId - The ID of the parent composition.
 * @param {number} params.branchId - The ID of the parent branch.
 * @param {number} params.versionId - The ID of the version to retrieve.
 * @returns {Promise<object>} A promise that resolves to the detailed version view (VersionViewDto).
 */
export async function getVersionById({ projectId, compositionId, branchId, versionId }) {
  const endpoint = `/api/projects/${projectId}/compositions/${compositionId}/branches/${branchId}/versions/${versionId}`;
  try {
    return await fetcher(endpoint);
  } catch (error) {
    console.error(`Failed to fetch version ${versionId}:`, error);
    throw new Error(`Could not load version ${versionId}.`);
  }
}

/**
 * Partially updates an existing version.
 * Corresponds to: PATCH /api/projects/{projectId}/compositions/{compositionId}/branches/{branchId}/versions/{versionId}
 *
 * @param {object} params
 * @param {number} params.projectId - The ID of the parent project.
 * @param {number} params.compositionId - The ID of the parent composition.
 * @param {number} params.branchId - The ID of the parent branch.
 * @param {number} params.versionId - The ID of the version to update.
 * @param {object} params.updateData - The data for the update (VersionUpdateDto).
 * @returns {Promise<object>} A promise that resolves to the updated version view (VersionViewDto).
 */
export async function updateVersion({ projectId, compositionId, branchId, versionId, updateData }) {
  const endpoint = `/api/projects/${projectId}/compositions/${compositionId}/branches/${branchId}/versions/${versionId}`;
  try {
    return await fetcher(endpoint, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateData),
    });
  } catch (error) {
    console.error(`Failed to update version ${versionId}:`, error);
    throw new Error(`Could not update version ${versionId}.`);
  }
}

/**
 * Deletes a version.
 * Corresponds to: DELETE /api/projects/{projectId}/compositions/{compositionId}/branches/{branchId}/versions/{versionId}
 *
 * @param {object} params
 * @param {number} params.projectId - The ID of the parent project.
 * @param {number} params.compositionId - The ID of the parent composition.
 * @param {number} params.branchId - The ID of the parent branch.
 * @param {number} params.versionId - The ID of the version to delete.
 * @returns {Promise<void>}
 */
export async function deleteVersion({ projectId, compositionId, branchId, versionId }) {
  const endpoint = `/api/projects/${projectId}/compositions/${compositionId}/branches/${branchId}/versions/${versionId}`;
  try {
    return await fetcher(endpoint, { method: "DELETE" });
  } catch (error) {
    console.error(`Failed to delete version ${versionId}:`, error);
    throw new Error(`Could not delete version ${versionId}.`);
  }
}