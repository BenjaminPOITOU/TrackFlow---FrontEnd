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
 * @throws {Error} Throws an error if the network request fails or if the server response has a non-OK status (e.g., 4xx or 5xx). The error message includes status and response body.
 */

async function fetcher(endpoint, options = {}) {
  console.log("🌐 [fetcher] Début de la requête");

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  console.log("🔧 [fetcher] NEXT_PUBLIC_API_URL:", apiUrl);
  console.log("🎯 [fetcher] Endpoint:", endpoint);

  if (!apiUrl) {
    console.error("❌ [fetcher] ERROR: NEXT_PUBLIC_API_URL is not set");
    throw new Error(
      "Configuration Error: The `NEXT_PUBLIC_API_URL` environment variable is not set."
    );
  }

  const fullUrl = `${apiUrl}${endpoint}`;
  console.log("🚀 [fetcher] URL complète:", fullUrl);
  console.log("📋 [fetcher] Options:", {
    ...options,
    headers: options.headers
      ? {
          ...options.headers,
          Authorization: options.headers.Authorization
            ? "[TOKEN_MASQUÉ]"
            : undefined,
        }
      : undefined,
  });

  console.log("📤 [fetcher] Lancement de la requête...");
  const response = await fetch(fullUrl, options);

  console.log("📥 [fetcher] Réponse reçue:", {
    status: response.status,
    statusText: response.statusText,
    ok: response.ok,
    url: response.url,
    headers: Object.fromEntries(response.headers.entries()),
  });

  if (response.ok) {
    console.log("✅ [fetcher] Réponse OK");
    if (response.status === 204) {
      console.log("📭 [fetcher] Status 204 - Pas de contenu");
      return;
    }
    try {
      console.log("📄 [fetcher] Lecture du JSON...");
      const json = await response.json();
      console.log("✅ [fetcher] JSON parsé avec succès:", typeof json);
      return json;
    } catch (err) {
      console.error(
        "❌ [fetcher] Erreur en lisant le JSON de la réponse:",
        err
      );
      throw err;
    }
  } else {
    console.log("❌ [fetcher] Réponse en erreur");
    let errorBody;
    try {
      errorBody = await response.text();
      console.log("📄 [fetcher] Corps de l'erreur:", errorBody);
    } catch {
      errorBody = "Could not retrieve error body.";
      console.log("❌ [fetcher] Impossible de lire le corps de l'erreur");
    }

    const status = response.status;
    const statusText = response.statusText;

    const error = new Error(`HTTP Error ${status}: ${statusText}`);
    error.status = status;
    error.body = errorBody;
    error.endpoint = endpoint;

    if (status === 401) {
      console.warn(`🔐 [fetcher] 401 Unauthorized détecté pour ${endpoint}`);
    }

    throw error;
  }
}

export default fetcher;
