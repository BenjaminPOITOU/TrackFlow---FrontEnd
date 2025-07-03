import { Funnel, ArrowDownNarrowWide, LayoutGrid, List } from "lucide-react";

/**
 * Renders the header for the project list, containing filter, sort, and view controls.
 * This is a Server Component as it is purely presentational.
 * Future interactivity would be handled by making it a Client Component.
 * @returns {JSX.Element} The project list header.
 */
export function ProjectListHeader() {
  return (
    <div className="flex items-center justify-between rounded-lg border bg-card p-2 text-card-foreground">
      <div className="flex items-center gap-2">
        <button className="flex items-center gap-2 rounded-md p-2 text-sm transition-colors hover:bg-muted">
          <Funnel size={16} />
          <span>Filtrer</span>
        </button>
        <button className="flex items-center gap-2 rounded-md p-2 text-sm transition-colors hover:bg-muted">
          <ArrowDownNarrowWide size={16} />
          <span>Trier</span>
        </button>
      </div>
      <div className="flex items-center gap-2">
        <button className="rounded-md p-2 transition-colors hover:bg-muted">
          <LayoutGrid size={18} />
        </button>
        <button className="rounded-md bg-muted p-2">
          <List size={18} />
        </button>
      </div>
    </div>
  );
}