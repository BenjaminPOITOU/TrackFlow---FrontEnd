/**
 * @file Defines the header for the composition list page.
 */

"use client";

import { Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";

/**
 * Renders the header for the composition list page, including a back button,
 * the project title, and a primary action button (e.g., "Add Composition").
 *
 * @param {object} props The component props.
 * @param {string} props.title The title of the project to display.
 * @param {Function} props.onActionClick The callback function for the primary action button.
 * @returns {JSX.Element} The rendered header component.
 */
export default function CompositionListPageHeader({ title, onActionClick }) {
  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center gap-4">
        <Link href="/projects" className="p-2 rounded-full hover:bg-zinc-700" title="Back to projects list">
          <ArrowLeft size={24} className="text-gray-300" />
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-white">{title}</h1>
      </div>

      <button
        onClick={onActionClick}
        className="flex items-center justify-center gap-2 bg-gray-300 px-4 py-2 text-sm text-zinc-800 font-semibold shadow-sm transition-colors hover:bg-gray-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-gray-300 cursor-pointer"
      >
        <Plus className="-ml-0.5 h-5 w-5" aria-hidden="true" />
        <span>Ajouter une composition</span>
      </button>
    </div>
  );
}