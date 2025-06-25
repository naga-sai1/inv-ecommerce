import type React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard - TechCard Pro",
  description: "Admin panel for managing products and orders",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        </div>
      </div>
      {children}
    </div>
  );
}
