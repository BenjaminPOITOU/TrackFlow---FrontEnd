const URL_BASE = "http://localhost:8080";

export async function getCompositionsByProjectId(projectId) {
  const url = `${URL_BASE}/api/projects/${projectId}/compositions`;

  if (projectId) {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        let errorBody = await response.text();
        try {
          errorBody = JSON.parse(errorBody);
        } catch (e) {}

        console.error(
          `getAllCompositions: API Error Status ${response.status}, Body:`,
          errorBody
        );
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      return data;
    } catch (errorBody) {
      console.error("getRecentProjects: CATCH block error:", errorBody);
      throw errorBody;
    }
  }
}
