const URL_BASE = "http://localhost:8080";

export async function getProjectTypes() {
  try {
    const response = await fetch(`${URL_BASE}/api/enums/project-types`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Failed to fetch project types:", error);
    throw error;
  }
}

export async function getProjectCommercialStatuses() {
  try {
    const response = await fetch(`${URL_BASE}/api/enums/project-commercial-statuses`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Failed to fetch project commercial status:", error);
    throw error;
  }
}

export async function getProjectMusicalGenders() {
  try {
    const response = await fetch(`${URL_BASE}/api/enums/project-musical-genders`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Failed to fetch project musical gender:", error);
    throw error;
  }

}
export async function getProjectPurposes() {
  try {
    const response = await fetch(`${URL_BASE}/api/enums/project-purposes`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Failed to fetch project purpose:", error);
    throw error;
  }
}
export async function getProjectProgresses() {
  try {
    const response = await fetch(`${URL_BASE}/api/enums/project-statuses`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Failed to fetch project progresses:", error);
    throw error;
  }
}
