"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { GridBackground } from "@/components/homePage/GirdBackground";
import Link from "next/link";
import { Trash2 } from "lucide-react";

export default function HomePage() {
  const DASHBOARD_URL = "/dashboard";
  const [isCardVisible, setIsCardVisible] = useState(false);
  const [isLogoAnimated, setIsLogoAnimated] = useState(false);

  // Animation au chargement de la page
  useEffect(() => {
    setTimeout(() => setIsLogoAnimated(true), 500);
  }, []);

  function showCard() {
    setIsCardVisible(true);
  }

  return (
    <main className="relative flex min-h-screen w-screen items-center justify-center bg-zinc-900 p-4 sm:p-8 md:p-16 overflow-hidden">
      {/* Grille en arrière-plan */}
      <div className="absolute inset-0 opacity-20">
        <GridBackground />
      </div>

      <div
        onClick={showCard}
        className={`absolute top-50 left-50 text-4xl font-bold tracking-tighter glow-text text-gray-300 cursor-pointer sm:top-8 sm:left-8 md:top-16 md:left-16 md:text-6xl transition-all duration-700 ease-out ${
          isLogoAnimated
            ? "translate-y-0 opacity-100"
            : "translate-y-8 opacity-0"
        }`}
      >
        TRACKFLOW
        <span className="animate-pulse text-gray-200 ml-1">.</span>
        <div className="text-gray-400 animate-pulse text-sm flex items-center p-2 ml-2">
          Cliquez pour ici vous connecter.
        </div>
      </div>

      {/* Formulaire de connexion */}
      <form
        className={`relative transform transition-all duration-700 ease-out w-full max-w-md rounded-lg border border-gray-700 bg-zinc-800/90 p-8 shadow-xl backdrop-blur-sm ${
          isCardVisible
            ? "translate-y-0 opacity-100 visible"
            : "translate-y-24 opacity-0 invisible"
        }`}
      >
        <h2 className="mb-8 text-2xl font-bold tracking-tight text-gray-200 uppercase border-b border-gray-700 pb-2">
          Connexion
        </h2>

        <div className="flex flex-col gap-4">
          <div className="space-y-2">
            <label className="text-sm text-gray-400 uppercase tracking-wide">
              Email
            </label>
            <Input
              type="email"
              placeholder="votre@email.com"
              className="bg-zinc-700/50 border-gray-600 text-gray-200 focus:border-gray-400 focus:ring-0"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-400 uppercase tracking-wide">
              Mot de passe
            </label>
            <Input
              type="password"
              placeholder="••••••••"
              className="bg-zinc-700/50 border-gray-600 text-gray-200 focus:border-gray-400 focus:ring-0"
            />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <Link
            href={DASHBOARD_URL}
            type="submit"
            className="rounded cursor-pointer bg-gray-200 px-6 py-3 text-zinc-800 hover:bg-gray-100 transition-colors font-medium uppercase tracking-wide"
          >
            Connexion
          </Link>

          <div
          
            type="button"
            className="text-sm text-gray-400 cursor-pointer hover:text-gray-200 transition-colors"
          >
            Mot de passe oublié ?
          </div>
        </div>

        <div className="mt-8 pt-4 border-t  border-gray-700 text-center">
          <p className="text-gray-400 text-sm ">
            Pas encore de compte ?
            <button
              type="button"
              className="ml-2 text-gray-200 cursor-pointer hover:underline"
            >
              Créer un compte
            </button>
          </p>
        </div>
      </form>

   
    </main>
  );
}
