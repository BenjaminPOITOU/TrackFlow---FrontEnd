"use client";

import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";
/**
 * Renders an interactive login form.
 * It handles user input for email and password, performs client-side validation,
 * and sends credentials to the server. It is designed to handle specific
 * authentication error responses (e.g., 401 Unauthorized).
 * 
 * @param {object} props The component props.
 * @param {boolean} props.isVisible Controls the form's visibility and animations.
 * @param {boolean} props.isExiting Triggers the form's exit animation on success.
 * @param {() => void} props.onClose Callback function to close the form.
 * @param {() => void} props.onSwitchToRegister Callback to switch to the registration form.
 * @param {() => void} props.onLoginSuccess Callback for a successful login.
 * @returns {JSX.Element} The rendered login form component.
 */
export default function LoginForm({
  isVisible,
  isExiting,
  onClose,
  onSwitchToRegister,
  onLoginSuccess,
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handles the form submission. It sends a POST request to the `/api/login`
   * endpoint and handles the server's response, showing notifications for
   * success or authentication failure.
   * @param {object} event The form submission event.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email || !password) {
      toast.error("Veuillez renseigner votre email et votre mot de passe.");
      return;
    }

    if (isLoading) return;
    setIsLoading(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login: email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "L'email ou le mot de passe est incorrect.");
      }
      router.refresh();

      toast.success("Connexion réussie ! Redirection en cours...");
      onLoginSuccess();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "absolute inset-0 flex items-center justify-center transition-opacity duration-300",
        isVisible ? "opacity-100 z-20" : "opacity-0 z-[-1] pointer-events-none",
        isExiting && "opacity-0"
      )}
    >
      <form
        onSubmit={handleSubmit}
        className={cn(
          "relative w-full max-w-md rounded-lg border border-gray-700 bg-zinc-800/90 p-8 shadow-xl backdrop-blur-sm transition-all duration-300 ease-out",
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0",
          isExiting && "scale-95 opacity-0"
        )}
      >
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onClose}
          disabled={isLoading}
          formNoValidate
          className="absolute top-2 right-2 h-8 w-8 rounded-full text-zinc-400 hover:bg-zinc-700 hover:text-zinc-100"
        >
          <X size={20} />
        </Button>
        <h2 className="mb-8 border-b border-gray-700 pb-2 text-2xl font-bold uppercase tracking-tight text-gray-200">
          Connexion
        </h2>
        <div className="flex flex-col gap-4">
          <div className="space-y-2">
            <label className="text-sm uppercase tracking-wide text-gray-400">
              Email
            </label>
            <Input
              type="email"
              name="email"
              autoComplete="email"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="border-gray-600 bg-zinc-700/50 text-gray-200"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm uppercase tracking-wide text-gray-400">
              Mot de passe
            </label>
            <Input
              type="password"
              name="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              className="border-gray-600 bg-zinc-700/50 text-gray-200"
            />
          </div>
        </div>
        <div className="mt-8">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gray-300 px-6 py-3 font-medium uppercase tracking-wide text-zinc-900 transition-colors hover:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Connexion
          </Button>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-4 text-center">
          <p className="text-sm text-gray-400">
            Pas encore de compte ?
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="ml-2 font-semibold text-gray-200 transition-colors hover:underline"
            >
              Créer un compte
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}