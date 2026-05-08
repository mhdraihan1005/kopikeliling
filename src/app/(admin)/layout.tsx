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
          <footer className="bg-zinc-950/50 px-8 py-6 text-xs text-zinc-500 mt-auto border-t border-white/5 backdrop-blur-md relative z-10">
             <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col gap-1">
                   <p className="font-bold text-zinc-300">KopiKuy! <span className="font-normal text-zinc-500">Management Dashboard</span></p>
                   <p>&copy; {new Date().getFullYear()} All Rights Reserved.</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                   <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                      <span className="font-medium">System Status: <span className="text-emerald-500">Optimal</span></span>
                   </div>
                   <div className="flex items-center gap-6 text-zinc-400">
                      <a href="#" className="hover:text-amber-500 transition-colors">Documentation</a>
                      <a href="#" className="hover:text-amber-500 transition-colors">Support</a>
                      <a href="#" className="hover:text-amber-500 transition-colors">Privacy Policy</a>
                   </div>
                </div>
             </div>
          </footer>
        </div>

      </div>
    </ProtectedRoute>
  );
}
