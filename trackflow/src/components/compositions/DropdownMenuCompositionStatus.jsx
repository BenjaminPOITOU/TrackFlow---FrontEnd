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
