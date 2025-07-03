const URL_BASE = "http://localhost:8080";


export async function sendCreatedProject(userId, projectData) {
  try {
    console.log(userId, projectData);

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(projectData),
    };

    const url = `${URL_BASE}/api/users/${userId}/projects`;
    console.log("Sending POST request to:", url);
    console.log("With options:", requestOptions);

    const response = await fetch(url, requestOptions);

    if (!response.ok) {
      let errorDetail = null;
      try {
        errorDetail = await response.json(); // Tente de parser une réponse d'erreur JSON
      } catch (e) {
        console.error(
          "API Error Response:",
          response.status,
          response.statusText,
          errorDetail
        );
        // Lance une erreur AVEC les détails si disponibles
        throw new Error(
          `API Error ${response.status}: ${response.statusText}. ${
            errorDetail ? JSON.stringify(errorDetail) : "No details available."
          }`
        );
      }
      console.error(
        "API Error Response:",
        response.status,
        response.statusText,
        errorDetail
      );
      throw new Error(
        `API Error: ${response.status} ${response.statusText}. ${
          errorBody ? JSON.stringify(errorBody) : ""
        }`
      );
    }

    if (response.status === 201 || response.status === 200) {
      try {
        const createdProject = await response.json();
        console.log("Project created successfully:", createdProject);
        return createdProject;
      } catch (e) {
        console.log(
          "Project created successfully (No Content/Non-JSON response)"
        );
        return { success: true };
      }
    } else {
      // Cas inattendu si response.ok est true mais pas 200/201 (ex: 204 No Content)
      console.log("Project creation returned status:", response.status);
      return { success: true, status: response.status };
    }
  } catch (error) {
    console.error("Failed to send created project:", error);

    throw error;
  }
}


/**
 * Fetches a paginated list of projects for the currently authenticated user by calling the '/api/projects/me' endpoint.
 * This function retrieves the auth token from cookies and includes it in the Authorization header.
 * This function must be executed on the server.
 * @param {object} options - The pagination and sorting options.
 * @param {number} options.page - The page number to fetch (0-indexed).
 * @param {number} options.size - The number of items to fetch per page.
 * @param {string} options.sort - The sorting criteria, e.g., "createdDate,desc".
 * @returns {Promise<object>} A promise that resolves to the paginated list of projects.
 * @throws {Error} If the authentication token is not found or if the fetch operation fails.
 */
export async function getAllProjects({ page, size, sort }) {
  const cookieStore = cookies();
  const authToken = cookieStore.get('auth-token')?.value;

  if (!authToken) {
    throw new Error('Authentication token not found. User must be logged in.');
  }

  
  if (!backendApiUrl) {
    throw new Error("Missing NEXT_PUBLIC_API_BASE_URL environment variable.");
  }

  const queryParams = new URLSearchParams({ page, size, sort }).toString();
  const url = `${URL_BASE}/api/projects/me?${queryParams}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
      cache: 'no-store' 
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Failed to fetch projects. Status: ${response.status}. URL: ${url}. Body: ${errorBody}`);
      throw new Error(`Failed to fetch projects. Server responded with status ${response.status}.`);
    }

    return response.json();
  } catch (error) {
    console.error(`A network or fetch error occurred while fetching projects from ${url}.`, error);
    throw new Error('Could not connect to the project service. Please try again later.');
  }
}

export async function getProjectById(userId, projectId) {
  const url = `${URL_BASE}/api/users/${userId}/projects/${projectId}`;

  if (userId && projectId) {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        let errorBody = await response.text();
        try {
          errorBody = JSON.parse(errorBody);
        } catch (e) {}

        console.error(
          `getPRojectById: API Error Status ${response.status}, Body:`,
          errorBody
        );
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      return data;
    } catch (error) {
      console.error("getProjectById: CATCH block error:", error);
      throw error;
    }
  }
}

export async function updateProjectById(
  userId,
  projectId,
  { projectDetailsToUpdate }
) {
  if (!userId || !projectId || !projectDetailsToUpdate) {
    const missingArgs = [
      !userId && "userId",
      !projectId && "projectId",
      !projectDetailsToUpdate && "projectDetailsToUpdate",
    ]
      .filter(Boolean)
      .join(", ");
    console.error(
      `updateProjectById: Missing required arguments: ${missingArgs}`
    );
    throw new Error(`Missing required arguments: ${missingArgs}`);
  }

  const url = `${URL_BASE}/api/users/${userId}/projects/${projectId}`;
  console.log(`updateProjectById: Sending PATCH to ${url}`);
  console.log(`updateProjectById: Data:`, projectDetailsToUpdate);

  const requestOptions = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(projectDetailsToUpdate),
  };

  try {
    const response = await fetch(url, requestOptions);

    if (!response.ok) {
      let errorBody = await response.text();
      let parsedErrorBody = errorBody;
      try {
        parsedErrorBody = JSON.parse(errorBody);
      } catch (e) {
        console.warn(
          "updateProjectById: Could not parse error response body as JSON."
        );
      }

      console.error(
        `updateProjectById: API Error Status ${response.status}, Body:`,
        parsedErrorBody
      );

      const errorMessage =
        parsedErrorBody?.message ||
        (typeof parsedErrorBody === "string" && parsedErrorBody.length < 100
          ? parsedErrorBody
          : response.statusText);
      throw new Error(`API Error (${response.status}): ${errorMessage}`);
    }

    if (response.status === 204) {
      console.log(
        "updateProjectById: Success (204 No Content). No body to parse."
      );
      return null;
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.warn(
        `updateProjectById: Received status ${response.status} but Content-Type is not application/json (${contentType}). Attempting to parse anyway.`
      );
    }

    try {
      const data = await response.json();
      console.log("updateProjectById: Success (parsed JSON body):", data);
      return data;
    } catch (jsonError) {
      console.error(
        "updateProjectById: Failed to parse JSON response even though status was OK:",
        jsonError
      );
      throw new Error(
        `API returned ${response.status} but failed to provide valid JSON body.`
      );
    }
  } catch (error) {
    console.error("updateProjectById: CATCH block error:", error);
    throw error;
  }
}

/**
 * Archive un projet spécifié. Attend une réponse 200 OK du serveur,
 * même si le corps de la réponse est vide.
 * @param {number|string} userId - L'ID de l'utilisateur.
 * @param {number|string} projectId - L'ID du projet.
 * @returns {Promise<object>} Une promesse qui résout avec l'objet de données retourné par l'API,
 *                           ou un objet { success: true } si la réponse était OK mais vide/invalide.
 * @throws {Error} Si les arguments sont manquants ou si la réponse API n'est pas OK (status hors 2xx).
 */
export async function archiveProjectById(userId, projectId) {
  if (!userId || !projectId) {
    const missing = !userId ? "userId" : "projectId";
    console.error(`archiveProjectById: Missing required argument: ${missing}`);
    throw new Error(`Missing required argument: ${missing}`);
  }

  const url = `${URL_BASE}/api/users/${userId}/projects/${projectId}/archive`;
  console.log(`archiveProjectById: Sending POST to ${url}`);

  const requestOptions = {
    method: "POST",
    headers: {},
  };

  try {
    const response = await fetch(url, requestOptions);

    if (!response.ok) {
      let errorBody = await response.text();
      let parsedErrorBody = errorBody;
      try {
        parsedErrorBody = JSON.parse(errorBody);
      } catch (e) {}
      console.error(
        `archiveProjectById API Error Status ${response.status}, Body:`,
        parsedErrorBody
      );
      const errorMessage =
        parsedErrorBody?.message ||
        (typeof parsedErrorBody === "string" && parsedErrorBody.length < 100
          ? parsedErrorBody
          : `Request failed with status ${response.status}`);
      throw new Error(`API Error (${response.status}): ${errorMessage}`);
    }

    if (response.status === 200) {
      console.log(
        "archiveProjectById: Received 200 OK. Attempting to parse body..."
      );
      try {
        const data = await response.json();
        console.log("archiveProjectById: Success (parsed JSON body):", data);
        return data || { success: true };
      } catch (jsonError) {
        if (jsonError instanceof SyntaxError) {
          console.log(
            "archiveProjectById: Success (200 OK), but response body was empty or invalid JSON. Treating as success."
          );
          return { success: true };
        } else {
          console.error(
            "archiveProjectById: Error processing JSON response (even though status was 200 OK):",
            jsonError
          );
          throw new Error(
            `API returned 200 OK but failed processing JSON body: ${jsonError.message}`
          );
        }
      }
    } else if (response.status === 204) {
      console.log("archiveProjectById: Success (204 No Content).");
      return { success: true };
    } else {
      console.warn(
        `archiveProjectById: Received unexpected success status ${response.status}. Treating as success.`
      );
      try {
        const data = await response.text();
        if (data)
          console.log(
            "archiveProjectById: Response body for unexpected status:",
            data
          );
      } catch (e) {}
      return { success: true, status: response.status };
    }
  } catch (error) {
    console.error("archiveProjectById: CATCH block error:", error);
    if (!error.message) error.message = "Network error or failed to fetch";
    throw error;
  }
}

/**
 * Supprime un projet spécifié de manière permanente. Attend une réponse 204 No Content.
 * @param {number|string} userId - L'ID de l'utilisateur.
 * @param {number|string} projectId - L'ID du projet.
 * @returns {Promise<{success: boolean}>} Une promesse qui résout avec un objet indiquant le succès.
 * @throws {Error} Si les arguments sont manquants ou si la réponse API n'est pas OK (status hors 2xx).
 */
export async function deleteProjectById(userId, projectId) {
  if (!userId || !projectId) {
    const missing = !userId ? "userId" : "projectId";
    console.error(`deleteProjectById: Missing required argument: ${missing}`);
    throw new Error(`Missing required argument: ${missing}`);
  }

  const url = `${URL_BASE}/api/users/${userId}/projects/${projectId}`;
  console.log(`deleteProjectById: Sending DELETE to ${url}`);

  const requestOptions = {
    method: "DELETE",
    headers: {},
  };

  try {
    const response = await fetch(url, requestOptions);

    if (!response.ok) {
      let errorBody = await response.text();
      let parsedErrorBody = errorBody;
      try {
        parsedErrorBody = JSON.parse(errorBody);
      } catch (e) {
        /* Ignorer */
      }
      console.error(
        `deleteProjectById API Error Status ${response.status}, Body:`,
        parsedErrorBody
      );
      const errorMessage =
        parsedErrorBody?.message ||
        (typeof parsedErrorBody === "string" && parsedErrorBody.length < 100
          ? parsedErrorBody
          : `Request failed with status ${response.status}`);
      throw new Error(`API Error (${response.status}): ${errorMessage}`);
    }

    if (response.status === 204) {
      console.log("deleteProjectById: Success (204 No Content).");
      return { success: true };
    } else {
      console.log(
        `deleteProjectById: Success (Received status ${response.status}). Treating as success.`
      );
      return { success: true, status: response.status };
    }
  } catch (error) {
    console.error("deleteProjectById: CATCH block error:", error);
    if (!error.message) error.message = "Network error or failed to fetch";
    throw error;
  }
}
