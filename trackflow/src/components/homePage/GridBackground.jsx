import styles from "./GridBackground.module.css";

/**
 * Renders an animated, decorative grid background using CSS Modules.
 * The styles and animations are scoped to this component, preventing global conflicts.
 * This is a Server Component as it contains no interactivity or state.
 * @returns {JSX.Element} The animated grid background element.
 */
export function GridBackground() {
  const lineCount = 20;
  const lineSpacing = 5;

  return (
    <div className={styles.gridContainer}>
      {Array.from({ length: lineCount }).map((_, i) => (
        <div
          key={`h-${i}`}
          className={styles.gridLineHorizontal}
          style={{
            top: `${i * lineSpacing}%`,
            animationDuration: `${15 + (i % 5)}s`,
          }}
        />
      ))}

      {Array.from({ length: lineCount }).map((_, i) => (
        <div
          key={`v-${i}`}
          className={styles.gridLineVertical}
          style={{
            left: `${i * lineSpacing}%`,
            animationDuration: `${20 + (i % 5)}s`,
          }}
        />
      ))}
    </div>
  );
}
