/**
 * @file components/projects/ProjectDetails.js (or .tsx)
 * @description A comprehensive, interactive panel that displays detailed information about a project.
 * It features a collapsible UI and provides an entry point for editing the project via a modal.
 */

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  ChevronRight,
  ChartLine,
  CalendarMinus2,
  Clock,
  BookA,
  BaggageClaim,
  DollarSign,
  Target,
  Music,
  SquarePen,
} from "lucide-react";
import { format, isValid, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import DataBadge from "../shared/DataBadge";
import { ProjectUpdateModal } from "../modals/projectUpdateModal/ProjectUpdateModal";

/**
 * A utility function to safely format a date from various input types.
 * @param {string|number|null} dateInput - The date to format, which can be an ISO string or a Unix timestamp in seconds.
 * @returns {string} The formatted date string (e.g., "23/10/2023") or 'N/A' if the input is invalid.
 */
const formatDate = (dateInput) => {
  if (!dateInput) return "N/A";

  let dateObj;

  if (typeof dateInput === "string") {
    dateObj = parseISO(dateInput);
  } else if (typeof dateInput === "number") {
    dateObj = new Date(dateInput * 1000);
  } else {
    return "N/A";
  }

  return isValid(dateObj)
    ? format(dateObj, "dd/MM/yyyy", { locale: fr })
    : "N/A";
};
/**
 * A presentational sub-component for rendering a single key-value detail item
 * with a consistent layout (icon, label, value).
 * @param {{icon: React.ElementType, label: string, children: React.ReactNode}} props
 * @returns {JSX.Element}
 */
const DetailItem = ({ icon: Icon, label, children }) => (
  <div className="w-full flex flex-col py-2 gap-2">
    <div className="flex gap-2 items-center">
      <Icon className="w-4 h-4 text-gray-400 flex-shrink-0" />
      <span className="text-sm font-medium text-gray-300">{label}</span>
    </div>
    <div className="w-full bg-neutral-800 px-3 py-2 rounded text-sm text-gray-200 min-h-[40px] flex items-center">
      {children}
    </div>
  </div>
);
/**
 * Renders an interactive panel displaying the details of a given project.
 *
 * This component manages its own UI state for:
 * - A collapsible details section.
 * - The visibility of the `ProjectUpdateModal` for editing.
 * It fetches no data itself but orchestrates the display of the `project` prop data
 * and triggers parent callbacks upon successful updates.
 *
 * @param {object} props - The component props.
 * @param {object} props.project - The full project data object to display.
 * @param {object} props.user - The current user object, required for the update modal's authorization logic.
 * @param {function(): void} props.onProjectUpdated - A callback function executed after the project is successfully updated, to allow the parent to refetch data.
 * @returns {JSX.Element}
 */
export function ProjectDetails({ project, user, onProjectUpdated }) {
  const router = useRouter();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(true);

  const toggleDetails = useCallback(
    () => setIsDetailsOpen((prev) => !prev),
    []
  );
  const openUpdateModal = useCallback(() => setIsUpdateModalOpen(true), []);

  const handleProjectUpdated = () => {
    onProjectUpdated();
  };

  return (
    <div className="flex flex-col justify-start items-center w-full gap-1 rounded">
      <div className="w-full flex justify-between items-center p-3 border border-gray-700 bg-neutral-900 rounded-t">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleDetails}
            className="flex items-center gap-2 cursor-pointer text-gray-200 hover:text-white transition-colors"
          >
            {isDetailsOpen ? (
              <ChevronDown size={20} />
            ) : (
              <ChevronRight size={20} />
            )}
            <span className="text-lg font-semibold">DETAILS DU PROJET</span>
          </button>
          <button
            onClick={openUpdateModal}
            className="cursor-pointer text-gray-400 hover:text-white transition-colors"
            aria-label="Edit project"
          >
            <SquarePen size={18} />
          </button>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <CalendarMinus2 size={16} />
            <span>CREE : {formatDate(project.createdDate)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} />
            <span>MIS A JOUR : {formatDate(project.updateDate)}</span>
          </div>
        </div>
      </div>

      {isDetailsOpen && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 p-4 border border-t-0 border-gray-700 bg-neutral-900 rounded-b w-full">
          <DetailItem icon={BookA} label="DESCRIPTION">
            {project.description || (
              <span className="italic text-gray-500">Pas de description</span>
            )}
          </DetailItem>
          <DetailItem icon={Music} label="GENRE">
            <div className="flex flex-wrap gap-2">
              {project.projectMusicalGendersPreDefined?.length > 0 ? (
                project.projectMusicalGendersPreDefined.map((genre, index) => (
                  <DataBadge
                    key={`${genre}-${index}`}
                    type="projectMusicalGender"
                    value={genre}
                    variant="badge"
                    styleIndex={index}
                  />
                ))
              ) : (
                <span className="italic text-gray-500">
                  Pas de genre spécifié
                </span>
              )}
            </div>
          </DetailItem>
          <DetailItem icon={BaggageClaim} label="PROJECT_TYPE">
            {project.projectType}
          </DetailItem>
          <DetailItem icon={DollarSign} label="COMMERCIAL_STATUS">
            {project.projectCommercialStatus}
          </DetailItem>
          <DetailItem icon={Target} label="PURPOSE">
            <div className="flex flex-wrap gap-2">
              {project.projectPurposes?.length > 0 ? (
                project.projectPurposes.map((purpose) => (
                  <div
                    key={purpose}
                    className="bg-neutral-700 px-2 py-1 rounded text-xs"
                  >
                    {purpose}
                  </div>
                ))
              ) : (
                <span className="italic text-gray-500">
                  Aucun objectif spécifié
                </span>
              )}
            </div>
          </DetailItem>
          <DetailItem icon={ChartLine} label="PROJECT_STATUS">
            <DataBadge
              type="projectStatus"
              value={project.projectStatus}
              variant="dot"
            />
            <span className="ml-2">{project.projectStatus}</span>
          </DetailItem>
          <DetailItem icon={Music} label="COMPOSITIONS">
            {`${project?.compositionsTotal || 0} TOTAL`}
          </DetailItem>
        </div>
      )}

      {isUpdateModalOpen && project?.id && user?.id && (
        <ProjectUpdateModal
          isOpen={isUpdateModalOpen}
          onOpenChange={setIsUpdateModalOpen}
          projectId={project.id}
          userId={user.id}
          onProjectUpdated={handleProjectUpdated}
        />
      )}
    </div>
  );
}
