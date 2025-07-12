"use client";

import { ClipboardPlus } from "lucide-react";
import { TimeAndCategory } from "./TimeAndCategory";
import { Textarea } from "../ui/textarea";
import { useAnnotationForm } from "./hooks/useAnnotationForm";
import { AnnotationActionButtons } from "./AnnotationActionButtons";

/**
 * A form component dedicated to creating a new annotation.
 * It leverages the `useAnnotationForm` custom hook to manage all its internal
 * state (form data, submission status, UI modes) and logic. The component itself
 * is primarily responsible for structuring the form layout with sub-components
 * like `TimeAndCategory` and `AnnotationActionButtons`.
 *
 * @param {object} props
 * @param {number} props.versionId - The ID of the parent version to which this new annotation will belong.
 * @param {number} props.currentTime - The current playback time in seconds, passed down from the audio player.
 * @param {Function} props.onAnnotationCreated - A callback function executed upon successful annotation creation. It receives the new annotation object, allowing parent components to update their state.
 * @param {Function} [props.onCancel] - An optional callback to inform the parent that the form was cancelled, useful for closing mobile views.
 * @returns {JSX.Element} The rendered form component for adding an annotation.
 */
export function AddAnnotationBlock({
  versionId,
  currentTime,
  onAnnotationCreated,
  onCancel,
}) {
  const { isSyncMode, isTextareaActive, isSubmitting, formData, actions } =
    useAnnotationForm({
      versionId,
      currentTime,
      onAnnotationCreated,
      onCancel,
    });

  return (
    <form
      onSubmit={actions.submit}
      className="w-full h-full flex flex-col justify-start gap-3 items-center border border-gray-300 p-2 rounded"
    >
      <div className="flex justify-center px-2 items-center gap-2">
        <ClipboardPlus size={20} color="#e0e0e0" />
        <span className="text-md">ADD ANNOTATION</span>
      </div>
      <div className="w-full border-t border-gray-600"></div>

      <TimeAndCategory
        btnSynchStatus={isSyncMode}
        onBtnSynchStatus={actions.toggleSyncMode}
        timePosition={formData.timePosition}
        category={formData.category}
        status={formData.status}
        onChange={actions.updateField}
      />

      <div className="flex flex-col gap-1 justify-start items-start w-full">
        <span className="text-lg">Description</span>
        <Textarea
          value={formData.content}
          onChange={(e) => actions.updateField("content", e.target.value)}
          placeholder={
            isTextareaActive
              ? "Ajouter une annotation"
              : `Cliquez sur "Annoter" ou changer de mode`
          }
          className="w-full min-h-28 bg-neutral-700 resize-none"
          disabled={!isTextareaActive}
        />
      </div>

      <div className="flex justify-end items-center gap-2 w-full">
        <AnnotationActionButtons
          isSyncMode={isSyncMode}
          isTextareaActive={isTextareaActive}
          isSubmitting={isSubmitting}
          isContentEmpty={formData.content.trim() === ""}
          onAnnotate={actions.startAnnotation}
          onCancel={actions.cancel}
        />
      </div>
    </form>
  );
}
