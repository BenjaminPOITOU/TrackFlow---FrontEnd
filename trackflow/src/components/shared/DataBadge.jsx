

import React from 'react';
import { cn } from "@/lib/utils"; 

// --- Style Mappings ---

// 1. Project Status Styles (Techno/Néon avec 'dot')
const projectStatusStyles = {
  EN_COURS: { dot: 'bg-orange-500', bg: 'bg-orange-950', text: 'text-orange-400', border: 'border-orange-700' },
  FINALISE: { dot: 'bg-lime-500', bg: 'bg-lime-950', text: 'text-lime-400', border: 'border-lime-700' },
  EN_PAUSE: { dot: 'bg-gray-300', bg: 'bg-gray-300', text: 'text-emerald-400', border: 'border-emerald-700' },
  DEFAULT:  { dot: 'bg-gray-500', bg: 'bg-gray-800', text: 'text-gray-400', border: 'border-gray-600' }
};

// 2. Musical Genre Styles (10 Palettes Cycliques Techno/Néon)
const genreColorPalettes = [
  { bg: 'bg-pink-950',    text: 'text-pink-400',    border: 'border-pink-700' },    // Palette 0 (Pink)
  { bg: 'bg-cyan-950',    text: 'text-cyan-400',    border: 'border-cyan-700' },    // Palette 1 (Cyan)
  { bg: 'bg-lime-950',    text: 'text-lime-400',    border: 'border-lime-700' },    // Palette 2 (Lime)
  { bg: 'bg-orange-950',  text: 'text-orange-400',  border: 'border-orange-700' },  // Palette 3 (Orange)
  { bg: 'bg-violet-950',  text: 'text-violet-400',  border: 'border-violet-700' },  // Palette 4 (Violet)
  { bg: 'bg-teal-950',    text: 'text-teal-400',    border: 'border-teal-700' },    // Palette 5 (Teal)
  { bg: 'bg-yellow-950',  text: 'text-yellow-400',  border: 'border-yellow-700' },  // Palette 6 (Yellow)
  { bg: 'bg-sky-950',     text: 'text-sky-400',     border: 'border-sky-700' },     // Palette 7 (Sky Blue)
  { bg: 'bg-fuchsia-950', text: 'text-fuchsia-400', border: 'border-fuchsia-700' }, // Palette 8 (Fuchsia)
  { bg: 'bg-emerald-950', text: 'text-emerald-400', border: 'border-emerald-600' }, // Palette 9 (Emerald)
];

const genreToStyleMap = {
  // --- Rock / Metal / Punk (Palettes 0, 8, 3) ---
  ROCK: genreColorPalettes[0],
  METAL: genreColorPalettes[8], // Fuchsia (agressif?)
  PUNK: genreColorPalettes[3], // Orange
  ALTERNATIVE: genreColorPalettes[0],
  GRUNGE: genreColorPalettes[8],
  PROGRESSIVE_ROCK: genreColorPalettes[4], // Violet (complexe?)
  POST_ROCK: genreColorPalettes[4],
  SHOEGAZE: genreColorPalettes[4],

  // --- Pop / Funk / Disco / R&B / Soul (Palettes 0, 8, 6) ---
  POP: genreColorPalettes[0], // Pink
  FUNK: genreColorPalettes[6], // Yellow
  DISCO: genreColorPalettes[8], // Fuchsia
  RNB: genreColorPalettes[4], // Violet
  SOUL: genreColorPalettes[4],
  NEOSOUL: genreColorPalettes[4],
  K_POP: genreColorPalettes[0],
  J_POP: genreColorPalettes[0],
  CITY_POP: genreColorPalettes[6], // Yellow
  SYNTHPOP: genreColorPalettes[1], // Cyan (lien avec electro)

  // --- Electronic / House / Techno etc (Palettes 1, 7, 9, 5) ---
  ELECTRONIC: genreColorPalettes[1], // Cyan
  HOUSE: genreColorPalettes[7], // Sky Blue
  TECHNO: genreColorPalettes[9], // Emerald
  TRANCE: genreColorPalettes[1],
  DUBSTEP: genreColorPalettes[5], // Teal
  DNB: genreColorPalettes[5],
  EDM: genreColorPalettes[7],
  AMBIENT: genreColorPalettes[1],
  LOUNGE: genreColorPalettes[7],
  LO_FI: genreColorPalettes[4], // Violet (chill?)
  CHIPTUNE: genreColorPalettes[6], // Yellow (retro?)
  VAPORWAVE: genreColorPalettes[0], // Pink (aesthetic?)
  GARAGE: genreColorPalettes[5], // Teal
  TRAP: genreColorPalettes[3], // Orange (lien avec HipHop)
  GRIME: genreColorPalettes[3],
  DRILL: genreColorPalettes[3],


  // --- HipHop / Rap (Palette 3) ---
  HIP_HOP: genreColorPalettes[3], // Orange
  RAP: genreColorPalettes[3],

  // --- Jazz / Blues / Gospel (Palettes 7, 5) ---
  JAZZ: genreColorPalettes[7], // Sky Blue
  BLUES: genreColorPalettes[7],
  GOSPEL: genreColorPalettes[6], // Yellow
  SWING: genreColorPalettes[7],

  // --- World / Latin / Reggae / Ska (Palettes 2, 5) ---
  REGGAE: genreColorPalettes[2], // Lime
  LATIN: genreColorPalettes[3], // Orange
  SALSA: genreColorPalettes[3],
  SKA: genreColorPalettes[2],
  AFROBEAT: genreColorPalettes[6], // Yellow
  BOSSA_NOVA: genreColorPalettes[5], // Teal

  // --- Folk / Country (Palette 2) ---
  FOLK: genreColorPalettes[2], // Lime
  COUNTRY: genreColorPalettes[2],

  // --- Classique (Palette 9) ---
  CLASSICAL: genreColorPalettes[9], // Emerald

  // --- Indie (Peut-être une couleur neutre ou spécifique?) ---
  INDIE: genreColorPalettes[5], // Teal

  // DEFAULT: Si on veut un style par défaut spécifique aux genres non mappés
  // DEFAULT: neutralStyles // Ou genreColorPalettes[quelque chose]
};

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
      styles = genreToStyleMap[value] || neutralStyles;
      break;

    default:
      // Type inconnu -> style neutre
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