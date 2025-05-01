const URL_BASE = "http://localhost:8080";




export async function createAnnotationByVersionId(versionId, formData) {
  const url = `${URL_BASE}/api/versions/${versionId}/annotations`;

  if (versionId) {
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
          `createAnnotationByVersionId: API Error Status ${response.status}, Body:`,
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
        "createAnnotationByVersionId: CATCH block error:",
        errorBody
      );
      throw errorBody;
    }
  }
}