"use client";

import { cn } from "@/lib/utils";
import { Orbitron } from "next/font/google";

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-orbitron',
});

/**
 * Renders the main title. Its visibility is controlled by a parent component
 * with a simple fade transition.
 * @param {object} props
 * @param {boolean} props.isVisible - Controls the visibility and animation.
 * @param {() => void} props.onClick - The function to call on click.
 * @returns {JSX.Element} The title component.
 */
export default function HomePageTitle({ isVisible, onClick }) {
  const containerClasses = cn(
    "relative cursor-pointer select-none transition-opacity duration-7000 ease-linear",
    isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
  );

  return (
    <div onClick={onClick} className={containerClasses}>
      <div className="flex items-center">
        <h1
          className={cn(
            "font-orbitron text-[5rem] font-bold tracking-wider text-zinc-100",
            orbitron.variable
          )}
          style={{ textShadow: "0 0 15px rgba(255, 255, 255, 0.3)" }}
        >
          TrackFlow
        </h1>
        <span className="ml-4 h-3 w-3 rounded-full bg-gray-300 animate-pulse" />
      </div>
      <p className="mt-4 text-zinc-400">
        Cliquez pour commencer
      </p>
    </div>
  );
}