"use client";

import { Plus } from "lucide-react";

/**
 * A specialized header for the main projects page.
 * It includes a predefined title, subtitle, and a "New Project" button.
 * @param {object} props - The component props.
 * @param {() => void} props.onActionClick - The function to call when the "New Project" button is clicked.
 * @returns {JSX.Element} The project page header component.
 */
export default function ProjectListPageHeader({ onActionClick }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold font-orbitron">Projects</h1>
        <p className="mt-1 text-muted-foreground">
          Manage your creative endeavors
        </p>
      </div>
      <button
        onClick={onActionClick}
        className="flex items-center gap-2 cursor-pointer rounded-md border border-gray-300 bg-neutral-800 px-4 py-2 text-gray-300 transition-colors hover:bg-neutral-700"
      >
        <Plus size={18} />
        Nouveau Projet
      </button>
    </div>
  );
}
