import React from "react";
import "@/app/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Inter } from "next/font/google";
import localFont from "next/font/local";

const techFont = localFont({
  src: [
    {
      path: "../assets/fonts/Audiowide/Audiowide-Regular.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-tech",
  display: "swap",
});

export const metadata = {
  title: "SoundFlow - Gestion de projets musicaux",
  description:
    "Plateforme de gestion de projets musicaux avec visualisation audio avancée",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" suppressHydrationWarning={true} className="h-full">
      <head></head>
      <body
        className={`${techFont.variable} antialiased h-full bg-zinc-900 text-gray-300`}
      >
        <ThemeProvider
          attribute="class"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
