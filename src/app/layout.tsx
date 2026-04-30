import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import React from "react";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";

import CustomToaster from "@/components/CustomToaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "E-Coffee Keliling",
  description: "Coffee App",
};

import Script from "next/script";

import AiBarista from "@/components/AiBarista";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className + " bg-black text-white"}>
        {/* Global Fixed Background Support untuk Customer Pages */}
        <div className="fixed inset-0 -z-50 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/Barista.png')" }} />
        <div className="fixed inset-0 -z-40 bg-black/80 backdrop-blur-[4px]" />

        <Script
          src="https://app.sandbox.midtrans.com/snap/snap.js"
          data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || 'SB-Mid-client-Rl_bi2_3GbNCa3K9'}
          strategy="beforeInteractive"
        />
        <AuthProvider>
          <CartProvider>
            {children}
            <CustomToaster />
            <AiBarista />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}