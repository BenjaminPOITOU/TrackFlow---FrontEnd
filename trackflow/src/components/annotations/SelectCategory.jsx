import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { getAnnotationCategories } from "@/lib/api/enum";

export function SelectCategory({ value, onValueChange }) {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const fetchCategories = await getAnnotationCategories();
        setCategories(fetchCategories);
        setIsLoading(false);
      } catch (error) {
        setError(true);
        console.error("Error fetching annotation categories:", error);
        setIsLoading(false);
        setCategories([]);
      }
    };
    fetchData();
  }, []);

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-42 cursor-pointer bg-neutral-700">
        <SelectValue className="bg-neutral-700" placeholder={isLoading ? "Chargement..." : "Sélectionner"} />
      </SelectTrigger>
      <SelectContent className="bg-neutral-700">
        <SelectGroup>
          {isLoading ? (
            <SelectItem value="loading">Chargement...</SelectItem>
          ) : error ? (
            <SelectItem value="error">Erreur de chargement</SelectItem>
          ) : categories.length > 0 ? (
            categories.map((category, index) => (
              <SelectItem 
                className="cursor-pointer hover:bg-neutral-500" 
                key={index} 
                value={category.label}
              >
                {category.label}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="none">Aucune catégorie</SelectItem>
          )}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}