import Sidebar from "@/components/layout/Sidebar";


/**
 * The layout for the authenticated section of the application.
 * It establishes the main structure with a sidebar and a content area.
 * @param {{ children: React.ReactNode }} props - The component props.
 * @param {React.ReactNode} props.children - The page content to be rendered within the main area.
 * @returns {JSX.Element} The main application layout.
 */
export default function AppLayout({ children }) {
  return (
    <div className="flex flex-col lg:flex-row h-screen bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 overflow-y-auto px-4">{children}</main>
    </div>
  );
}
