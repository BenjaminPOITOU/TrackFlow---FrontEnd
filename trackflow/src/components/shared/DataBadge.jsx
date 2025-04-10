// src/components/shared/DataBadge.jsx

import React from 'react';
import { cn } from "@/lib/utils"; // Assure-toi que cette fonction utilitaire existe et est correctement importée

// --- Style Mappings ---

// 1. Project Status Styles (Techno/Néon avec 'dot')
const projectStatusStyles = {
  EN_COURS: { dot: 'bg-orange-500', bg: 'bg-orange-950', text: 'text-orange-400', border: 'border-orange-700' },
  FINALISE: { dot: 'bg-lime-500', bg: 'bg-lime-950', text: 'text-lime-400', border: 'border-lime-700' },
  EN_PAUSE: { dot: 'bg-emerald-500', bg: 'bg-emerald-950', text: 'text-emerald-400', border: 'border-emerald-700' },
  DEFAULT:  { dot: 'bg-gray-500', bg: 'bg-gray-800', text: 'text-gray-400', border: 'border-gray-600' }
};

// 2. Musical Genre Styles (10 Palettes Cycliques Techno/Néon)
const genreColorStyles = [
  // 1. Pink
  { bg: 'bg-pink-950', text: 'text-pink-400', border: 'border-pink-700' },
  // 2. Cyan
  { bg: 'bg-cyan-950', text: 'text-cyan-400', border: 'border-cyan-700' },
  // 3. Lime Green
  { bg: 'bg-lime-950', text: 'text-lime-400', border: 'border-lime-700' },
  // 4. Orange
  { bg: 'bg-orange-950', text: 'text-orange-400', border: 'border-orange-700' },
  // 5. Violet
  { bg: 'bg-violet-950', text: 'text-violet-400', border: 'border-violet-700' },
  // 6. Teal
  { bg: 'bg-teal-950', text: 'text-teal-400', border: 'border-teal-700' },
  // 7. Yellow
  { bg: 'bg-yellow-950', text: 'text-yellow-400', border: 'border-yellow-700' },
  // 8. Sky Blue
  { bg: 'bg-sky-950', text: 'text-sky-400', border: 'border-sky-700' },
  // 9. Fuchsia
  { bg: 'bg-fuchsia-950', text: 'text-fuchsia-400', border: 'border-fuchsia-700' },
  // 10. Emerald
  { bg: 'bg-emerald-950', text: 'text-emerald-400', border: 'border-emerald-600' }, // Légère variation bordure pour #10
];

// 3. Style Neutre (Pour types inconnus ou fallback)
const neutralStyles = {
    bg: 'bg-gray-800',
    text: 'text-gray-400',
    border: 'border-gray-600',
    dot: 'bg-gray-500'
};

// --- Composant DataBadge ---

/**
 * Affiche une donnée (status, genre, etc.) sous forme de badge ou de point coloré.
 * @param {string} type - Le type de donnée ('projectStatus', 'projectMusicalGender', etc.). Détermine le mapping de style à utiliser.
 * @param {string} value - La valeur brute de la donnée (ex: 'EN_COURS', 'ROCK'). Utilisée pour sélectionner le style spécifique si applicable.
 * @param {string} [label] - Texte optionnel à afficher. S'il est fourni, il remplace 'value' dans l'affichage du badge.
 * @param {'badge' | 'dot'} [variant='badge'] - La forme d'affichage ('badge' avec texte ou 'dot' coloré uniquement).
 * @param {number} [styleIndex] - Pour les types avec styles cycliques (comme 'projectMusicalGender'), l'index pour choisir la couleur.
 * @param {string} [className] - Classes CSS additionnelles à appliquer à l'élément racine.
 */
const DataBadge = ({
  type,
  value,
  label,
  variant = 'badge',
  styleIndex,
  className
}) => {

  let styles = {};

  // 1. Sélectionner les styles basés sur le type
  switch (type) {
    case 'projectStatus':
      const statusMap = projectStatusStyles;
      // Récupère le style pour la valeur spécifique (EN_COURS, etc.) ou le style DEFAULT
      styles = statusMap[value] || statusMap.DEFAULT || neutralStyles;
      break;

    case 'projectMusicalGender':
      // Utilise styleIndex pour choisir cycliquement parmi les 10 styles de genre
      if (typeof styleIndex === 'number' && styleIndex >= 0 && genreColorStyles.length > 0) {
        // L'opérateur modulo (%) assure le cycle
        styles = genreColorStyles[styleIndex % genreColorStyles.length] || neutralStyles;
      } else {
        // Si pas d'index ou tableau vide, utiliser le premier style ou le neutre comme fallback
        styles = genreColorStyles[0] || neutralStyles;
        if (typeof styleIndex !== 'number' || styleIndex < 0) {
            // console.warn("DataBadge: styleIndex invalide ou manquant pour 'projectMusicalGender', fallback utilisé.");
        }
      }
      break;

    // Ajoutez d'autres 'case' ici pour de futurs types

    default:
      // Type non reconnu -> utilise les styles neutres
      // console.warn(`DataBadge: type "${type}" non reconnu.`);
      styles = neutralStyles;
  }

  // 2. Déterminer le texte à afficher (pour le badge)
  const displayText = label || value || '';

  // 3. Rendu basé sur la variante

  // Variante 'dot'
  if (variant === 'dot') {
    // Utilise styles.dot s'il existe, sinon styles.bg comme couleur de fallback
    const dotColorClass = styles.dot || styles.bg || 'bg-transparent';
    return (
      <span
        className={cn(
          "inline-block w-2.5 h-2.5 rounded-full flex-shrink-0", // flex-shrink-0 pour éviter qu'il soit écrasé en flex container
          dotColorClass,
          className
        )}
        title={displayText} // Afficher le texte au survol pour l'accessibilité/info
      >
        {/* Le point est visuel, pas de contenu texte */}
      </span>
    );
  }

  // Variante 'badge' (par défaut)
  // Vérifie qu'il y a bien du texte à afficher pour le badge
  if (displayText) {
    return (
      <span
        className={cn(
          // Classes de base pour le badge
          "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium border whitespace-nowrap",
          // Styles de couleur spécifiques au type/valeur/index
          styles.bg,
          styles.text,
          styles.border,
          // Classes additionnelles passées de l'extérieur
          className
        )}
      >
        {displayText}
      </span>
    );
  }

  // Si variant='badge' mais pas de texte (value/label vide), ou variant inconnu, ne rien rendre
  return null;
};

export default DataBadge;