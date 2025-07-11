import React from "react";
import { cn } from "@/lib/utils";


const projectStatusStyles = {
  EN_COURS: {
    dot: "bg-orange-500",
    bg: "bg-orange-950",
    text: "text-orange-400",
    border: "border-orange-700",
  },
  FINALISE: {
    dot: "bg-lime-500",
    bg: "bg-lime-950",
    text: "text-lime-400",
    border: "border-lime-700",
  },
  EN_PAUSE: {
    dot: "bg-gray-300",
    bg: "bg-gray-300",
    text: "text-emerald-400",
    border: "border-emerald-700",
  },
  DEFAULT: {
    dot: "bg-gray-500",
    bg: "bg-gray-800",
    text: "text-gray-400",
    border: "border-gray-600",
  },
};


const compositionStatusStyles = {
  EBAUCHE: {
    dot: "bg-blue-500",
    bg: "bg-blue-950",
    text: "text-blue-400",
    border: "border-blue-700",
  },
  EN_COURS: {
    dot: "bg-orange-500",
    bg: "bg-orange-950",
    text: "text-orange-400",
    border: "border-orange-700",
  },
  A_FINALISER: {
    dot: "bg-purple-500",
    bg: "bg-purple-950",
    text: "text-purple-400",
    border: "border-purple-700",
  },
  TERMINE: {
    dot: "bg-lime-500",
    bg: "bg-lime-950",
    text: "text-lime-400",
    border: "border-lime-700",
  },
  DEFAULT: {
    dot: "bg-gray-500",
    bg: "bg-gray-800",
    text: "text-gray-400",
    border: "border-gray-600",
  },
};


const synthwaveStyle = {
  bg: "bg-purple-950/80",
  text: "text-cyan-400",
  border: "border-cyan-500/60",
  dot: "bg-cyan-500",
  glow: "shadow-lg shadow-cyan-500/20",
};


const neutralStyles = {
  bg: "bg-gray-800",
  text: "text-gray-400",
  border: "border-gray-600",
  dot: "bg-gray-500",
};

/**
 * Affiche une donnée (status, genre, etc.) sous forme de badge ou de point coloré.
 * @param {string} type - Le type de donnée ('projectStatus', 'projectMusicalGender', etc.)
 * @param {string} value - La valeur brute de la donnée (ex: 'EN_COURS', 'ROCK')
 * @param {string} [label] - Texte optionnel à afficher
 * @param {'badge' | 'dot'} [variant='badge'] - La forme d'affichage
 * @param {string} [className] - Classes CSS additionnelles
 */
const DataBadge = ({ type, value, variant = "badge", className }) => {
  if (!value) {
    return null;
  }

  let styles = neutralStyles;

  switch (type) {
    case "projectStatus":
      styles =
        projectStatusStyles[value] ||
        projectStatusStyles.DEFAULT ||
        neutralStyles;
      break;
    case "compositionStatus":
      styles =
        compositionStatusStyles[value] ||
        compositionStatusStyles.DEFAULT ||
        neutralStyles;
      break;
    case "projectMusicalGender":
      styles = synthwaveStyle;
      break;
    default:
      styles = neutralStyles;
  }


  const displayText = value || "";


  if (variant === "dot") {
    const dotColorClass = styles.dot;
    return (
      <span
        className={cn(
          "inline-block w-2.5 h-2.5 rounded-full flex-shrink-0",
          dotColorClass,
          type === "projectMusicalGender" && styles.glow,
          className
        )}
        title={displayText}
      />
    );
  } else if (variant === "badge" && displayText) {
    const badgeClasses = cn(
      "inline-flex items-center rounded px-2 text-xs mx-0.5 font-medium border whitespace-nowrap",
      styles.bg,
      styles.text,
      styles.border,
      type === "projectMusicalGender" && styles.glow,
      className
    );

    if (type === "compositionStatus") {
      return <span className={cn(badgeClasses, "text-md")}>{displayText}</span>;
    }
    return <span className={badgeClasses}>{displayText}</span>;
  }

  return null;
};

export default DataBadge;