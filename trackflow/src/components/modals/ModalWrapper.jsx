"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * A reusable "native" wrapper for modal dialogs, built with basic divs and Tailwind CSS.
 * It provides full control over styling and behavior without relying on a UI library's Dialog component.
 * @param {object} props
 * @param {boolean} props.isOpen - Whether the modal is open.
 * @param {() => void} props.onClose - Function to call when closing the modal.
 * @param {string} props.title - The title of the modal.
 * @param {string} [props.description] - The description of the modal.
 * @param {boolean} [props.isLoading=false] - If the modal content is loading.
 * @param {string|null} [props.error=null] - An error message to display.
 * @param {string} [props.className] - Additional classes for the modal content div.
 * @param {React.ReactNode} props.children - The content of the modal.
 * @returns {JSX.Element | null} The modal wrapper component.
 */
export function ModalWrapper({
  isOpen,
  onClose,
  title,
  description,
  isLoading = false,
  error = null,
  className,
  children,
}) {
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className={cn(
          "relative z-50 flex max-h-[90vh] w-[95vw] flex-col overflow-hidden rounded-lg border border-gray-700 bg-zinc-900 text-white shadow-lg",
          "max-w-lg",
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="relative flex-shrink-0 border-b border-gray-700 p-6">
          <h2 id="modal-title" className="text-xl font-semibold text-white">
            {title}
          </h2>
          {description && (
            <p className="mt-1 text-gray-400">{description}</p>
          )}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-sm p-1 opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
        </header>

        <div className="flex-grow overflow-y-auto">
          {isLoading ? (
            <div className="flex h-full min-h-[300px] items-center justify-center text-gray-400">
              <span className="mr-4 h-6 w-6 animate-spin rounded-full border-4 border-current border-t-transparent"></span>
              Chargement...
            </div>
          ) : error ? (
            <div className="p-6 text-center text-red-400">
              <h3 className="mb-2 font-semibold">Une erreur s'est produite</h3>
              <p>{error}</p>
            </div>
          ) : (
            children
          )}
        </div>
      </div>
    </div>
  );
}