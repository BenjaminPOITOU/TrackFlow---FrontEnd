"use client";

/**
 * @file components/contexts/AuthContext.js (or .tsx)
 * @description Defines the React Context for managing global authentication state and actions.
 * This includes the user's session data, authentication status, and a logout function.
 */

import { createContext, useContext, useEffect, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";

const AuthContext = createContext(undefined);


/**
 * The provider component that supplies the authentication context to the component tree.
 * It is designed to be initialized with server-side data from a parent component (like `RootLayout`).
 *
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The child components that will consume the context.
 * @param {object | null} props.user - The initial user object, typically fetched on the server and passed down.
 * @param {boolean} [props.isTokenExpired=false] - A flag indicating if the auth token has expired, also determined on the server.
 * @returns {JSX.Element}
 */
export function AuthProvider({
  children,
  user: initialUser,
  isTokenExpired = false,
}) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isTokenExpired && pathname !== "/") {
      toast.error("Votre session a expiré. Veuillez vous reconnecter.");
      router.push("/");
    }
  }, [isTokenExpired, pathname, router]);

  const logout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      router.push("/login");
      router.refresh();
    }
  };

  const contextValue = useMemo(
    () => ({
      user: initialUser,
      isAuthenticated: !!initialUser,
      isTokenExpired,
      logout,
    }),
    [initialUser, isTokenExpired]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
