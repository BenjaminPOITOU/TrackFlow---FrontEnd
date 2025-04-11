
import React, { useState, useEffect } from 'react';
import { DropdownMenuProjectCard } from './DropdownMenuProjectCard';
import DataBadge from "../shared/DataBadge";
import AnimatedShape from '@/lib/AnimatedShapes';
import { cn } from "@/lib/utils";
import Link from 'next/link';
import { format, isValid, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';



const statusLabels = { EN_COURS: "En cours", FINALISE: "Finalisé", EN_PAUSE: "En pause", DEFAULT: "Inconnu" };
const genreLabels = {};



export default function ProjectCard({ project }) {
    // --- États et Handlers pour le survol/glitch ---
    const [isHovered, setIsHovered] = useState(false);
    let shape="morph";
   

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);
    

 
    const projectStatusValue = project?.projectStatus || 'DEFAULT';
    const genres = project?.projectMusicalGendersPreDefined || [];
 
   const formattedDate = project?.createdDate
                      ? (() => {
                          
                           const dateObj = parseISO(project.createdDate);
                       
                           return isValid(dateObj)
                               
                                  ? format(dateObj, 'dd/MM/yyyy', { locale: fr }) 
                                  : 'N/A';
                        })()
                      : 'N/A';


    const projectUrl = `/projects/${project?.id}`;


    switch(projectStatusValue) {
    

        case("EN_COURS"): shape="pulse";
            break;
        case("FINALISE"): shape="spin";
            break;
        case("EN_PAUSE"): shape="sonar";
            break;
        
        default:

    }
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
              
            
                <div className="opacity-50 group-hover:opacity-100 transition-opacity duration-300">
                    
                    <AnimatedShape
                        type={shape}    
                        size="small" 
                        speed="normal"
                        isAnimating={isHovered} 
                    /> 
                </div> 

               
                <div className="flex items-center space-x-2"> 
                    <DataBadge
                        type="projectStatus"
                        value={projectStatusValue}
                        variant="dot" 
                    />
                    <span className="text-xs text-muted-foreground">
                        {projectStatusValue}
                    </span>
                  
                    <div className="text-muted-foreground hover:text-foreground transition-colors">
                         <DropdownMenuProjectCard className="w-5 h-5 border border-gray-300 hover:bg-zinc-700 rounded" />
                         <span className="sr-only">Options</span>
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
            <div className="flex justify-between items-center p-3 text-xs border-t border-zinc-700/50">
                <div className="text-muted-foreground">
                    MAJ : {formattedDate}
                </div>
            </div>
        </Link>
    );
}