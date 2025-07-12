"use client";

import { useState } from "react";
import Link from "next/link";
import { format, isValid, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { DropdownMenuProjectCard } from "./DropdownMenuProjectCard";
import DataBadge from "@/components/shared/DataBadge";
import { cn } from "@/lib/utils";

/**
 * Displays a single project in a card format.
 * It handles its own hover state for animations and delegates actions
 * to a dropdown menu.
 * @param {object} props - The component props.
 * @param {object} props.project - The project data object.
 * @returns {JSX.Element} A project card component.
 */
export default function ProjectCard({ project }) {
  const [isHovered, setIsHovered] = useState(false);

  const formattedDate = (() => {
    const cd = project?.createdDate;
    if (!cd) return "N/A";

    let dateObj;

    if (typeof cd === "string") {
      dateObj = parseISO(cd);
    } else if (typeof cd === "number") {
      dateObj = new Date(cd * 1000);
    } else {
      return "N/A";
    }

    return isValid(dateObj)
      ? format(dateObj, "dd/MM/yyyy", { locale: fr })
      : "N/A";
  })();

  const projectUrl = `/projects/${project?.id}`;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "group relative flex h-52 w-full max-w-sm flex-col overflow-hidden rounded-lg border bg-card transition-all duration-300",
        isHovered ? "border-primary/50 shadow-lg" : "border-border"
      )}
    >
      <div className="absolute top-2 right-2 z-20">
        <DropdownMenuProjectCard
          projectId={project.id}
          onSetCardHovered={setIsHovered}
        />
      </div>

      <Link
        href={projectUrl}
        className="flex h-full w-full cursor-pointer flex-col"
      >
        <div className="flex items-center justify-between border-b border-border/50 p-3">
          <div className="mr-8 flex items-center space-x-2">
            <DataBadge
              type="projectStatus"
              value={project.projectStatus}
              variant="dot"
            />
            <span className="text-xs text-muted-foreground">
              {project.projectStatus}
            </span>
          </div>
        </div>

        <div className="flex-grow space-y-2 overflow-y-auto p-3">
          <h3
            className="font-semibold text-foreground line-clamp-2"
            title={project?.title}
          >
            {project?.title || "Untitled Project"}
          </h3>
          {project?.projectMusicalGendersPreDefined?.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {project.projectMusicalGendersPreDefined.map((genre, index) => (
                <DataBadge
                  key={index}
                  type="projectMusicalGender"
                  value={genre}
                  className="text-xs"
                />
              ))}
            </div>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-border/50 p-3 text-xs">
          <div className="text-muted-foreground">Crée: {formattedDate}</div>
        </div>
      </Link>
    </div>
  );
}
