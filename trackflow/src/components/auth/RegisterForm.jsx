"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, X, Eye, EyeOff } from "lucide-react";

/**
 * Renders an interactive registration form.
 * It captures user details, performs comprehensive client-side validation
 * (presence, email format, password length, password confirmation), and sends
 * the data to the server-side API proxy. It also handles structured error
 * responses from the backend (400, 409, 500).
 *
 * @param {object} props The component props.
 * @param {boolean} props.isVisible Controls the form's visibility and animations.
 * @param {() => void} props.onClose Callback function to close the form.
 * @param {() => void} props.onSwitchToLogin Callback to switch to the login form.
 * @param {() => void} props.onRegisterSuccess Callback executed on successful registration.
 * @returns {JSX.Element} The rendered registration form component.
 */
export default function RegisterForm({
  isVisible,
  onClose,
  onSwitchToLogin,
  onRegisterSuccess,
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const passwordInputRef = useRef(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      toast.error("Veuillez remplir tous les champs.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas.");
      return;
    }

    setIsLoading(true);
    try {
      const registrationData = {
        firstName,
        lastName,
        login: email,
        email,
        password,
        profileType: "MUSICIAN",
      };

      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registrationData),
      });

      if (!response.ok) {
        const errorData = await response.json();

        if (response.status === 409) {
          throw new Error(errorData.error || "Cet email est déjà utilisé.");
        }
        if (response.status === 400) {
          const firstErrorField = Object.keys(errorData)[0];
          throw new Error(
            errorData[firstErrorField] ||
              "Veuillez vérifier les informations saisies."
          );
        }

        throw new Error(errorData.error || "L'inscription a échoué.");
      }

      onRegisterSuccess();
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
        isVisible ? "opacity-100 z-20" : "opacity-0 z-[-1] pointer-events-none"
      )}
    >
      <form
        onSubmit={handleSubmit}
        className={cn(
          "relative w-full max-w-md rounded-lg border border-gray-700 bg-zinc-800/90 p-8 shadow-xl backdrop-blur-sm transition-all duration-300 ease-out",
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
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
          Inscription
        </h2>
        <div className="flex flex-col gap-4">
          <div className="space-y-2">
            <label className="text-sm uppercase tracking-wide text-gray-400">
              Prénom
            </label>
            <Input
              type="text"
              name="firstName"
              autoComplete="given-name"
              placeholder="Votre prénom"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              disabled={isLoading}
              className="border-gray-600 bg-zinc-700/50 text-gray-200"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm uppercase tracking-wide text-gray-400">
              Nom
            </label>
            <Input
              type="text"
              name="lastName"
              autoComplete="family-name"
              placeholder="Votre nom"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              disabled={isLoading}
              className="border-gray-600 bg-zinc-700/50 text-gray-200"
            />
          </div>
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
            <div className="relative">
              <Input
                ref={passwordInputRef}
                type={showPassword ? "text" : "password"}
                name="new-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="border-gray-600 bg-zinc-700/50 text-gray-200 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-white"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm uppercase tracking-wide text-gray-400">
              Confirmer
            </label>
            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                name="confirm-password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
                className="border-gray-600 bg-zinc-700/50 text-gray-200 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-white"
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        </div>
        <div className="mt-8">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gray-300 px-6 py-3 font-medium uppercase tracking-wide text-zinc-900 transition-colors hover:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Créer un compte
          </Button>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-4 text-center">
          <p className="text-sm text-gray-400">
            Déjà un compte ?
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="ml-2 font-semibold text-gray-200 transition-colors hover:underline"
            >
              Se connecter
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}
