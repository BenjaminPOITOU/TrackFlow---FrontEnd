"use client";

import React from "react";
import { useCompositionCreateForm } from "./hooks/useCompositionCreateForm";
import { SubGenderInput } from "./SubGenderInput";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import SelectEnum from "@/components/selects/SelectEnum";
import { Button } from "@/components/ui/button";
import { Loader2, Zap } from "lucide-react";

/**
 * Renders the form for creating a new composition.
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

      <div className="flex justify-end">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handlers.handleAutofill}
          disabled={isSubmitting || isLoading}
        >
          <Zap className="mr-2 h-4 w-4" />
          Remplissage Rapide
        </Button>
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

      <div className="space-y-2">
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
      </div>

      <div className="flex justify-end items-center gap-3 pt-4">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          ANNULER
        </Button>
        <Button type="submit" disabled={isSubmitting || isLoading}>
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          {isSubmitting ? "CRÉATION..." : "CRÉER LA COMPOSITION"}
        </Button>
      </div>
    </form>
  );
}