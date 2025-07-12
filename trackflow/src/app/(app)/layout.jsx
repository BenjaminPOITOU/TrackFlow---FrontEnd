import Sidebar from "@/components/layout/Sidebar";
import { getUserSession } from "@/lib/api/authService";
import { getMyProfile } from "@/lib/api/user";

/**
 * The layout for the authenticated section of the application.
 * It establishes the main structure with a sidebar and a content area.
 * @param {{ children: React.ReactNode }} props - The component props.
 * @param {React.ReactNode} props.children - The page content to be rendered within the main area.
 * @returns {JSX.Element} The main application layout.
 */
export default async function AppLayout({ children }) {
  const { authToken, isTokenExpired } = await getUserSession();

  console.log("📄 [ProjectsPage] Résultat getUserSession:", {
    hasToken: !!authToken,
    isTokenExpired,
  });

  if (!authToken || isTokenExpired) {
    redirect("/");
  }

  const userData = await getMyProfile(authToken);

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-background text-foreground">
      <Sidebar userData={userData} />
      <main className="flex-1 overflow-y-auto px-4">{children}</main>
    </div>
  );
}
