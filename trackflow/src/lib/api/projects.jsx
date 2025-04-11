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

export async function getAllProjects({
  userId,
  page = 0,
  size = 10,
  sort = "createdDate,desc",
}) {
  if (!userId) {
    console.error("getAllProjects called without userId");
    throw new Error("User ID is required");
  }
  if (!URL_BASE) {
    console.error("API URL_BASE is not defined");
    throw new Error("API configuration error");
  }

  // Construire les paramètres de requête
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    sort: sort,
  });

  const url = `${URL_BASE}/api/users/${userId}/projects?${params.toString()}`;
  console.log(`getAllProjects: Fetching from URL: ${url}`);

  try {
    const response = await fetch(url);
    console.log(`getAllProjects: Response status: ${response.status}`);

    if (!response.ok) {
      let errorBody = await response.text();
      try {
        errorBody = JSON.parse(errorBody);
      } catch (e) {}
      console.error(
        `getAllProjects: API Error Status ${response.status}, Body:`,
        errorBody
      );
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("getAllProjects: Page Data received:", data);

    return {
      content: data.content || [],
      totalPages: data.totalPages,
      totalElements: data.totalElements,
      currentPage: data.number,
      pageSize: data.size,
    };
  } catch (error) {
    console.error("getAllProjects: CATCH block error:", error);
    throw error;
  }
}

export async function getRecentProjects({
  page = 0,
  size = 4,
  sort = "createdDate,desc",
  login,
}) {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    sort: sort,
    login: login,
  });

  const url = `${URL_BASE}/api/projects/recent?${params}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      let errorBody = await response.text();
      try {
        errorBody = JSON.parse(errorBody);
      } catch (e) {}

      console.error(
        `getRecentProjects: API Error Status ${response.status}, Body:`,
        errorBody
      );
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data.content || data;
  } catch (error) {
    console.error("getRecentProjects: CATCH block error:", error);
    throw error;
  }
}

export async function getProjectById(userId, projectId) {
  const url = `${URL_BASE}/api/users/${userId}/projects/project/${projectId}`;

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
