/**
 * @file components/modals/ModalWrapper.js (or .tsx)
 * @description A generic, reusable, and accessible modal component. It provides the basic
 * structure (overlay, container, title, close button) and logic for a modal dialog.
 */

import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";

/**
 * @file components/ui/ModalWrapper.js (or .tsx)
 * @description A generic, reusable, and accessible modal component. It provides the basic
 * structure (overlay, container, title, close button) and logic for a modal dialog.
 */

"use-client";

import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";

/**
 * Renders a generic modal dialog wrapper.
 *
 * This component handles the common functionality of a modal, such as:
 * - Displaying an overlay that covers the page.
 * - Providing a title bar and a close button.
 * - Allowing the user to close the modal by clicking the overlay or pressing the 'Escape' key.
 * - Preventing clicks inside the modal from accidentally closing it.
 *
 * It is designed to be a wrapper, with the modal's specific content being passed in as `children`.
 *
 * @param {object} props - The component props.
 * @param {boolean} props.isOpen - Controls whether the modal is visible.
 * @param {function(): void} props.onClose - A callback function invoked when the modal should be closed.
 * @param {string} props.title - The text to display in the modal's header.
 * @param {React.ReactNode} props.children - The content to be rendered inside the modal's body.
 * @returns {JSX.Element | null} The JSX for the modal, or null if `isOpen` is false.
 */
export const ModalWrapper = ({ isOpen, onClose, title, children }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="flex flex-col relative bg-zinc-800 rounded-md shadow-xl border border-b-gray-300 w-full max-w-[55rem] max-h-[90vh] p-6 "
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-2xl font-semibold text-gray-300">{title}</h2>
          <button onClick={onClose} className="cursor-pointer">
            <X color="#e0e0e0" />
          </button>
        </div>
        <div className="overflow-y-auto flex flex-col gap-2 flex-grow pr-4">
          {children}
        </div>
      </div>
    </div>
  );
};
