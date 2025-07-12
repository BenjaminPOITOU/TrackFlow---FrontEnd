"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import HomePageTitle from "@/components/homePage/HomePageTitle";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";

/**
 * Orchestrates the home page's user interface, managing the state
 * for animations and view transitions between the title screen,
 * login form, and registration form. It also handles navigation
 * after a successful login.
 * @returns {JSX.Element} The interactive client-side layer of the home page.
 */
export default function HomePageClient() {
  const router = useRouter();
  const [initialAnimationDone, setInitialAnimationDone] = useState(false);
  const [activeView, setActiveView] = useState("title");
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setInitialAnimationDone(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const showLogin = () => setActiveView("login");
  const showRegister = () => setActiveView("register");
  const showTitle = () => setActiveView("title");

  const handleLoginSuccess = () => {
    setIsExiting(true);
    setTimeout(() => {
      router.push("/projects");
    }, 500);
  };

  const handleRegisterSuccess = () => {
    toast.success("Inscription réussie ! Veuillez vous connecter.");
    showLogin();
  };

  return (
    <div
      className={cn(
        "transition-opacity duration-500",
        initialAnimationDone ? "opacity-100" : "opacity-0"
      )}
    >
      <HomePageTitle isVisible={activeView === "title"} onClick={showLogin} />
      <LoginForm
        isVisible={activeView === "login"}
        isExiting={isExiting}
        onClose={showTitle}
        onSwitchToRegister={showRegister}
        onLoginSuccess={handleLoginSuccess}
      />
      <RegisterForm
        isVisible={activeView === "register"}
        onClose={showTitle}
        onSwitchToLogin={showLogin}
        onRegisterSuccess={handleRegisterSuccess}
      />
    </div>
  );
}
