/**
 * @file Displays the list of historical versions for a branch in a table layout.
 */

"use client";

import { History, Trash2 } from "lucide-react";
import { version } from "react";

/**
 * A utility function to format an ISO date string into a more readable format.
 * @param {string} dateString - The ISO date string to format.
 * @returns {string} The formatted date (e.g., "18/04/2024").
 */
function formatDate(timestampInSeconds) {
  if (!timestampInSeconds) return "N/A";
  const date = new Date(timestampInSeconds * 1000);

  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/**
 * A component that renders a table of versions within the same branch.
 * It highlights the currently selected version and provides controls to select
 * a different version by clicking its row, or to delete a version.
 *
 * @param {object} props - The component props.
 * @param {Array<object>} props.versionList - The list of versions to display. Each object must have `id`, `name`, `branchName`, and `createdDate`.
 * @param {string} [props.selectedVersionId] - The ID of the currently selected version, used for highlighting.
 * @param {Function} props.onVersionChange - Callback function executed when a user clicks on a version row. Receives the version ID as an argument.
 * @returns {JSX.Element} The rendered version history table.
 */
export default function VersionBlockHistory({
  versionList,
  selectedVersionId,
  onVersionChange,
}) {
  if (!versionList || versionList.length === 0) {
    return (
      <div className="flex items-center justify-center p-4 border-t border-gray-700 text-gray-400">
        Aucun historique de version pour cette branche.
      </div>
    );
  }

  return (
    <div className="w-full border-t border-gray-700 pt-3">
      <div className="flex items-center gap-2 mb-3 px-2">
        <History className="text-gray-400" size={20} />
        <h3 className="text-lg font-semibold text-gray-300">
          Historique des Versions
        </h3>
      </div>
      <div className="overflow-x-auto bg-zinc-800">
        <table className="min-w-full w-full table-auto">
          <thead className="bg-gray-300">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-zinc-800">
                Nom
              </th>
              <th className="px-4 py-3 text-left font-medium text-zinc-800">
                Branche
              </th>
              <th className="px-4 py-3 text-left font-medium text-zinc-800 ">
                Date de Création
              </th>
            </tr>
          </thead>
          <tbody>
            {versionList.map((version) => {
              const isSelected = version.id === selectedVersionId;
              const rowClasses = `
                border-b border-neutral-700 transition-colors cursor-pointer hover:bg-zinc-700
                ${
                  isSelected
                    ? "bg-zinc-800"
                    : "hover:bg-neutral-700/50 cursor-pointer"
                }
              `;

              return (
                <tr
                  key={version.id}
                  className={rowClasses}
                  onClick={() => onVersionChange(version.id)}
                >
                  <td className="px-4 py-3 text-sm text-white font-semibold">
                    {version.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {version.branchName}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {formatDate(version.createdDate)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
