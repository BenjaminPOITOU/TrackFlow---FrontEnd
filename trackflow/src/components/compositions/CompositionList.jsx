"use client";

import { CompositionCard } from "./CompositionCard";

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
export function CompositionList({ compositions, projectId, onCompositionDeleted, onCompositionUpdated }) {
  return (
    <div className="flex flex-col w-full gap-2 justify-start items-center">
      <div className="w-full flex border-b border-b-gray-300 pb-1 items-center justify-between uppercase">
        <span className="text-xl tracking-wider text-gray-300">COMPOSITIONS</span>
      </div>

      <div className="flex w-full border border-gray-300 px-2">
        <div className="w-1/3 self-start"><span className="text-xs">TITRE</span></div>
        <div className="w-2/3 flex items-center">
          <span className="flex-1 text-xs text-center">VERSIONS</span>
          <span className="flex-1 text-xs text-center">BRANCHES</span>
          <span className="flex-1 text-xs text-center">STATUT</span>
          <span className="flex-1 text-xs text-center">MODIFIEE</span>
        </div>
      </div>

      <div className="w-full flex flex-col gap-1">
        {compositions.length > 0 ? (
          compositions.map((composition, index) => {
            const backgroundClass = index % 2 === 0 ? "bg-neutral-800" : "bg-zinc-900";
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
          })
        ) : (
          <p className="text-sm text-gray-500 p-4 text-center">Aucune composition trouvée.</p>
        )}
      </div>
    </div>
  );
}