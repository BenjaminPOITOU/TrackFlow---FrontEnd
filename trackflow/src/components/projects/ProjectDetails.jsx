import { useState } from "react";
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
import { ProjectUpdateModal } from "../modals/ProjectUpdateModal";

const projectStatusStyles = {
  EN_COURS: {
    bg: "bg-orange-950",
    text: "text-orange-400",
    border: "border-orange-700",
  },
  FINALISE: {
    bg: "bg-lime-950",
    text: "text-lime-400",
    border: "border-lime-700",
  },
  EN_PAUSE: {
    bg: "bg-gray-300",
    text: "text-emerald-400",
    border: "border-emerald-700",
  },
  DEFAULT: {
    bg: "bg-gray-800",
    text: "text-gray-400",
    border: "border-gray-600",
  },
};

const genreLabels = {};

export function ProjectDetails({ project, user }) {
  const genres = project?.projectMusicalGendersPreDefined || [];
  const projectPurposes = project?.projectPurposes || [];
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  function handleUpdateModal() {

  if (user && user.id) {
      setIsUpdateModalOpen(true);
    } else {
      console.warn("Impossible d'ouvrir la modale : utilisateur non connecté ou auth non prête.");
    }
  }
  const formattedCreatedDate = project?.createdDate
    ? (() => {
        const dateObj = parseISO(project.createdDate);

        return isValid(dateObj)
          ? format(dateObj, "dd/MM/yyyy", { locale: fr })
          : "N/A";
      })()
    : "N/A";

    const formattedUpdatedDate = project?.updateDate
    ? (() => {
        const dateObj = parseISO(project.updateDate);

        return isValid(dateObj)
          ? format(dateObj, "dd/MM/yyyy", { locale: fr })
          : "N/A";
      })()
    : "N/A";


  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isProjectStatusOpen, setIsProjectStatusOpen] = useState(false);

  function setHandleClickProjectDetails() {
    setIsDetailsOpen(!isDetailsOpen);
  }
  function setHandleClickProjectStatus() {
    setIsProjectStatusOpen(!isProjectStatusOpen);
  }

  return (
    <div className="flex flex-col justify-start items-center w-full gap-1 rounded">
      <div className="w-full flex justify-start items-center  p-2 border border-gray-300 rounded-t">
        <div className="flex justify-between items-center gap-2 px-2 w-full">
          <div className="flex justify-start items-center gap-4">
            <button
              onClick={setHandleClickProjectDetails}
              className="flex justify-start items-center gap-2 cursor-pointer"
            >
              {!isDetailsOpen && <ChevronRight color="#e0e0e0" />}
              {isDetailsOpen && <ChevronDown color="#e0e0e0" />}
              <span className="text-lg">PROJECT_DETAILS</span>
            </button>

            <button onClick={handleUpdateModal} className="cursor-pointer">
              <SquarePen className="w-6 h-6" color="#e0e0e0" />
            </button>
          </div>
          <div className="flex justify-center items-center gap-2">
            <ChartLine color="#e0e0e0" />

            <span className="text-sm">PROGRESS : </span>
              <div className="bg-neutral-800 p-2 items-center flex justify-center rounded">
                <span
                  className={`text-sm ${
                    (
                      projectStatusStyles[project.projectStatus] ||
                      projectStatusStyles.DEFAULT
                    ).text
                  }`}
                >
                  {project.projectStatus}
                </span>
              </div>
          </div>
        </div>
        <div className="h-6 border-r border-gray-300"></div>
        <div className="flex justify-center items-center gap-1 px-2">
          <div className="flex items-center gap-2">
            <CalendarMinus2 color="#e0e0e0" />
            <span className="text-sm"> CREATED : {formattedCreatedDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock color="#e0e0e0" />
            <span className="text-sm"> UPDATED : {formattedUpdatedDate}</span>
          </div>
        </div>
      </div>

      {isDetailsOpen && (
        <div className="flex flex-col gap-2 justify-center items-center border  border-gray-300 rounded-b  w-full">
          <div className="flex justify-center items-center px-2 gap-4 w-full">
            <div className="w-full flex flex-col  py-2 gap-2">
              <div className="flex gap-1 justify-start items-center">
                <BookA className="w-4 h-4" color="#e0e0e0" />
                <span className="text-sm"> DESCRIPTION </span>
              </div>
              <div className="w-full bg-neutral-800 px-2">
                {project.description}
              </div>
            </div>
            <div className="w-full flex flex-col py-2 gap-2">
              <div className="flex gap-1 justify-start items-center">
                <BookA className="w-4 h-4" color="#e0e0e0" />
                <span className="text-sm"> GENRE </span>
              </div>
              <div className="w-full px-2">
                {genres.map((genreValue, index) => (
                  <DataBadge
                    key={`${genreValue}-${index}`}
                    type="projectMusicalGender"
                    value={genreValue}
                    label={genreLabels?.[genreValue] || genreValue}
                    variant="badge"
                    styleIndex={index}
                    className="text-xs"
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-center items-center px-2 gap-4 w-full">
            <div className="w-full flex flex-col  py-2 gap-2">
              <div className="flex gap-1 justify-start items-center">
                <BaggageClaim className="w-4 h-4" color="#e0e0e0" />
                <span className="text-sm"> PROJECT_TYPE </span>
              </div>
              <div className="w-full bg-neutral-800 px-2">
                {project.projectType}
              </div>
            </div>
            <div className="w-full flex flex-col  py-2 gap-2">
              <div className="flex gap-1 justify-start items-center">
                <DollarSign className="w-4 h-4" color="#e0e0e0" />
                <span className="text-sm"> COMMERCIAL_STATUS </span>
              </div>
              <div className="w-full bg-neutral-800 px-2">
                {project.projectCommercialStatus}
              </div>
            </div>
          </div>
          <div className="flex justify-center items-center px-2 gap-4 w-full">
            <div className="w-full flex flex-col  py-2 gap-2">
              <div className="flex gap-1 justify-start items-center">
                <Target color="#e0e0e0" className="w-4 h-4" />
                <span className="text-sm"> PURPOSE </span>
              </div>
              <div className="w-full flex gap-2 bg-neutral-800 px-2">
                {projectPurposes.map((purpose) => (
                  <div key={purpose}>{purpose}</div>
                ))}
              </div>
            </div>
            <div className="w-full flex flex-col  py-2 gap-2">
              <div className="flex gap-1 justify-start items-center">
                <Clock className="w-4 h-4" color="#e0e0e0" />
                <span className="text-sm"> PROJECT_STATUS </span>
              </div>
              <div className="w-full bg-neutral-800 px-2">
                <span
                  className={`${
                    (
                      projectStatusStyles[project.projectStatus] ||
                      projectStatusStyles.DEFAULT
                    ).text
                  }`}
                >
                  {project.projectStatus}
                </span>
              </div>
            </div>
          </div>
          <div className="flex justify-center items-center px-2 gap-4 w-full">
            <div className="w-full flex flex-col  py-2 gap-2">
              <div className="flex gap-1 justify-start items-center">
                <Music color="#e0e0e0" className="w-4 h-4" />
                <span className="text-sm"> COMPOSITIONS </span>
              </div>
              <div className="w-full text-sm flex gap-2 bg-neutral-800 px-2">
                {`${project?.compositionsTotal}-TOTAL`}
              </div>
            </div>
          </div>
        </div>
      )}
      {isUpdateModalOpen && project?.id && (
        <ProjectUpdateModal
          isOpen={isUpdateModalOpen}
          onOpenChange={setIsUpdateModalOpen}
          projectId={project.id}
          userId = {user.id}
          onProjectUpdated={() => {
            // TODO: Implémenter la logique de rafraîchissement
            // Par exemple, appeler une fonction passée depuis compositionPage
            console.log("Besoin de rafraîchir les données du projet ici !");
            setIsUpdateModalOpen(false); // Fermer la modale
          }}
        />
      )}
    </div>
  );
}
