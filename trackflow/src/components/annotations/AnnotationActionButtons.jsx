
/**
 * @file components/AnnotationActionButtons.js (or .tsx)
 * @description A presentational component that renders the appropriate action buttons for the annotation form.
 * It dynamically displays buttons based on the form's current state (sync mode, textarea visibility, content, submission status).
 */

/**
 * Renders the action buttons ("Annotate", "Cancel", "Submit") for an annotation form.
 * This component's logic is purely dependent on its props, making it a "dumb" or "presentational" component.
 * It determines which button(s) to show based on the form's state, passed down from a parent component or a hook.
 *
 * @param {object} props - The component props.
 * @param {boolean} props.isSyncMode - True if the form is in synchronized playback mode.
 * @param {boolean} props.isTextareaActive - True if the main input area is currently visible/active.
 * @param {boolean} props.isSubmitting - True if the form is currently being submitted to the API.
 * @param {boolean} props.isContentEmpty - True if the annotation content textarea is empty.
 * @param {function(): void} props.onAnnotate - Callback function to trigger the annotation process (e.g., show the textarea).
 * @param {function(): void} props.onCancel - Callback function to cancel the current annotation entry.
 * @returns {JSX.Element | null} The JSX for the buttons, or null if no buttons should be rendered.
 */



export function AnnotationActionButtons({
  isSyncMode,
  isTextareaActive,
  isSubmitting,
  isContentEmpty,
  onAnnotate,
  onCancel,
}) {
  if (isSyncMode && !isTextareaActive) {
    return (
      <button
        type="button"
        onClick={onAnnotate}
        className="border border-gray-300 px-3 py-2 bg-gray-300 text-neutral-800 rounded cursor-pointer hover:bg-gray-400"
      >
        Annoter
      </button>
    );
  }

  if (isTextareaActive) {
    return (
      <>
        <button
          type="button"
          onClick={onCancel}
          className="border border-gray-300 px-3 py-2 bg-neutral-800 text-gray-300 rounded cursor-pointer hover:bg-neutral-700"
          disabled={isSubmitting}
        >
          Annuler
        </button>
        <button
          type="submit"
          className="border border-gray-300 px-3 py-2 bg-gray-300 text-neutral-800 rounded cursor-pointer hover:bg-gray-400 disabled:opacity-50"
          disabled={isSubmitting || isContentEmpty}
        >
          {isSubmitting ? "Enregistrement..." : "Enregistrer"}
        </button>
      </>
    );
  }
  return null;
}
