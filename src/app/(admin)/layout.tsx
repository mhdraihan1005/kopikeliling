"use client";

import React from "react";
import AdminNavbar from "@/components/AdminNavbar";
import AdminSidebar from "@/components/AdminSidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Coffee } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute requiredRole="admin">
      <div className="flex flex-col min-h-screen relative text-neutral-800 font-sans selection:bg-amber-500/30">
        
        {/* Background Image with Dark Glassmorphism Overlay */}
        <div
          className="fixed inset-0 bg-zinc-950 z-0"
        />
        <div className="fixed inset-0 bg-zinc-950/90 backdrop-blur-[10px] z-0" />
        
        <div className="relative z-10 flex flex-col min-h-screen">
          <AdminNavbar />
          
          <div className="flex flex-1 w-full">
            <AdminSidebar />
            
            {/* Main Dashboard Content Workspace */}
            <main className="flex-1 w-full p-4 sm:p-8 overflow-y-auto">
              <div className="max-w-5xl mx-auto">
                {children}
              </div>
            </main>
          </div>
          
          {/* Footer Navbar */}
          <footer className="bg-zinc-900/50 px-6 py-6 text-sm text-zinc-400 mt-auto border-t border-zinc-800/50 backdrop-blur-md relative z-10">
             <div className="mx-auto flex max-w-7xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p>&copy; 2026 E-Coffee Keliling - Admin Dashboard</p>
                <p>Built with Next.js & Tailwind CSS.</p>
             </div>
          </footer>
        </div>

      </div>
    </ProtectedRoute>
  );
}
