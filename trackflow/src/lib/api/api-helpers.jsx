/**
 * A generic fetcher function that handles API requests and responses.
 * It reads the base URL from the `NEXT_PUBLIC_API_URL` environment variable,
 * automatically prepends it to the endpoint, and handles response parsing and HTTP errors.
 *
 * @async
 * @function fetcher
 * @param {string} endpoint - The API endpoint to call (e.g., "/users/1"). It will be appended to the base URL.
 * @param {object} [options={}] - The standard options object for the `fetch` API (e.g., method, headers, body).
 * @returns {Promise<any | void>} A promise that resolves to the JSON-parsed body of the response. If the response status is 204 (No Content), it resolves to `undefined`.
 * @throws {Error} Throws an error if the `NEXT_PUBLIC_API_URL` environment variable is not defined.
 * @throws {Error} Throws an error if the network request fails or if the server response has a non-OK status (e.g., 4xx or 5xx). The error message will include the status and response body.
 */
async function fetcher(endpoint, options = {}) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    console.error("[fetcher] ERROR: NEXT_PUBLIC_API_URL is not set");
    throw new Error(
      "Configuration Error: The `NEXT_PUBLIC_API_URL` environment variable is not set."
    );
  }

  const response = await fetch(`${apiUrl}${endpoint}`, options);


  if (response.ok) {
    if (response.status === 204) {
      return;
    }
    try {
      const json = await response.json();
      return json;
    } catch (err) {
      console.error("[fetcher] Erreur en lisant le JSON de la réponse:", err);
      throw err;
    }
  } else {
    let errorBody;
    try {
      errorBody = await response.text();
    } catch {
      errorBody = "Could not retrieve error body.";
    }
    const errorMessage = `HTTP Error: ${response.status} ${response.statusText} for ${endpoint}. Body: ${errorBody}`;
    console.error("[fetcher] " + errorMessage);
    throw new Error(errorMessage);
  }
}

export default fetcher;
