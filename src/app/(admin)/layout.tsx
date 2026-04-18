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
        
        {/* Background Image with Light Glassmorphism Overlay */}
        <div
          className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0"
          style={{ backgroundImage: "url('/Barista.png')" }}
        />
        <div className="fixed inset-0 bg-white/70 backdrop-blur-[3px] z-0" />
        
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
          <footer className="bg-[#424242] text-white py-4 mt-auto shadow-inner">
             <div className="flex justify-center items-center gap-2 font-bold text-sm tracking-wide">
                <Coffee size={20} /> E-Coffee Keliling
             </div>
          </footer>
        </div>

      </div>
    </ProtectedRoute>
  );
}
