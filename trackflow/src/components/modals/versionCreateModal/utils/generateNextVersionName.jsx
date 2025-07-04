/**
 * Génère le nom de la prochaine version à partir du nom de la version actuelle.
 * Gère les cas où il n'y a pas de version précédente.
 * @param {string | null} currentVersionName - Le nom de la version actuelle (ex: "V1.0") ou null.
 * @returns {string} Le nom de la prochaine version (ex: "V1.1" ou "V1.0" si la première).
 */
export const generateNextVersionName = (currentVersionName) => {
    // Cas 1 : Aucune version précédente, c'est la toute première sur cette branche.
    if (!currentVersionName) {
      return "V1.0";
    }
  
    // Cas 2 : Une version existe, on incrémente la version mineure.
    const parts = currentVersionName.split('.');
    
    // On s'assure que le format est bien celui attendu (ex: V1.0)
    if (parts.length !== 2 || !parts[0].startsWith('V')) {
      // Si le format est inattendu, on retourne un nom par défaut pour éviter un crash.
      console.warn(`Format de version inattendu : "${currentVersionName}". Retour à un nom par défaut.`);
      return `${currentVersionName} - (Nouveau)`;
    }
  
    try {
      const majorPart = parts[0]; // "V1"
      const minorNumber = parseInt(parts[1], 10);
  
      if (isNaN(minorNumber)) {
        throw new Error("La partie mineure n'est pas un nombre.");
      }
  
      const nextMinorNumber = minorNumber + 1;
      return `${majorPart}.${nextMinorNumber}`;
    } catch (e) {
      console.error(`Erreur lors de la génération du nom de version pour "${currentVersionName}":`, e);
      return `${currentVersionName} - (Nouveau)`;
    }
  };