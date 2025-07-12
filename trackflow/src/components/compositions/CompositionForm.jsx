/**
 * @file components/forms/CompositionForm.js (or .tsx)
 * @description A reusable and controlled form component for creating or editing a musical composition.
 * As a presentational component, it is decoupled from business logic; it receives all its data
 * and event handlers via props, making it highly portable (e.g., for use in a dialog or on a page).
 */



import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import SelectEnum from "../selects/SelectEnum";
import { DialogFooter } from "../ui/dialog";


/**
 * Renders a form with fields for a musical composition's details.
 *
 * This component is fully controlled. It does not manage its own state. The parent component
 * is responsible for providing the form data and handling all user interactions (input changes,
 * status selection, submission, and cancellation) via callback props.
 *
 * @param {object} props - The component props.
 * @param {Array<object>} props.compositionStatuses - An array of available status options to populate the status dropdown.
 * @param {object} props.formData - An object containing the current values for all form fields (e.g., `title`, `description`, `compositionStatus`, `subGender`).
 * @param {function(React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void} props.onInputChange - A callback function for standard input fields (`Input`, `Textarea`).
 * @param {function(string): void} props.onStatusChange - A specific callback for the status dropdown (`SelectEnum`), which receives the new value directly.
 * @param {function(React.FormEvent<HTMLFormElement>): void} props.onSubmit - The callback function to execute when the form is submitted.
 * @param {function(): void} props.onCancel - The callback function to execute when the cancel button is clicked.
 * @returns {JSX.Element} The JSX for the complete composition form.
 */

export function CompositionForm({
  compositionStatuses,
  formData,
  onInputChange,
  onStatusChange,
  onSubmit,
  onCancel,
}) {
  const compositionStatusOptions = compositionStatuses
    ? [...compositionStatuses]
    : [];

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-x-6 pb-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="compositionTitle">COMPOSITION_TITLE</Label>
          <Input
            id="compositionTitle"
            placeholder="Enter composition title..."
            className="bg-zinc-700"
            name="title"
            value={formData.title}
            onChange={onInputChange}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-8">
        <div className="flex flex-col justify-start gap-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="compositionStatus">COMPOSITION_STATUS</Label>
            <SelectEnum
              options={compositionStatusOptions}
              name="compositionStatus"
              placeholder="Select status..."
              value={formData.compositionStatus}
              onValueChange={onStatusChange}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="subGenre">SUB_GENRE</Label>
            <Input
              id="subGenre"
              placeholder="Enter sub-genre..."
              className="bg-zinc-700"
              name="subGender"
              value={formData.subGender}
              onChange={onInputChange}
            />
          </div>
        </div>

        <div className="flex flex-col justify-start gap-2 flex-grow">
          <Label htmlFor="description">DESCRIPTION</Label>
          <Textarea
            id="description"
            className="bg-zinc-700 border-zinc-600 text-gray-300 min-h-[180px] max-h-[250px] flex-grow"
            placeholder="Add description for your composition..."
            name="description"
            value={formData.description}
            onChange={onInputChange}
          />
        </div>
      </div>

      <DialogFooter className="flex justify-end items-center gap-3 pt-4 px-0 pb-0">
        <Button
          className="border border-gray-300 p-2 cursor-pointer"
          onClick={onCancel}
          type="button"
        >
          CANCEL
        </Button>
        <Button
          className="border border-zinc-900 bg-gray-300 text-zinc-900 cursor-pointer"
          type="submit"
        >
          CREATE_COMPOSITION
        </Button>
      </DialogFooter>
    </form>
  );
}
