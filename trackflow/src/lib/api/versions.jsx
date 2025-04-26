const URL_BASE = "http://localhost:8080";

export async function getVersionById(versionId) {
  const url = `${URL_BASE}/api/versions/${versionId}`;

  if (versionId) {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        let errorBody = await response.text();
        try {
          errorBody = JSON.parse(errorBody);
        } catch (e) {}

        console.error(
          `getVersionById: API Error Status ${response.status}, Body:`,
          errorBody
        );
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      return data;
    } catch (errorBody) {
      console.error(
        "getVersionById: CATCH block error:",
        errorBody
      );
      throw errorBody;
    }
  }
}
