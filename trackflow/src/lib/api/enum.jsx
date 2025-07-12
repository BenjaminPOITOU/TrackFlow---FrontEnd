import fetcher from "./api-helpers";

/**
 * @file API service functions for retrieving enumerated types from the backend.
 * All functions use a centralized fetcher helper to interact with the API.
 */

/**
 * Fetches all project-related enums from the server in a single API call.
 * This is more efficient than making multiple separate requests for each enum type.
 *
 * @async
 * @function getProjectEnums
 * @returns {Promise<object>} A promise that resolves to an object containing all project-related enum lists (e.g., { types: [], statuses: [] }).
 * @throws {Error} Re-throws any errors from the `fetcher` helper, typically for network failures or non-OK HTTP responses.
 */
export async function getProjectEnums() {
  try {
    return await fetcher("/api/enums/projects");
  } catch (error) {
    console.error("Failed to fetch project enums:", error.message);
    throw error;
  }
}

/**
 * Fetches the list of possible statuses for a composition.
 *
 * @async
 * @function getCompositionStatuses
 * @returns {Promise<string[]>} A promise that resolves to an array of composition status strings.
 * @throws {Error} Re-throws any errors from the `fetcher` helper.
 */
export async function getCompositionStatuses() {
  try {
    return await fetcher("/api/enums/composition-statuses");
  } catch (error) {
    console.error("Failed to fetch CompositionStatuses:", error.message);
    throw error;
  }
}

/**
 * Fetches the list of possible categories for an annotation.
 *
 * @async
 * @function getAnnotationCategories
 * @returns {Promise<string[]>} A promise that resolves to an array of annotation category strings.
 * @throws {Error} Re-throws any errors from the `fetcher` helper.
 */
export async function getAnnotationCategories() {
  try {
    return await fetcher("/api/enums/annotation-categories");
  } catch (error) {
    console.error("Failed to fetch annotation-categories:", error.message);
    throw error;
  }
}

/**
 * Fetches the list of possible statuses for an annotation.
 *
 * @async
 * @function getAnnotationStatus
 * @returns {Promise<string[]>} A promise that resolves to an array of annotation status strings.
 * @throws {Error} Re-throws any errors from the `fetcher` helper.
 */
export async function getAnnotationStatus() {
  try {
    return await fetcher("/api/enums/annotation-statuses");
  } catch (error) {
    console.error("Failed to fetch annotation-statuses:", error.message);
    throw error;
  }
}

/**
 * Fetches all predefined version instruments from the `/api/enums/instruments` endpoint.
 *
 * @async
 * @function getInstruments
 * @returns {Promise<Array<{value: string, label: string}>>} A promise that resolves to a list of instrument objects, each with a `value` and `label` property.
 * @throws {Error} Re-throws any errors from the `fetcher` helper if the API call fails.
 */
export async function getInstruments() {
  try {
    return await fetcher("/api/enums/instruments");
  } catch (error) {
    console.error("Failed to fetch instruments:", error.message);
    throw new Error("Could not load the list of instruments.");
  }
}
