/**
 * @file components/SelectCategory.js (or .tsx)
 * @description A controlled select/dropdown component for choosing an annotation category.
 * It autonomously fetches the list of available categories from the API upon mounting,
 * handles its own loading and error states, and communicates the selected value back to its parent.
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
import { getAnnotationCategories } from "@/lib/api/enum";


/**
 * Renders a dropdown menu for selecting an annotation category.
 *
 * This component fetches the category list from the backend via an API call.
 * It manages its own internal state for loading, errors, and the category list.
 * It is designed as a "controlled component" in terms of its selected value, which is managed
 * by a parent component through the `value` and `onValueChange` props.
 *
 * @param {object} props - The component props.
 * @param {string} props.value - The currently selected category value, controlled by the parent component.
 * @param {function(string): void} props.onValueChange - A callback function that is invoked when the user selects a new category. It receives the new value as an argument.
 * @returns {JSX.Element} The JSX for the select dropdown component.
 */

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
        <SelectValue
          className="bg-neutral-700"
          placeholder={isLoading ? "Chargement..." : "Sélectionner"}
        />
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
