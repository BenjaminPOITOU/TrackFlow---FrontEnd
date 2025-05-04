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
        <SelectValue placeholder={isLoading ? "Chargement..." : "Selectionner"} />
    
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