/**
 * The base URL for the TrackFlow API.
 * In a real-world application, this should come from an environment variable
 * (e.g., process.env.NEXT_PUBLIC_API_URL).
 */
const URL_BASE = "http://localhost:8080";

/**
 * @file API functions for retrieving enumerated types from the backend.
 */
import fetcher from "./api-helpers";
/**
 * Fetches all project-related enums from the server in a single API call.
 * This is more efficient than making multiple separate requests.
 * @returns {Promise<object>} A promise that resolves to an object containing all enum lists.
 * Example: { types: [], statuses: [], ... }
 */
export async function getProjectEnums() {
  try {
    const response = await fetch(`${URL_BASE}/api/enums/projects/enums`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch project enums:", error);
    throw error;
  }
}


export async function getCompositionStatuses() {
  try {
    const response = await fetch(`${URL_BASE}/api/enums/composition-statuses`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Failed to fetch CompositionStatuses:", error);
    throw error;
  }
}


export async function getAnnotationCategories() {
  try {
    const response = await fetch(`${URL_BASE}/api/enums/annotation-categories`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Failed to fetch annotation-categories:", error);
    throw error;
  }
}



export async function getAnnotationStatus() {
  try {
    const response = await fetch(`${URL_BASE}/api/enums/annotation-statuses`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Failed to fetch annotation-statuses:", error);
    throw error;
  }
}



/**
 * Fetches all predefined version instruments.
 * Corresponds to: GET /api/enums/instruments
 *
 * @returns {Promise<Array<{value: string, label: string}>>} A promise that resolves to a list of instruments.
 * The data is expected to be already in the correct format { value, label } from the API.
 * @throws {Error} Throws an error if the fetch operation fails.
 */
export async function getInstruments() {
  try {
    // The fetcher should already return the data in the correct format.
    // We trust the API and return the data directly.
    const instruments = await fetcher("/api/enums/instruments");
    return instruments;
  } catch (error) {
    console.error("Failed to fetch instruments:", error);
    throw new Error("Could not load the list of instruments.");
  }
}


