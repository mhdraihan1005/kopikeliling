"use client";

import React from "react";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute requiredRole="customer">
      {children}
    </ProtectedRoute>
  );
}
