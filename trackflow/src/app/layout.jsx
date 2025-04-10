import React from "react";
import "@/app/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import localFont from "next/font/local";
import { cn } from "@/lib/utils";

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



const orbitronFont = localFont({
  src: [
    {
      path: "../assets/fonts/Orbitron/static/Orbitron-Regular.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-orbitron",
  display: "swap",
});


export const metadata = {
  title: "SoundFlow - Gestion de projets musicaux",
  description:
    "Plateforme de gestion de projets musicaux avec visualisation audio avancée",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" suppressHydrationWarning={true}>
      <head></head>   
      <body className={cn(techFont.variable)}>
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
