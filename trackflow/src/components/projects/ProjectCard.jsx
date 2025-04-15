"use client"

// Garder tous tes imports d'origine
import React, { useState, useEffect, useCallback } from 'react'; // useCallback ajouté/gardé
import { DropdownMenuProjectCard } from './DropdownMenuProjectCard';
import DataBadge from "../shared/DataBadge";
import AnimatedShape from '@/lib/AnimatedShapes'; // Assurez-vous que le chemin est correct
import { cn } from "@/lib/utils";
import Link from 'next/link';
import { format, isValid, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';


 const statusLabels = { EN_COURS: "En cours", FINALISE: "Finalisé", EN_PAUSE: "En pause", DEFAULT: "Inconnu" };
const genreLabels = {}; // On n'utilise pas genreLabels ici

// Le composant avec ses props d'origine + les callbacks
export default function ProjectCard({ project, userId, onArchive, onDelete }) { // onArchive et onDelete ajoutés

    // Garder tes états et handlers d'origine
    const [isHovered, setIsHovered] = useState(false);
    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    // Garder tes variables dérivées d'origine
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

    
    let shape="morph";
    switch(projectStatusValue) {
        case("EN_COURS"): shape="pulse"; break;
        case("FINALISE"): shape="spin"; break;
        case("EN_PAUSE"): shape="sonar"; break;
        default: shape="morph";
    }

 
    const handleArchive = useCallback(() => { if (onArchive) onArchive(project.id); }, [onArchive, project.id]);
    const handleDelete = useCallback(() => { if (onDelete) onDelete(project.id); }, [onDelete, project.id]);


    return (
      
        <div
            className={cn(
                "flex flex-col",
                "w-full max-w-xs sm:max-w-sm",
                "h-52",
                "rounded border",
                "bg-neutral-800",
                "transition-all duration-300",
                "relative group overflow-hidden", // relative EST IMPORTANT
                 // "cursor-pointer", // Le curseur vient du Link maintenant
                isHovered ? "border-zinc-400 glow-card" : "border-zinc-700"
            )}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* ---> Dropdown Positionné en Absolu - EN DEHORS DU LINK <--- */}
            {/* Placé en premier dans le DOM mais positionné visuellement en haut à droite */}
            <div className="absolute top-2 right-2 z-20"> {/* Position + z-index */}
                <DropdownMenuProjectCard
                    // Classes de base que tu avais sur le wrapper du dropdown
                    className="w-5 h-5 border border-gray-300 hover:bg-zinc-700 rounded"
                    projectId={project.id}
                    userId={userId}
                    onProjectArchived={handleArchive} // Utiliser les callbacks
                    onProjectDeleted={handleDelete}  // Utiliser les callbacks
                />
            </div>

            {/* ---> Link qui enveloppe TOUT LE RESTE du contenu <--- */}
            <Link
                href={projectUrl}
                className="flex flex-col h-full w-full cursor-pointer focus:outline-none" // Prend toute la place
                aria-label={`View project ${project?.title || 'untitled'}`}
            >
                {/* Container interne pour le layout flex du contenu */}
                <div className="flex flex-col h-full">

                    {/* === Section En-tête (DANS LE LINK, SANS DROPDOWN) === */}
                    <div className="flex justify-between items-center p-3 border-b border-zinc-700/50">
                        {/* Garder ton AnimatedShape d'origine */}
                        <div className="opacity-50 group-hover:opacity-100 transition-opacity duration-300">
                            <AnimatedShape
                                type={shape}
                                size="small"
                                speed="normal"
                                isAnimating={isHovered}
                            />
                        </div>
                        {/* Garder ton affichage de statut d'origine + Marge */}
                        <div className="flex items-center space-x-2 mr-8"> {/* Marge pour éviter superposition */}
                            <DataBadge
                                type="projectStatus"
                                value={projectStatusValue}
                                variant="dot"
                            />
                            <span className="text-xs text-muted-foreground">
                                {projectStatusValue} {/* Afficher la valeur brute comme avant */}
                            </span>
                             {/* Le Dropdown n'est PLUS ici */}
                        </div>
                    </div>

                    {/* === Section Corps (DANS LE LINK) === */}
                    <div className="flex-grow p-3 space-y-2 overflow-y-auto">
                        {/* Garder ton affichage de titre d'origine */}
                        <h3 className="text-sm font-semibold text-foreground line-clamp-2" title={project?.title}>
                            {project?.title || 'Projet sans titre'}
                        </h3>

                        {/* Garder ton affichage de genres d'origine */}
                        {genres.length > 0 && (
                            <div className="flex flex-wrap gap-1 pt-1">
                                {genres.map((genreValue, index) => (
                                    <DataBadge
                                        key={`${genreValue}-${index}`}
                                        type="projectMusicalGender"
                                        value={genreValue}
                                        // label={genreLabels?.[genreValue] || genreValue} // PAS DE LABELS ICI
                                        label={genreValue} // Afficher la valeur brute comme avant
                                        variant="badge"
                                        styleIndex={index}
                                        className="text-xs"
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* === Section Footer (DANS LE LINK) === */}
                    <div className="flex justify-between items-center p-3 text-xs border-t border-zinc-700/50 mt-auto">
                        {/* Garder ton affichage de date d'origine */}
                        <div className="text-muted-foreground">
                            CREATED : {formattedDate}
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}