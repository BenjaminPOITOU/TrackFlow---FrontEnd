"use client";

/**
 * @file components/dropdowns/DropdownMenuCompositionStatus.js (or .tsx)
 * @description A controlled dropdown menu component specifically for selecting a composition's status.
 * It autonomously fetches the list of available statuses from the API, manages its own loading
 * and error states, and reports the selected value to its parent.
 */


import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { useState, useEffect } from "react";
import { getCompositionStatuses } from "@/lib/api/enum";



/**
 * Renders a specialized dropdown for selecting the status of a composition.
 *
 * This component handles the asynchronous fetching of composition statuses from the backend.
 * It operates as a controlled component, meaning the parent component manages the
 * `selectedValue` and listens for changes via the `onSelectedValueChange` callback.
 * The `initialStatus` prop can be used to display a value before the user makes a selection.
 *
 * @param {object} props - The component props.
 * @param {string} props.selectedValue - The currently selected status, controlled by the parent.
 * @param {function(string): void} props.onSelectedValueChange - A callback function that is invoked with the new status value when a user makes a selection.
 * @param {string} [props.initialStatus] - An optional initial value to display in the trigger before a selection is made or while data is loading.
 * @returns {JSX.Element} The JSX for the status selection dropdown.
 */

export function DropdownMenuCompositionStatus({
  selectedValue,
  onSelectedValueChange,
  initialStatus,
}) {
  const [statusEnum, setStatusEnum] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatusEnum = async () => {
      setIsLoading(true);
      try {
        const fetchData = await getCompositionStatuses();
        setStatusEnum(fetchData);
      } catch (error) {
        console.error("Erreur lors du chargement des statuts:", error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatusEnum();
  }, []);

  return (
    <Select value={selectedValue} onValueChange={onSelectedValueChange}>
      <SelectTrigger className="w-64 border border-gray-300 px-2 bg-neutral-800 text-gray-200 focus:ring-gray-400 cursor-pointer">
        <SelectValue>
          {selectedValue || initialStatus || "Sélectionnez un état"}
        </SelectValue>
      </SelectTrigger>
      <SelectContent position="popper" className="w-64" align="start">
        <SelectGroup>
          {isLoading ? (
            <div className="p-2">Chargement...</div>
          ) : error ? (
            <div className="p-2 text-red-400">Erreur de chargement</div>
          ) : statusEnum ? (
            statusEnum.map((currentStatus, index) => (
              <SelectItem
                className="cursor-pointer bg-neutral-800 p-2 hover:bg-neutral-700"
                key={index}
                value={currentStatus.value}
              >
                {currentStatus.value}
              </SelectItem>
            ))
          ) : (
            <div className="p-2">Aucun statut disponible</div>
          )}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
