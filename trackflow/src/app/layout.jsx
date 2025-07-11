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
 * The root layout for the entire application.
 * It fetches the user session from the backend on the server and provides it to the client-side AuthProvider.
 * @param {object} props
 * @param {React.ReactNode} props.children The nested layout or page.
 * @returns {Promise<JSX.Element>} The root HTML structure of the application.
 */
export default async function RootLayout({ children }) {
  const { user, isTokenExpired } = await getUserSession();

  return (
    <html
      lang="fr"
      className={`${audiowide.variable} ${orbitron.variable} ${spaceMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <AuthProvider user={user} isTokenExpired={isTokenExpired}>
          {children}
          <Toaster richColors position="bottom-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
