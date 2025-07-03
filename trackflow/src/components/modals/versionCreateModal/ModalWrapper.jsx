import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";

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
        className="flex flex-col relative bg-zinc-800 rounded-md shadow-xl border border-b-gray-300 w-full max-w-[55rem] max-h-[90vh] p-6 relative"
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
