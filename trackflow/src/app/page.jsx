import { GridBackground } from "@/components/homePage/GridBackground";
import HomePageClient from "@/components/homePage/HomePageClient";

/**
 * The entry point route for the application.
 * It sets up the main layout and background for the home page,
 * and defers client-side logic to the HomePageClient component.
 * @returns {JSX.Element} The rendered home page component.
 */
export default function Page() {
  return (
    <main className="relative flex min-h-screen w-screen items-center justify-center overflow-hidden bg-zinc-900 p-8">
      <div className="absolute inset-0 opacity-20">
        <GridBackground />
      </div>
      <HomePageClient />
    </main>
  );
}
