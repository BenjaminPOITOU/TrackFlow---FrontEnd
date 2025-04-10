// src/components/projects/ProjectCard.jsx

// Imports (vérifie le chemin pour AnimatedShape !)
import React, { useState, useEffect } from 'react';
import { DropdownMenuProjectCard } from './DropdownMenuProjectCard';
import DataBadge from "../shared/DataBadge"; // Vérifie le chemin
import AnimatedShape from '@/lib/AnimatedShapes';
import { cn } from "@/lib/utils";
import Link from 'next/link';


// Mappings pour les labels (conservés)
const statusLabels = { EN_COURS: "En cours", FINALISE: "Finalisé", EN_PAUSE: "En pause", DEFAULT: "Inconnu" };
const genreLabels = { /* ... colle ton mapping de labels de genre ici si tu veux l'utiliser ... */ };


export default function ProjectCard({ project }) {
    // --- États et Handlers pour le survol/glitch ---
    const [isHovered, setIsHovered] = useState(false);
   

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

   

 
    const projectStatusValue = project?.projectStatus || 'DEFAULT';
    const statusText = statusLabels[projectStatusValue] || statusLabels.DEFAULT;
    const genres = project?.projectMusicalGendersPreDefined || [];
 
    const formattedDate = project?.updateDate
                          ? new Date(project.updateDate[0]).toLocaleDateString()
                          : 'N/A';


    const projectUrl = `/projects/${project?.id}`;
    return (
        <Link
        href={projectUrl}

            className={cn(
                "flex flex-col",                         
                "w-full max-w-xs sm:max-w-sm",        
                "h-52",                                
                "rounded border",                       
                "bg-neutral-800",                        
                "transition-all duration-300",          
                "relative group overflow-hidden",       
                "cursor-pointer",
                isHovered ? "border-zinc-400 glow-card" : "border-zinc-700"
            )}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* === Section En-tête === */}
            <div className="flex justify-between items-center p-3 border-b border-zinc-700/50"> 
                {/* --- Gauche : Animation --- */}
            
                <div className="opacity-50 group-hover:opacity-100 transition-opacity duration-300">
                    
                    <AnimatedShape
                        type="pulse"     
                        size="small" 
                        speed="normal"
                        isAnimating={isHovered} 
                    /> 
                </div> 

                {/* --- Droite : Statut + Ellipsis --- */}
                <div className="flex items-center space-x-2"> {/* Aligne point, texte, icône */}
                    <DataBadge
                        type="projectStatus"
                        value={projectStatusValue}
                        variant="dot" // Affiche le point coloré
                    />
                    <span className="text-xs text-muted-foreground">
                        {statusText}
                    </span>
                    {/* Icône Ellipsis (menu potentiel ?) */}
                    <div className="text-muted-foreground hover:text-foreground transition-colors">
                         <DropdownMenuProjectCard className="w-5 h-5 border border-gray-300 hover:bg-zinc-700 rounded" />
                         <span className="sr-only">Options</span> {/* Pour l'accessibilité */}
                    </div>
                </div>
            </div>

            {/* === Section Corps (Titre + Genres) === */}
            <div className="flex-grow p-3 space-y-2 overflow-y-auto"> {/* Padding, espace vertical, scroll si contenu dépasse */}

                {/* Titre du Projet */}
                <h3 className="text-sm font-semibold text-foreground" title={project?.title}>
                    {project?.title || 'Projet sans titre'}
                </h3>

                {/* Genres Musicaux */}
                {genres.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                         {genres.map((genreValue, index) => (
                           <DataBadge
                             key={`${genreValue}-${index}`}
                             type="projectMusicalGender"
                             value={genreValue}
                             // Utilise le label si défini, sinon la valeur brute
                             label={genreLabels?.[genreValue] || genreValue}
                             variant="badge"
                             styleIndex={index} // Pour la couleur cyclique
                             className="text-xs"
                           />
                         ))}
                    </div>
                )}
            </div>

            {/* === Section Footer (Date + Glitch) === */}
            <div className="flex justify-between items-center p-3 text-xs border-t border-zinc-700/50"> {/* Padding, bordure haute légère */}
                <div className="text-muted-foreground">
                    Maj: {formattedDate}
                </div>
            </div>
        </Link>
    );
}