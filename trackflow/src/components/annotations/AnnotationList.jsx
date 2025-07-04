"use client";

import { useState } from "react";
import { BookOpen, SquarePen, Trash2, Check, X } from "lucide-react";

function getFormatTime(time) {
  if (time === undefined || time === null || time === "") return "- : - -";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

/**
 * Displays a list of annotations in a table, allowing for inline editing and deletion.
 * This component manages its own "edit mode" state but delegates the actual
 * update and delete API calls to parent components via callbacks.
 *
 * @param {object} props
 * @param {Array<object>} props.annotationList - The list of annotation objects to display.
 * @param {Function} props.onAnnotationUpdate - Callback to execute when saving an edited annotation.
 * @param {Function} props.onAnnotationDelete - Callback to execute when deleting an annotation.
 */
export function AnnotationList({
  annotationList,
  onAnnotationUpdate,
  onAnnotationDelete,
}) {
  const [editingId, setEditingId] = useState(null);
  const [editedContent, setEditedContent] = useState("");


  const handleEditClick = (annotation) => {
    setEditingId(annotation.id);
    setEditedContent(annotation.content);
  };

  const handleCancelClick = () => {
    setEditingId(null);
    setEditedContent("");
  };

  const handleSaveClick = (annotationId) => {
    onAnnotationUpdate(annotationId, { content: editedContent });
    setEditingId(null);
    setEditedContent("");
  };

  const handleDeleteClick = (annotationId) => {
    if (window.confirm("Etes-vous sur.e de vouloir supprimer cette annotation ?")) {
      onAnnotationDelete(annotationId);
    }
  };

  return (
    <div className="w-full flex flex-col gap-2 border border-gray-300 p-2 rounded h-full">
      <div className="flex justify-start items-center pb-2 gap-2 border-b border-gray-600">
        <BookOpen size={20} color="#e0e0e0" />
        <span className="text-md ">VOS ANNOTATIONS</span>
      </div>

      <div className="overflow-x-auto flex-grow">
        {annotationList && annotationList.length > 0 ? (
          <table className="min-w-[600px] w-full table-fixed">
            <thead className="bg-neutral-700">
              <tr>
                <th className="w-1/5 px-4 py-2 text-left font-medium text-gray-200">
                  Categorie
                </th>
                <th className="w-1/5 px-4 py-2 text-left font-medium text-gray-200">
                  Statut
                </th>
                <th className="w-1/5 px-4 py-2 text-left font-medium text-gray-200">
                  Position
                </th>
                <th className="w-2/5 px-4 py-2 text-left font-medium text-gray-200">
                  Annotation
                </th>
                <th className="w-[100px] px-4 py-2 text-center font-medium text-gray-200">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {annotationList.map((item) => (
                <tr key={item.id} className="border-t border-gray-600">
                  <td className="px-4 py-2 text-sm text-gray-300 whitespace-nowrap">
                    {item.annotationCategory}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-300 whitespace-nowrap">
                    {item.annotationStatus}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-300 whitespace-nowrap">
                    {getFormatTime(item.timePosition)}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-300 break-words">
                    {editingId === item.id ? (
                      <textarea
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        className="w-full bg-zinc-800 border border-cyan-500 rounded-md p-1 resize-none"
                        rows={2}
                      />
                    ) : (
                      item.content
                    )}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {editingId === item.id ? (
                        <>
                          <button onClick={() => handleSaveClick(item.id)} className="p-1 text-green-400 hover:text-green-300" title="Save"> <Check size={18} /> </button>
                          <button onClick={handleCancelClick} className="p-1 text-red-400 hover:text-red-300" title="Cancel"> <X size={18} /> </button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => handleEditClick(item)} className="p-1 text-gray-400 hover:text-white" title="Edit"> <SquarePen size={16} /> </button>
                          <button onClick={() => handleDeleteClick(item.id)} className="p-1 text-gray-400 hover:text-red-400" title="Delete"> <Trash2 size={16} /> </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400">
             Aucune annotation pour cette version
            </p>
          </div>
        )}
      </div>
    </div>
  );
}