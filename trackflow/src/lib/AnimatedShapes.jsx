// components/shared/AnimatedShape.jsx (ou où tu l'as placé)

import React, { useState, useEffect, useRef, useMemo } from 'react'; // Ajout de useMemo
import { cn } from '@/lib/utils';


// --- Fonctions d'Easing (inchangées) ---
function easeInOutSine(t) { return -(Math.cos(Math.PI * t) - 1) / 2; }
function linear(t) { return t; }

// --- Helper pour obtenir le style par défaut (inchangé) ---
const getDefaultStyle = (type) => {
    switch (type) {
        case 'pulse': return { transform: 'scale(1)', opacity: 1 };
        case 'spin': return { transform: 'rotate(0deg)' };
        case 'sonar': return { transform: 'scale(0)', opacity: 0 };
        case 'barWave': return { transform: 'scaleY(0.1)' };
        case 'morph': return { borderRadius: '10%', transform: 'rotate(0deg)' };
        default: return {};
    }
};

// --- Hooks d'Animation Modifiés (avec useMemo pour defaultStyle) ---

// 1. Pulse
function usePulseOutlineAnimation(duration = 1500, isAnimating = false) {
    // Mémorise defaultStyle pour avoir une référence stable
    const defaultStyle = useMemo(() => getDefaultStyle('pulse'), []); // <-- Modifié

    const [style, setStyle] = useState(defaultStyle);
    const animationFrameId = useRef(null);
    const startTime = useRef(null);

    useEffect(() => {
        if (isAnimating) {
            startTime.current = null;
            const animate = (timestamp) => {
                if (!startTime.current) startTime.current = timestamp;
                const elapsedTime = timestamp - startTime.current;
                const progress = (elapsedTime % duration) / duration;
                const easedProgress = progress < 0.5 ? easeInOutSine(progress * 2) : easeInOutSine((1 - progress) * 2);
                const scale = 1 + easedProgress * 0.2;
                const opacity = 1 - easedProgress * 0.5;
                setStyle({ transform: `scale(${scale})`, opacity: opacity });
                animationFrameId.current = requestAnimationFrame(animate);
            };
            animationFrameId.current = requestAnimationFrame(animate);
        } else {
            cancelAnimationFrame(animationFrameId.current);
            animationFrameId.current = null;
            // Réinitialise au style par défaut quand on arrête (important)
            setStyle(defaultStyle);
        }
        return () => {
            cancelAnimationFrame(animationFrameId.current);
            animationFrameId.current = null;
            // On peut aussi reset ici pour plus de sûreté, mais le bloc 'else' devrait suffire
            // setStyle(defaultStyle);
            startTime.current = null;
        };
    }, [duration, isAnimating, defaultStyle]); // 'defaultStyle' est maintenant stable

    return style;
}

// 2. Spin
function useSpinOutlineAnimation(duration = 3000, isAnimating = false) {
    const defaultStyle = useMemo(() => getDefaultStyle('spin'), []); // <-- Modifié
    const [style, setStyle] = useState(defaultStyle);
    const animationFrameId = useRef(null);
    const startTime = useRef(null);

    useEffect(() => {
        if (isAnimating) {
            startTime.current = null;
            const animate = (timestamp) => {
                if (!startTime.current) startTime.current = timestamp;
                const elapsedTime = timestamp - startTime.current;
                const progress = (elapsedTime % duration) / duration;
                const angle = progress * 360;
                setStyle({ transform: `rotate(${angle}deg)` });
                animationFrameId.current = requestAnimationFrame(animate);
            };
            animationFrameId.current = requestAnimationFrame(animate);
        } else {
            cancelAnimationFrame(animationFrameId.current);
            animationFrameId.current = null;
            setStyle(defaultStyle); // Reset
        }
        return () => {
            cancelAnimationFrame(animationFrameId.current);
            animationFrameId.current = null;
            startTime.current = null;
        };
    }, [duration, isAnimating, defaultStyle]);

    return style;
}

// 3. Sonar
function useSonarAnimation(duration = 2000, count = 3, isAnimating = false) {
    const defaultStyle = useMemo(() => getDefaultStyle('sonar'), []); // <-- Modifié
    const [styles, setStyles] = useState(() => Array(count).fill(defaultStyle));
    const animationFrameId = useRef(null);
    const startTime = useRef(null);
    const delay = duration / count;

    useEffect(() => {
        if (isAnimating) {
            startTime.current = null;
            const animate = (timestamp) => {
                if (!startTime.current) startTime.current = timestamp;
                const elapsedTime = timestamp - startTime.current;
                const newStyles = Array(count).fill(null).map((_, i) => {
                     const waveElapsedTime = (elapsedTime - i * delay + duration) % duration;
                     const progress = waveElapsedTime / duration;
                     const scale = progress;
                     const opacity = 1 - progress;
                     return { transform: `scale(${scale})`, opacity: opacity > 0 ? opacity : 0 };
                 });
                setStyles(newStyles);
                animationFrameId.current = requestAnimationFrame(animate);
            };
            animationFrameId.current = requestAnimationFrame(animate);
        } else {
            cancelAnimationFrame(animationFrameId.current);
            animationFrameId.current = null;
             // Réinitialiser tous les styles d'onde
            setStyles(Array(count).fill(defaultStyle));
        }
        return () => {
            cancelAnimationFrame(animationFrameId.current);
            animationFrameId.current = null;
            startTime.current = null;
        };
     // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [duration, count, isAnimating, defaultStyle]);

    return styles;
}


// 4. Bar Wave
function useBarWaveAnimation(duration = 1200, barCount = 5, isAnimating = false) {
    const defaultStyle = useMemo(() => getDefaultStyle('barWave'), []); // <-- Modifié
    const [styles, setStyles] = useState(() => Array(barCount).fill(defaultStyle));
    const animationFrameId = useRef(null);
    const startTime = useRef(null);
    const timeOffsetFactor = 0.2;

    useEffect(() => {
        if (isAnimating) {
            startTime.current = null;
            const animate = (timestamp) => {
                if (!startTime.current) startTime.current = timestamp;
                 const elapsedTime = timestamp - startTime.current;
                 const newStyles = Array(barCount).fill(null).map((_, i) => {
                     const timeOffset = i * timeOffsetFactor;
                     const phase = (elapsedTime / duration + timeOffset) * 2 * Math.PI;
                     const sinValue = Math.sin(phase);
                     const scaleY = 0.1 + (sinValue + 1) / 2 * 0.9;
                     return { transform: `scaleY(${scaleY})`, transformOrigin: 'bottom' };
                 });
                setStyles(newStyles);
                animationFrameId.current = requestAnimationFrame(animate);
            };
            animationFrameId.current = requestAnimationFrame(animate);
        } else {
             cancelAnimationFrame(animationFrameId.current);
             animationFrameId.current = null;
             setStyles(Array(barCount).fill(defaultStyle)); // Reset
        }
        return () => {
            cancelAnimationFrame(animationFrameId.current);
            animationFrameId.current = null;
            startTime.current = null;
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [duration, barCount, isAnimating, defaultStyle]);

    return styles;
}

// 5. Morph
function useMorphOutlineAnimation(duration = 2500, isAnimating = false) {
    const defaultStyle = useMemo(() => getDefaultStyle('morph'), []); // <-- Modifié
    const [style, setStyle] = useState(defaultStyle);
    const animationFrameId = useRef(null);
    const startTime = useRef(null);

    useEffect(() => {
        if (isAnimating) {
            startTime.current = null;
            const animate = (timestamp) => {
                if (!startTime.current) startTime.current = timestamp;
                 const elapsedTime = timestamp - startTime.current;
                 const progress = (elapsedTime % duration) / duration;
                 const easedProgress = progress < 0.5 ? easeInOutSine(progress * 2) : easeInOutSine((1 - progress) * 2);
                 const borderRadius = 10 + easedProgress * 40;
                 const rotation = progress * 180;
                 setStyle({ borderRadius: `${borderRadius}%`, transform: `rotate(${rotation}deg)` });
                animationFrameId.current = requestAnimationFrame(animate);
            };
            animationFrameId.current = requestAnimationFrame(animate);
        } else {
             cancelAnimationFrame(animationFrameId.current);
             animationFrameId.current = null;
             setStyle(defaultStyle); // Reset
        }
        return () => {
            cancelAnimationFrame(animationFrameId.current);
            animationFrameId.current = null;
            startTime.current = null;
        };
    }, [duration, isAnimating, defaultStyle]);

    return style;
}


// --- Le Composant Principal AnimatedShape ---

/**
 * Affiche une forme animée (contour) contrôlée par survol.
 * @param {string} [type='pulse'] - Type d'animation ('pulse', 'spin', 'sonar', 'barWave', 'morph').
 * @param {string} [size='medium'] - Taille ('small', 'medium', 'large').
 * @param {string} [speed='normal'] - Vitesse ('slow', 'normal', 'fast').
 * @param {boolean} [isAnimating=false] - Contrôle si l'animation est active.
 * @param {string} [className] - Classes CSS additionnelles.
 */
export default function AnimatedShape({
  type = 'pulse',
  size = 'medium',
  speed = 'normal',
  isAnimating = false,
  className,
  ...props
}) {
  // --- Calcul de la durée (inchangé) ---
  let baseDuration = 1500;
  switch(type) {
      case 'spin': baseDuration = 3000; break;
      case 'sonar': baseDuration = 2000; break;
      case 'barWave': baseDuration = 1200; break;
      case 'morph': baseDuration = 2500; break;
      default: baseDuration = 1500;
  }
  const duration = speed === 'fast' ? baseDuration * 0.6 : speed === 'slow' ? baseDuration * 1.5 : baseDuration;

  // --- Appel des hooks d'animation (inchangé) ---
  let animationStyle = {};
  let sonarStyles = null;
  let barWaveStyles = null;
  const sonarWaveCount = 3;
  const barWaveCount = 5;

  // Chaque hook reçoit maintenant `isAnimating`
  if (type === 'pulse') animationStyle = usePulseOutlineAnimation(duration, isAnimating);
  else if (type === 'spin') animationStyle = useSpinOutlineAnimation(duration, isAnimating);
  else if (type === 'sonar') { sonarStyles = useSonarAnimation(duration, sonarWaveCount, isAnimating); animationStyle = { position: 'relative' }; }
  else if (type === 'barWave') { barWaveStyles = useBarWaveAnimation(duration, barWaveCount, isAnimating); animationStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }; }
  else if (type === 'morph') animationStyle = useMorphOutlineAnimation(duration, isAnimating);
  else { animationStyle = getDefaultStyle(type); /* Gère les types inconnus avec le style par défaut */ }

  // --- Classes de style de base (inchangées) ---
  const sizeClasses = { small: 'w-6 h-6', medium: 'w-10 h-10', large: 'w-16 h-16'}[size] || 'w-10 h-10';
  const fixedOutlineClass = 'border-2 border-zinc-300';
  const shapeClasses = (type === 'pulse' || type === 'sonar' || type === 'morph') ? 'rounded-full' : (type === 'spin') ? 'rounded-sm' : '';
  const backgroundClass = 'bg-transparent';

  // --- Rendu Conditionnel (inchangé, utilise les styles retournés par les hooks) ---

  if (type === 'sonar') {
    // Si !isAnimating, sonarStyles sera un tableau de defaultStyle
    return (
      <div className={cn('inline-block', sizeClasses, className)} style={animationStyle} {...props}>
        {sonarStyles.map((style, index) => (
          <div key={index} className={cn('absolute inset-0 m-auto rounded-full', fixedOutlineClass)} style={style}/>
        ))}
      </div>
    );
  }

  if (type === 'barWave') {
    // Si !isAnimating, barWaveStyles sera un tableau de defaultStyle
    const barWidthPercent = `${Math.floor(100 / barWaveCount * 0.8)}%`;
      return (
        <div className={cn('inline-flex', sizeClasses, className)} style={animationStyle} {...props}>
          {barWaveStyles.map((style, index) => (
            <div key={index} className={cn('h-full bg-zinc-300 rounded-sm')} style={{ ...style, width: barWidthPercent }}/>
          ))}
        </div>
      );
  }

  // Cas par défaut (Pulse, Spin, Morph)
  // Si !isAnimating, animationStyle sera le defaultStyle correspondant
  return (
    <div
      className={cn(
        'inline-block', sizeClasses, backgroundClass, fixedOutlineClass,
        type !== 'morph' ? shapeClasses : '',
        // Ajoute la transition uniquement lorsque l'animation s'arrête
        !isAnimating ? 'transition-all duration-300 ease-out' : '',
        className
      )}
      style={animationStyle} // Applique le style animé ou le style par défaut réinitialisé
      {...props}
    />
  );
}