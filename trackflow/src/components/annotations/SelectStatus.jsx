/**
 * @file components/SelectStatus.js (or .tsx)
 * @description A controlled select/dropdown component for choosing an annotation status.
 * It autonomously fetches the list of available statuses from the API upon mounting
 * and communicates the selected value back to its parent component.
 */

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { getAnnotationStatus } from "@/lib/api/enum";






/**
 * Renders a dropdown menu for selecting an annotation's status (e.g., "To do", "In progress", "Done").
 *
 * This component fetches the status list from the backend and manages its own internal
 * state for loading and errors. It operates as a "controlled component" where its
 * selected value is managed by a parent through the `value` and `onValueChange` props.
 *
 * @param {object} props - The component props.
 * @param {string} props.value - The currently selected status value, controlled by the parent component.
 * @param {function(string): void} props.onValueChange - A callback function that is invoked when the user selects a new status. It receives the new value as an argument.
 * @returns {JSX.Element} The JSX for the select dropdown component.
 */
export function SelectStatus({ value, onValueChange }) {
  const [statuses, setStatuses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const fetchStatuses = await getAnnotationStatus();
        setStatuses(fetchStatuses);
      } catch (error) {
        setError(true);
        console.error("Error fetching annotation statuses:", error);
        setStatuses([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-42 cursor-pointer bg-neutral-700">
        <SelectValue
          placeholder={isLoading ? "Chargement..." : "Selectionner"}
        />
      </SelectTrigger>
      <SelectContent className="bg-neutral-700">
        <SelectGroup>
          {isLoading ? (
            <SelectItem value="loading">Chargement...</SelectItem>
          ) : error ? (
            <SelectItem value="error">Erreur de chargement</SelectItem>
          ) : statuses.length > 0 ? (
            statuses.map((status, index) => (
              <SelectItem
                className="cursor-pointer hover:bg-neutral-500"
                key={index}
                value={status.label}
              >
                {status.label}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="none">Aucun Status</SelectItem>
          )}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
