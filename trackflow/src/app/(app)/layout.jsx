"use client";

import React from "react";
import Sidebar from "@/components/layout/Sidebar";
import { TechnicalFrame } from "@/components/layout/TechnicalFrame";
import { AuthProvider } from "@/contexts/AuthContext";



export default function AppLayout({ children }) {
  return (
    <AuthProvider>
    <div className="flex h-screen bg-background text-gray-300">
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-hidden p-4">
        <TechnicalFrame>
          <div className="flex-1 overflow-y-auto p-6">{children}</div>
        </TechnicalFrame>
      </main>
    </div>
    </AuthProvider>
  );
}
