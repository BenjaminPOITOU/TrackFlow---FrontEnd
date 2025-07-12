"use client";


/**
 * @file Renders a list of compositions with header and sorting/filtering controls.
 */

/**
 * Renders a list of compositions for a project.
 * This component is presentational and receives its data and callbacks via props.
 *
 * @param {object} props The component props.
 * @param {Array<object>} props.compositions An array of composition objects.
 * @param {string|number} props.projectId The ID of the parent project.
 * @param {Function} props.onCompositionDeleted A callback for when a composition is deleted.
 * @param {Function} props.onCompositionUpdated A callback for when a composition is updated.
 * @returns {React.ReactElement} The rendered list of compositions.
 */

import { CompositionCard } from "./CompositionCard";

export function CompositionList({
  compositions,
  projectId,
  onCompositionDeleted,
  onCompositionUpdated,
}) {
  return (
    <div className="flex flex-col w-full gap-2 justify-start items-center">
      <div className="w-full flex border-b border-b-gray-300 pb-1 items-center justify-between uppercase">
        <span className="text-xl tracking-wider text-gray-300">
          COMPOSITIONS
        </span>
      </div>

      <div className="w-full">
        {compositions.length > 0 ? (
          <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="hidden sm:table-header-group">
                <tr className="border-b border-gray-700">
                  <th className="text-left p-3 text-[0.875rem] font-medium text-gray-300">
                    Composition
                  </th>
                  <th className="text-center p-3 text-[0.875rem] font-medium text-gray-300">
                    Versions
                  </th>
                  <th className="text-center p-3 text-[0.875rem] font-medium text-gray-300">
                    Branches
                  </th>
                  <th className="text-center p-3 text-[0.875rem] font-medium text-gray-300">
                    Statut
                  </th>
                  <th className="text-center p-3 text-[0.875rem] font-medium text-gray-300">
                    Date
                  </th>
                  <th className="text-center p-3 text-[0.875rem] font-medium text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {compositions.map((composition, index) => {
                  const backgroundClass =
                    index % 2 === 0 ? "bg-neutral-800" : "bg-zinc-900";
                  return (
                    <CompositionCard
                      key={composition.id || index}
                      composition={composition}
                      background={backgroundClass}
                      projectId={projectId}
                      onCompositionDeleted={onCompositionDeleted}
                      onCompositionUpdated={onCompositionUpdated}
                    />
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-[0.875rem] text-gray-500 p-4 text-center">
            Aucune composition trouvée.
          </p>
        )}
      </div>
    </div>
  );
}
