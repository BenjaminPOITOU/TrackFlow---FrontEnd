

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