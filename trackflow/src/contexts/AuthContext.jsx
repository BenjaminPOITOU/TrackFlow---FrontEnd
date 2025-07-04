"use client";

import { createContext, useContext, useEffect, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";

const AuthContext = createContext(undefined);

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
      await fetch('/api/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      router.push('/login');
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