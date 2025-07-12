import { Audiowide, Orbitron, Space_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import { getUserSession } from "@/lib/api/authService";
import "./globals.css";

const audiowide = Audiowide({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-audiowide",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-orbitron",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
});


/**
 * SEO and page metadata configuration for the application.
 * This object is automatically consumed by Next.js to populate the <head> tag
 * with relevant information for search engines and social media platforms (Open Graph protocol).
 * @see https://nextjs.org/docs/app/api-reference/functions/generate-metadata
 */

export const metadata = {
  title: "TrackFlow – Gérez et finalisez vos compositions musicales",
  description:
    "TrackFlow est une application web dédiée aux compositeurs et producteurs de musique. Gérez vos projets, collaborez, annotez et versionnez vos morceaux, depuis l'idée jusqu’à la finalisation.",
  keywords: [
    "TrackFlow",
    "composition musicale",
    "MAO",
    "musique",
    "producteur",
    "studio",
    "création musicale",
    "collaboration musicale",
    "versionnage audio",
    "feedback",
    "DAW",
  ],
  authors: [{ name: "TrackFlow Team", url: "http://34.1.1.1" }],
  openGraph: {
    title: "TrackFlow – Application web pour compositeurs et producteurs",
    description:
      "TrackFlow centralise tout votre processus de création musicale : versionnage, annotations, collaboration, feedback, et gestion intuitive de projets audio.",
    url: "http://34.1.1.1",
    siteName: "TrackFlow",
    locale: "fr_FR",
    type: "website",
  },
  metadataBase: new URL("http://34.1.1.1"),
};

/**
 * The root server component that wraps all pages in the application.
 *
 * It performs the following key functions:
 * 1. Fetches the initial user session data on the server to determine authentication status.
 * 2. Wraps the application in an `AuthProvider` to make user data and auth state
 *    available globally to client components via a React Context.
 * 3. Sets the `lang` attribute on the HTML tag and applies the global font variables.
 * 4. Includes the `Toaster` component for displaying toast notifications.
 * 5. Renders the page content passed via the `children` prop.
 *
 * @async
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The page or nested layout components to be rendered.
 * @returns {Promise<JSX.Element>} A promise that resolves to the JSX element for the root layout.
 */
export default async function RootLayout({ children }) {
  const { user, isTokenExpired } = await getUserSession();

  return (
    <html
      lang="fr"
      className={`${audiowide.variable} ${orbitron.variable} ${spaceMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#0f0f0f" />
        <meta name="robots" content="index, follow" />
      </head>
      <body>
        <AuthProvider user={user} isTokenExpired={isTokenExpired}>
          {children}
          <Toaster richColors position="bottom-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
