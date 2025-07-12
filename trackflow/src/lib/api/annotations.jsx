/**
 * @file API functions for handling annotations.
 */
import fetcher from "./api-helpers";

/**
 * Creates a new annotation for a specific version.
 * Corresponds to: POST /api/versions/{versionId}/annotations
 *
 * @param {object} params - The parameters for the API call.
 * @param {string} params.versionId - The ID of the parent version.
 * @param {object} params.annotationData - The data for the new annotation (AnnotationCreateDto).
 * @returns {Promise<object>} A promise that resolves to the created annotation view (AnnotationViewDto).
 * @throws {Error} Throws an error if the fetch operation fails.
 */
export async function createAnnotation({ versionId, annotationData }) {
  const endpoint = `/api/versions/${versionId}/annotations`;
  try {
    return await fetcher(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(annotationData),
    });
  } catch (error) {
    console.error("Failed to create annotation:", error);
    throw new Error("Could not create the new annotation.");
  }
}

/**
 * Retrieves all annotations for a specific version.
 * Corresponds to: GET /api/versions/{versionId}/annotations
 *
 * @param {object} params - The parameters for the API call.
 * @param {string} params.versionId - The ID of the parent version.
 * @returns {Promise<Array<object>>} A promise that resolves to a list of annotation views (AnnotationViewDto[]).
 * @throws {Error} Throws an error if the fetch operation fails.
 */
export async function getAnnotationsByVersionId({ versionId }) {
  if (!versionId) return [];
  const endpoint = `/api/versions/${versionId}/annotations`;
  try {
    return await fetcher(endpoint);
  } catch (error) {
    console.error(
      `Failed to fetch annotations for version ${versionId}:`,
      error
    );
    throw new Error(`Could not load annotations for version ${versionId}.`);
  }
}

/**
 * Updates an existing annotation.
 * Corresponds to: PATCH /api/annotations/{annotationId}
 *
 * @param {object} params - The parameters for the API call.
 * @param {string} params.annotationId - The ID of the annotation to update.
 * @param {object} params.updateData - The data for the update (AnnotationUpdateDto).
 * @returns {Promise<object>} A promise that resolves to the updated annotation view (AnnotationViewDto).
 * @throws {Error} Throws an error if the fetch operation fails.
 */
export async function updateAnnotation({ annotationId, updateData }) {
  const endpoint = `/api/annotations/${annotationId}`;
  try {
    return await fetcher(endpoint, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });
  } catch (error) {
    console.error(`Failed to update annotation ${annotationId}:`, error);
    throw new Error(`Could not update annotation ${annotationId}.`);
  }
}

/**
 * Deletes an annotation.
 * Corresponds to: DELETE /api/annotations/{annotationId}
 *
 * @param {object} params - The parameters for the API call.
 * @param {string} params.annotationId - The ID of the annotation to delete.
 * @returns {Promise<void>} A promise that resolves when the operation is complete.
 * @throws {Error} Throws an error if the fetch operation fails.
 */
export async function deleteAnnotation({ annotationId }) {
  const endpoint = `/api/annotations/${annotationId}`;
  try {
    await fetcher(endpoint, { method: "DELETE" });
  } catch (error) {
    console.error(`Failed to delete annotation ${annotationId}:`, error);
    throw new Error(`Could not delete annotation ${annotationId}.`);
  }
}
