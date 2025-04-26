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
          `getCompositionsByProjectId: API Error Status ${response.status}, Body:`,
          errorBody
        );
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      return data;
    } catch (errorBody) {
      console.error(
        "getCompositionsByProjectId: CATCH block error:",
        errorBody
      );
      throw errorBody;
    }
  }
}

export async function deleteCompositionById(projectId, compositionId) {
  const url = `${URL_BASE}/api/projects/${projectId}/compositions/${compositionId}`;

  if (projectId && compositionId) {
    try {
      const requestOptions = {
        method: "DELETE",
      };
      const response = await fetch(url, requestOptions);

      if (!response.ok) {
        let errorBody = await response.text();
        try {
          errorBody = JSON.parse(errorBody);
        } catch (e) {}

        console.error(
          `deleteCompositionById: API Error Status ${response.status}, Body:`,
          errorBody
        );
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      if (response.status === "204") {
        return { success: true };
      }
    } catch (errorBody) {
      console.error("deleteCompositonById: CATCH block error:", errorBody);
      throw errorBody;
    }
  }
}

export async function createCompositionByProjectId(projectId, formData) {
  const url = `${URL_BASE}/api/projects/${projectId}/compositions`;

  if (projectId) {
    try {
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      };
      const response = await fetch(url, requestOptions);

      if (!response.ok) {
        let errorBody = await response.text();
        try {
          errorBody = JSON.parse(errorBody);
        } catch (e) {}

        console.error(
          `createCompositionByProjectId: API Error Status ${response.status}, Body:`,
          errorBody
        );
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

   
        try {
          const data = response.json();
          return data;
        } catch (error) {}
      
    } catch (errorBody) {
      console.error(
        "createCompositionByProjectId: CATCH block error:",
        errorBody
      );
      throw errorBody;
    }
  }
}


export async function getCompositionById(projectId, compositionId) {
  const url = `${URL_BASE}/api/projects/${projectId}/compositions/${compositionId}`;

  if (projectId && compositionId) {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        let errorBody = await response.text();
        try {
          errorBody = JSON.parse(errorBody);
        } catch (e) {}

        console.error(
          `getCompositionById: API Error Status ${response.status}, Body:`,
          errorBody
        );
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      return data;
    } catch (errorBody) {
      console.error(
        "getCompositionById: CATCH block error:",
        errorBody
      );
      throw errorBody;
    }
  }
}




export async function updateCompositionById(projectId, compositionId, compositionUpdated) {
  const url = `${URL_BASE}/api/projects/${projectId}/compositions/${compositionId}`;

  if (projectId && compositionId) {
    try {
      const requestOptions = {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(compositionUpdated),
      };
      const response = await fetch(url, requestOptions);

      if (!response.ok) {
        let errorBody = await response.text();
        try {
          errorBody = JSON.parse(errorBody);
        } catch (e) {}

        console.error(
          `updateCompositionById: API Error Status ${response.status}, Body:`,
          errorBody
        );
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

   
        try {
          const data = response.json();
          return data;
        } catch (error) {}
      
    } catch (errorBody) {
      console.error(
        "updateCompositionById: CATCH block error:",
        errorBody
      );
      throw errorBody;
    }
  }
}



export async function getVersionsByCompositionId(compositionId) {
  const url = `${URL_BASE}/api/compositions/${compositionId}/versions`;

  if (compositionId) {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        let errorBody = await response.text();
        try {
          errorBody = JSON.parse(errorBody);
        } catch (e) {}

        console.error(
          `getVersionsByCompositionId: API Error Status ${response.status}, Body:`,
          errorBody
        );
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      return data;
    } catch (errorBody) {
      console.error(
        "getVersionsByCompositionId: CATCH block error:",
        errorBody
      );
      throw errorBody;
    }
  }
}