"use client";

import type React from "react";
import Header from "./components/header";
import Footer from "./components/footer";
import { AuthProvider } from "@/hooks/use-auth";
import { CartProvider } from "@/hooks/use-cart";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <AuthProvider>
      <CartProvider>
        <Header />
        <main>{children}</main>
        <Footer />
        <Toaster />
      </CartProvider>
    </AuthProvider>
  );
}
