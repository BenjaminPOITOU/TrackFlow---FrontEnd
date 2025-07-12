/**
 * @file modals/versionCreateModal/utils/generateNextVersionName.jsx (example path)
 * @description Provides utility functions related to version management.
 */

/**
 * Generates the next version name based on the current version name.
 *
 * This function increments the minor version number of a string (e.g., "V1.0" -> "V1.1").
 * It gracefully handles cases where there is no previous version (returns "V1.0")
 * and validates the input format to prevent errors. If the format is unexpected,
 * it logs a warning and returns a safe fallback name.
 *
 * @param {string | null | undefined} currentVersionName - The name of the current version (e.g., "V1.0"), or a falsy value if it's the first version.
 * @returns {string} The name for the next version (e.g., "V1.1"), the initial version "V1.0", or a fallback name for invalid formats.
 */
export const generateNextVersionName = (currentVersionName) => {
  if (!currentVersionName) {
    return "V1.0";
  }

  const parts = currentVersionName.split(".");

  if (parts.length !== 2 || !parts[0].startsWith("V")) {
    console.warn(
      `Format de version inattendu : "${currentVersionName}". Retour à un nom par défaut.`
    );
    return `${currentVersionName} - (Nouveau)`;
  }

  try {
    const majorPart = parts[0];
    const minorNumber = parseInt(parts[1], 10);

    if (isNaN(minorNumber)) {
      throw new Error("La partie mineure n'est pas un nombre.");
    }

    const nextMinorNumber = minorNumber + 1;
    return `${majorPart}.${nextMinorNumber}`;
  } catch (e) {
    console.error(
      `Erreur lors de la génération du nom de version pour "${currentVersionName}":`,
      e
    );
    return `${currentVersionName} - (Nouveau)`;
  }
};
