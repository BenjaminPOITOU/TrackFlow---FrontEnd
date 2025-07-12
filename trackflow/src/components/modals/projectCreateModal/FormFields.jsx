import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import SelectEnum from "@/components/selects/SelectEnum";
import MultiSelectCheckboxGroup from "./MultiSelectCheckboxGroup";

/**
 * A presentational component that lays out the input fields for the project form.
 * It is a "dumb" component that receives its state and handlers via props.
 * @param {object} props - The component props.
 * @param {object} props.formState - The current state of the form.
 * @param {(field: string, value: any) => void} props.onFieldChange - Callback to update the form state.
 * @param {object} props.enums - The available enum options.
 * @param {boolean} props.disabled - Whether the fields should be disabled.
 * @returns {JSX.Element} The form fields component.
 */
export function FormFields({ formState, onFieldChange, enums, disabled }) {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <Label htmlFor="title" className="text-white font-medium">
          Titre du Projet
        </Label>
        <Input
          id="title"
          value={formState.title}
          onChange={(e) => onFieldChange("title", e.target.value)}
          disabled={disabled}
          placeholder="Ex: Ma nouvelle composition"
          required
          className="bg-zinc-700 border-gray-300 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-3">
            <Label className="text-white font-medium">Type de Projet</Label>
            <SelectEnum
              options={enums.types}
              value={formState.projectType}
              onValueChange={(value) => onFieldChange("projectType", value)}
              placeholder="Sélectionner un type..."
              disabled={disabled}
              className="bg-zinc-700 border-gray-300 text-white"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-white font-medium">État d'avancement</Label>
            <SelectEnum
              options={enums.statuses}
              value={formState.progress}
              onValueChange={(value) => onFieldChange("progress", value)}
              placeholder="Sélectionner un état..."
              disabled={disabled}
              className="bg-zinc-700 border-gray-300 text-white"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-white font-medium">Statut Commercial</Label>
            <SelectEnum
              options={enums.commercialStatuses}
              value={formState.commercialStatus}
              onValueChange={(value) =>
                onFieldChange("commercialStatus", value)
              }
              placeholder="Sélectionner un statut..."
              disabled={disabled}
              className="bg-zinc-700 border-gray-300 text-white"
            />
          </div>

          <MultiSelectCheckboxGroup
            label="Genre(s) Musical(aux)"
            options={enums.musicalGenders}
            selectedValues={formState.musicalGenders}
            onSelectionChange={(values) =>
              onFieldChange("musicalGenders", values)
            }
            disabled={disabled}
            className="space-y-3"
            labelClassName="text-white font-medium"
            checkboxClassName="border-gray-300"
          />
        </div>

        <div className="space-y-6 flex flex-col">
          <MultiSelectCheckboxGroup
            label="Objectif(s)"
            options={enums.purposes}
            selectedValues={formState.purposes}
            onSelectionChange={(values) => onFieldChange("purposes", values)}
            disabled={disabled}
            className="space-y-3"
            labelClassName="text-white font-medium"
            checkboxClassName="border-gray-300"
          />

          <div className="flex flex-col space-y-3 flex-1 min-h-0">
            <Label htmlFor="description" className="text-white font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              className="flex-1 min-h-[120px] bg-zinc-700 border-gray-300 text-white placeholder:text-gray-400 focus:border-gray-500 focus:ring-gray-500 resize-none"
              value={formState.description}
              onChange={(e) => onFieldChange("description", e.target.value)}
              placeholder="Ajoutez une description, des notes..."
              disabled={disabled}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
