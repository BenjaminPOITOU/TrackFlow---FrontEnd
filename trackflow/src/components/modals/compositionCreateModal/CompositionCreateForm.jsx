"use client";
/**
 * @file components/forms/CompositionCreateForm.js (or .tsx)
 * @description A container component that renders the UI for creating a new composition.
 * It uses the `useCompositionCreateForm` custom hook to handle all state, data fetching,
 * form logic, and API submission, keeping the component itself focused on rendering.
 */
import React from "react";
import { useCompositionCreateForm } from "./hooks/useCompositionCreateForm";
import { SubGenderInput } from "./SubGenderInput";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import SelectEnum from "@/components/selects/SelectEnum";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

/**
 * Renders a complete, stateful form for creating a new musical composition.
 *
 * This component acts as a "smart" container that consumes the `useCompositionCreateForm` hook.
 * Its primary responsibilities are:
 * 1.  Orchestrating the data flow from the hook to the UI components.
 * 2.  Rendering UI feedback for different states (loading, submitting, error).
 * 3.  Connecting user interactions (e.g., typing, clicking) to the handlers provided by the hook.
 *
 * @param {object} props - The component props.
 * @param {string|number} props.projectId - The ID of the project to which this new composition will belong. This is passed to the creation hook.
 * @param {function(): void} props.onCancel - A callback function to be executed when the user cancels the form (e.g., to close a modal).
 * @param {function(object): void} props.onSuccess - A callback function executed upon the successful creation of the composition, typically receiving the new composition object.
 * @returns {JSX.Element} The JSX for the creation form, or a loading spinner.
 */
export function CompositionCreateForm({ projectId, onCancel, onSuccess }) {
  const { status, error, formData, statusEnums, handlers } =
    useCompositionCreateForm({
      projectId,
      onSuccess,
    });

  const isSubmitting = status === "submitting";
  const isLoading = status === "loading";

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-zinc-400" />
      </div>
    );
  }

  return (
    <form onSubmit={handlers.handleSubmit} className="space-y-6 px-1 py-2">
      {error && <p className="text-red-500 text-sm">Erreur : {error}</p>}

      <div className="flex items-center space-x-2 p-3 border border-gray-300 rounded-lg bg-zinc-700">
        <Checkbox
          id="dev-autofill"
          checked={formData.autoFill || false}
          onCheckedChange={(checked) => handlers.handleAutofillToggle(checked)}
          className="border-gray-300"
        />
        <Label
          htmlFor="dev-autofill"
          className="cursor-pointer select-none text-gray-300"
        >
          Remplissage auto (Dév.)
        </Label>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">TITRE</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => handlers.handleFieldChange("title", e.target.value)}
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <Label>STATUT</Label>
        <SelectEnum
          options={statusEnums}
          value={formData.compositionStatus}
          onValueChange={(v) =>
            handlers.handleFieldChange("compositionStatus", v)
          }
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <Label>SOUS-GENRE(S)</Label>
        <SubGenderInput
          value={formData.subGender}
          onChange={(v) => handlers.handleFieldChange("subGender", v)}
          disabled={isSubmitting}
        />
      </div>

     {/*<div className="space-y-2">
        <Label htmlFor="description">DESCRIPTION</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            handlers.handleFieldChange("description", e.target.value)
          }
          disabled={isSubmitting}
          className="min-h-[100px]"
        />
      </div> TODO: Implement descritpion*/}

      <div className="flex justify-end items-center gap-3 pt-4">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={isSubmitting}
          className="border cursor-pointer"
        >
          ANNULER
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || isLoading}
          className="bg-gray-300 text-zinc-800 hover:bg-gray-400 cursor-pointer"
        >
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          {isSubmitting ? "CRÉATION..." : "CRÉER LA COMPOSITION"}
        </Button>
      </div>
    </form>
  );
}
