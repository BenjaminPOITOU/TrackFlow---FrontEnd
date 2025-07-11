

/**
 * Renders a section within the sidebar, including a title and a list of items.
 * @param {object} props - The component props.
 * @param {string} props.title - The title of the section.
 * @param {string} props.visualizerType - The type of visualizer to show for this section.
 * @param {boolean} props.isCollapsed - Whether the sidebar is collapsed.
 * @param {boolean} props.isActiveSection - Whether this section is currently active.
 * @param {React.ReactNode} props.children - The `SidebarItem` components to render in this section.
 * @returns {JSX.Element} A sidebar section.
 */
export default function SidebarSection({ title, isCollapsed, isActiveSection, children }) {
  return (
    <div className="mb-4">
      <div className={`px-2 py-1.5 text-xs text-gray-400 uppercase tracking-wider flex items-center ${isCollapsed ? "justify-center" : "lg:justify-between"}`}>
        <span className={`hidden ${!isCollapsed && "lg:inline"}`}>{title}</span>
        <div className={`transition-opacity duration-300 opacity-0 ${isActiveSection && !isCollapsed && "lg:opacity-100"}`}>

        </div>
      </div>
      <ul className="space-y-1">{children}</ul>
    </div>
  );
}