"use client";

import type React from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/header";
import Footer from "./components/footer";
import { CartProvider } from "@/hooks/use-cart";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [supabaseClient] = useState(() => createClientComponentClient());

  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      <CartProvider>
        <Header />
        <main>{children}</main>
        <Footer />
      </CartProvider>
    </SessionContextProvider>
  );
}
