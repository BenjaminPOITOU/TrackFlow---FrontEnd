"use client";

import React, { useEffect } from "react";
import { useProjectUpdateForm } from "./hooks/useProjectUpdateForm";
import { CheckboxGroupWithFilter } from "./CheckboxGroupWithFilter";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import SelectEnum from "@/components/selects/SelectEnum";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

/**
 * Renders the form for updating a project, using the useProjectUpdateForm hook for its logic.
 */
export function ProjectUpdateForm({ projectId, userId, onCancel, onSuccess }) {
  console.log("ProjectUpdateForm rendered with props:", { projectId, userId });

  const { status, error, formData, enums, filters, filteredOptions, handlers } =
    useProjectUpdateForm({
      projectId,
      userId,
      onSuccess,
    });


  console.log("useProjectUpdateForm output:", {
    status,
    error,
    formData,
    enums,
    filters,
    filteredOptions,
  });

  useEffect(() => {
    if (error) {
      console.warn("Form error detected:", error);
    }
  }, [error]);

  const isSubmitting = status === "submitting";
  const isLoading = status === "loading";

  if (isLoading) {
    console.log("Form is loading...");
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-12 w-12 animate-spin text-zinc-400" />
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted with data:", formData);
    handlers.handleSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {error && (
          <p className="p-3 bg-red-950 border border-red-700 rounded text-red-400 text-sm">
            Erreur : {error}
          </p>
        )}

        <div className="flex flex-col gap-2">
          <Label htmlFor="title">TITRE DU PROJET</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => {
              console.log("Title changed to:", e.target.value);
              handlers.handleFieldChange("title", e.target.value);
            }}
            disabled={isSubmitting}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <Label>TYPE DE PROJET</Label>
              <SelectEnum
                options={enums.projectTypes}
                value={formData.projectType}
                onValueChange={(v) => {
                  console.log("Project type changed to:", v);
                  handlers.handleFieldChange("projectType", v);
                }}
                disabled={isSubmitting}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>STATUT DU PROJET</Label>
              <SelectEnum
                options={enums.projectStatuses}
                value={formData.projectStatus}
                onValueChange={(v) => {
                  console.log("Project status changed to:", v);
                  handlers.handleFieldChange("projectStatus", v);
                }}
                disabled={isSubmitting}
              />
            </div>
            <CheckboxGroupWithFilter
              label="GENRE(S) MUSICAUX"
              filterValue={filters.genre}
              onFilterChange={(v) => {
                console.log("Genre filter changed to:", v);
                handlers.handleFilterChange("genre", v);
              }}
              options={filteredOptions.genres}
              selectedValues={formData.projectMusicalGendersPreDefined}
              onSelectionChange={(val, checked) => {
                console.log(
                  `Genre selection changed: ${val} is now ${checked ? "checked" : "unchecked"}`
                );
                handlers.handleCheckboxChange(
                  "projectMusicalGendersPreDefined",
                  val,
                  checked
                );
              }}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <Label>STATUT COMMERCIAL</Label>
              <SelectEnum
                options={enums.projectCommercialStatuses}
                value={formData.projectCommercialStatus}
                onValueChange={(v) => {
                  console.log("Commercial status changed to:", v);
                  handlers.handleFieldChange("projectCommercialStatus", v);
                }}
                disabled={isSubmitting}
              />
            </div>
            <CheckboxGroupWithFilter
              label="OBJECTIF(S)"
              filterValue={filters.purpose}
              onFilterChange={(v) => {
                console.log("Purpose filter changed to:", v);
                handlers.handleFilterChange("purpose", v);
              }}
              options={filteredOptions.purposes}
              selectedValues={formData.projectPurposes}
              onSelectionChange={(val, checked) => {
                console.log(
                  `Purpose selection changed: ${val} is now ${checked ? "checked" : "unchecked"}`
                );
                handlers.handleCheckboxChange("projectPurposes", val, checked);
              }}
              disabled={isSubmitting}
            />
            <div className="flex flex-col gap-2">
              <Label htmlFor="description">DESCRIPTION</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => {
                  console.log("Description changed to:", e.target.value);
                  handlers.handleFieldChange("description", e.target.value);
                }}
                disabled={isSubmitting}
                className="min-h-[100px]"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 flex justify-end gap-4 border-t border-gray-700 p-4 bg-zinc-900 shadow-lg">
        <Button
          type="button"
          variant="ghost"
          onClick={() => {
            console.log("Cancel clicked");
            onCancel();
          }}
          disabled={isSubmitting}
        >
          Annuler
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || isLoading}
          className="bg-gray-200 hover:bg-white text-gray-900 px-6 font-medium"
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting ? "Mise à jour..." : "Mettre à jour le Projet"}
        </Button>
      </div>
    </form>
  );
}
