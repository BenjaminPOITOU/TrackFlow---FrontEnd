const NEXT_PUBLIC_API_URL="http://localhost:8080"
const NEXT_INTERNAL_API_URL="http://localhost:3000"

/**
 * A generic fetcher function that handles API requests and responses.
 * It automatically prepends the API base URL and handles response parsing and HTTP errors.
 *
 * @param {string} endpoint - The API endpoint to call (e.g., "/users/1").
 * @param {object} [options={}] - The options object for the fetch call (method, headers, body, etc.).
 * @returns {Promise<any>} A promise that resolves to the JSON parsed body of the response.
 * @throws {Error} Throws an error if the fetch call fails or the response is not ok.
 */
async function fetcher(endpoint, options = {}) {
  const response = await fetch(`${NEXT_PUBLIC_API_URL}${endpoint}`, options);

  if (response.ok) {
    if (response.status === 204) {
      return;
    }
    return response.json();
  } else {
    const errorBody = await response.text();
    const errorMessage = `HTTP error! Status: ${response.status}, Body: ${errorBody}`;
    throw new Error(errorMessage);
  }
}

export default fetcher;