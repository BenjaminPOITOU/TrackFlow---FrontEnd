"use client";

import React, { useRef, useEffect } from "react";
import PropTypes from 'prop-types';
import { cn } from "@/lib/utils"; 

export function MiniVisualizer({ type, className }) {
  const canvasRef = useRef(null);


  const animationState = useRef({
      circles: [],
      lastSpawnTime: 0,
      animationFrameId: null
  }).current;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

  
    animationState.circles = [];
    animationState.lastSpawnTime = 0;
    let localAnimationFrameId; 

    const resizeCanvas = () => {
       if (canvas.offsetParent === null) {
             localAnimationFrameId = requestAnimationFrame(resizeCanvas);
             return;
        }

        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        const targetWidth = Math.round(rect.width * dpr);
        const targetHeight = Math.round(rect.height * dpr);

      
        if (targetWidth > 0 && targetHeight > 0) {
            if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
                canvas.width = targetWidth;
                canvas.height = targetHeight;
                ctx.scale(dpr, dpr); 
                            }
        } else {
 
            localAnimationFrameId = requestAnimationFrame(resizeCanvas);
        }
    }

    // --- Fonctions de Dessin ---

    const drawWireframeCube = () => {

      const time = Date.now() * 0.001;
      const cssWidth = canvas.getBoundingClientRect().width;
      const cssHeight = canvas.getBoundingClientRect().height;
      if (cssWidth === 0 || cssHeight === 0) return; 

      const size = Math.min(cssWidth, cssHeight) * 0.3;
      const centerX = cssWidth / 2;
      const centerY = cssHeight / 2;
      const points = [[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]];
      const rotateX = time * 0.5;
      const rotateY = time * 0.3;
      const transformedPoints = points.map(([x, y, z]) => {
          const y1=y*Math.cos(rotateX)-z*Math.sin(rotateX);
          const z1=y*Math.sin(rotateX)+z*Math.cos(rotateX);
          const x1=x*Math.cos(rotateY)+z1*Math.sin(rotateY);
          const z2=-x*Math.sin(rotateY)+z1*Math.cos(rotateY);
          const scale=1/(2+z2); 
          const projX=centerX+x1*size*scale;
          const projY=centerY+y1*size*scale;
          return [projX, projY];
      });
      const edges = [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
      
      ctx.clearRect(0, 0, cssWidth, cssHeight); 
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 1 / (window.devicePixelRatio || 1); 
      
      edges.forEach(([a, b]) => {
          ctx.beginPath();
          ctx.moveTo(transformedPoints[a][0], transformedPoints[a][1]);
          ctx.lineTo(transformedPoints[b][0], transformedPoints[b][1]);
          ctx.stroke();
      });
    };

    const drawWaveform = () => {
       const time = Date.now() * 0.001;
       const cssWidth = canvas.getBoundingClientRect().width;
       const cssHeight = canvas.getBoundingClientRect().height;
       if (cssWidth === 0 || cssHeight === 0) return; // Sécurité

      
       const amplitude = cssHeight * 0.3; 
       const frequency = Math.max(2, Math.round(cssWidth / 10)); 
  
       ctx.clearRect(0, 0, cssWidth, cssHeight);
       ctx.strokeStyle = "#FFFFFF";
       ctx.lineWidth = 1 / (window.devicePixelRatio || 1);
       ctx.beginPath();
       for (let i = 0; i < cssWidth; i++) {
           const x = i;
           const normalizedI = i / cssWidth;
           // Onde sinus
           let y = Math.sin(normalizedI * frequency * Math.PI * 2 + time * 4) * amplitude; 
           y += cssHeight / 2; 
           if (i === 0) { ctx.moveTo(x, y); } else { ctx.lineTo(x, y); }
       }
       ctx.stroke();
    };

    const drawExpandingCircles = (timestamp) => {
      const cssWidth = canvas.getBoundingClientRect().width;
      const cssHeight = canvas.getBoundingClientRect().height;
       if (cssWidth === 0 || cssHeight === 0) return; 

      const centerX = cssWidth / 2;
      const centerY = cssHeight / 2;
      const maxAllowedRadius = Math.min(centerX, centerY) * 0.9; 
      const spawnInterval = 600; // Millisecondes

      const radiusSpeed = maxAllowedRadius / 60; 
      const opacityDecay = 0.8 / 70; 



    
      if (animationState.lastSpawnTime === 0 && timestamp) {
          animationState.lastSpawnTime = timestamp;
      }

      ctx.clearRect(0, 0, cssWidth, cssHeight);
      ctx.lineWidth = 1 / (window.devicePixelRatio || 1);


      if (timestamp && timestamp - animationState.lastSpawnTime > spawnInterval) {
        animationState.circles.push({ r: 0, opacity: 0.8 });
        animationState.lastSpawnTime = timestamp;
      }


      for (let i = animationState.circles.length - 1; i >= 0; i--) {
        const circle = animationState.circles[i];
        
     
        if (circle.r > maxAllowedRadius) {
            circle.opacity -= opacityDecay * 2; 
        } else {
             circle.r += radiusSpeed; 
        }
       
        circle.opacity -= opacityDecay; 

  
        if (circle.opacity <= 0) {
          animationState.circles.splice(i, 1); 
          continue;
        }


        ctx.strokeStyle = `rgba(255, 255, 255, ${Math.max(0, circle.opacity)})`; 
        ctx.beginPath();
        ctx.arc(centerX, centerY, Math.max(0, circle.r), 0, Math.PI * 2);
        ctx.stroke();
      }
    };

     const drawGrid = () => {
  
       const cssWidth = canvas.getBoundingClientRect().width;
       const cssHeight = canvas.getBoundingClientRect().height;
       if (cssWidth === 0 || cssHeight === 0) return;

      const numDivisions = 3; 
      const spacingX = cssWidth / numDivisions;
      const spacingY = cssHeight / numDivisions;

      ctx.clearRect(0, 0, cssWidth, cssHeight);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.3)"; 
      ctx.lineWidth = 0.5 / (window.devicePixelRatio || 1);

      // Lignes verticales
      for (let i = 1; i < numDivisions; i++) {
          const x = spacingX * i;
          ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, cssHeight); ctx.stroke();
      }
      // Lignes horizontales
      for (let i = 1; i < numDivisions; i++) {
          const y = spacingY * i;
          ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(cssWidth, y); ctx.stroke();
      }
    };

    // --- Boucle d'Animation ---
    const animate = (timestamp) => {
       const rect = canvas.getBoundingClientRect();
       if (rect.width === 0 || rect.height === 0) {
           localAnimationFrameId = requestAnimationFrame(animate);
           animationState.animationFrameId = localAnimationFrameId; 
           return;
       }

      // Appelle la fonction de dessin appropriée
      switch (type) {
        case "cube":    drawWireframeCube(); break;
        case "wave":    drawWaveform(); break;
        case "circles": drawExpandingCircles(timestamp); break; // Passe le timestamp
        case "grid":    drawGrid(); break;
        default:
          // Cas par défaut: efface simplement le canvas
          const cssWidth = rect.width;
          const cssHeight = rect.height;
          ctx.clearRect(0, 0, cssWidth, cssHeight);
      }

      // Demande le prochain frame d'animation
      localAnimationFrameId = requestAnimationFrame(animate);
      animationState.animationFrameId = localAnimationFrameId; 
    };

    // Initialisation et Nettoyage
    resizeCanvas(); // Appel initial pour définir la taille
    localAnimationFrameId = requestAnimationFrame(animate); // Lance l'animation
    animationState.animationFrameId = localAnimationFrameId; // Stocke l'ID initial

    // Ajout d'un écouteur pour le redimensionnement de la fenêtre
    const handleResize = () => {
        resizeCanvas(); // Redéfinit la taille interne et le scale DPR
    };
    window.addEventListener('resize', handleResize);


    // Fonction de nettoyage appelée quand le composant est démonté ou que 'type' change
    return () => {
      if (animationState.animationFrameId) { // Utilise l'ID stocké dans l'état
        cancelAnimationFrame(animationState.animationFrameId);
        animationState.animationFrameId = null; // Réinitialise l'ID stocké
      }
      window.removeEventListener('resize', handleResize); // Nettoie l'écouteur
      // Réinitialise l'état spécifique (cercles) au cas où le type change sans démontage complet
      animationState.circles = [];
      animationState.lastSpawnTime = 0;
    };

  }, [type, animationState]); // animationState est dans les dépendances car c'est un objet ref mutable que l'effet utilise

  return (
    <canvas
      ref={canvasRef}
      className={cn("block", className)} // `block` pour éviter des espaces sous le canvas
    />
  );
}

MiniVisualizer.propTypes = {
  type: PropTypes.oneOf(['cube', 'wave', 'circles', 'grid']).isRequired,
  className: PropTypes.string,
};

MiniVisualizer.defaultProps = {
  className: 'w-full h-full', // Garde la valeur par défaut pour flexibilité
};
