"use client";

import React from "react";
import Sidebar from "@/components/layout/Sidebar";
import { TechnicalFrame } from "@/components/layout/TechnicalFrame";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "sonner";

export default function AppLayout({ children }) {
  return (
    <AuthProvider>
      <Toaster richColors position="bottom-right" />
      <div className="flex h-screen bg-background text-gray-300">
        <Sidebar />

        <main className="flex-1 flex flex-col overflow-y-auto p-4">
          <TechnicalFrame>
            <div className="flex-1  p-6">{children}</div>
          </TechnicalFrame>
        </main>
      </div>
    </AuthProvider>
  );
}
