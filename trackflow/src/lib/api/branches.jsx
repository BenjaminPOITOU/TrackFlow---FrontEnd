import fetcher from "./api-helpers";

/**
 * Creates a new branch for a specific composition.
 * Corresponds to: POST /api/projects/{projectId}/compositions/{compositionId}/branches
 *
 * @param {object} params
 * @param {number} params.projectId - The ID of the parent project.
 * @param {number} params.compositionId - The ID of the parent composition.
 * @param {object} params.branchData - The data for the new branch (BranchCreateDto).
 * @returns {Promise<object>} A promise that resolves to the created branch summary (BranchSummaryDto).
 */
export async function createBranch({ projectId, compositionId, branchData }) {
  const endpoint = `/api/projects/${projectId}/compositions/${compositionId}/branches`;
  try {
    return await fetcher(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(branchData),
    });
  } catch (error) {
    console.error("Failed to create branch:", error);
    throw new Error("Could not create the new branch.");
  }
}

/**
 * Retrieves a list of all branches for a specific composition.
 * Corresponds to: GET /api/projects/{projectId}/compositions/{compositionId}/branches
 *
 * @param {object} params
 * @param {number} params.projectId - The ID of the parent project.
 * @param {number} params.compositionId - The ID of the parent composition.
 * @returns {Promise<Array<object>>} A promise that resolves to a list of branch summaries (BranchSummaryDto[]).
 */
export async function getBranchesByComposition({ projectId, compositionId }) {
  const endpoint = `/api/projects/${projectId}/compositions/${compositionId}/branches`;
  try {
    return await fetcher(endpoint);
  } catch (error) {
    console.error("Failed to fetch branches:", error);
    throw new Error("Could not load the list of branches.");
  }
}

/**
 * Partially updates an existing branch.
 * Corresponds to: PATCH /api/projects/{projectId}/compositions/{compositionId}/branches/{branchId}
 *
 * @param {object} params
 * @param {number} params.projectId - The ID of the parent project.
 * @param {number} params.compositionId - The ID of the parent composition.
 * @param {number} params.branchId - The ID of the branch to update.
 * @param {object} params.updateData - The data for the update (BranchUpdateDto).
 * @returns {Promise<object>} A promise that resolves to the updated branch summary (BranchSummaryDto).
 */
export async function updateBranch({ projectId, compositionId, branchId, updateData }) {
  const endpoint = `/api/projects/${projectId}/compositions/${compositionId}/branches/${branchId}`;
  try {
    return await fetcher(endpoint, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateData),
    });
  } catch (error) {
    console.error(`Failed to update branch ${branchId}:`, error);
    throw new Error(`Could not update branch ${branchId}.`);
  }
}