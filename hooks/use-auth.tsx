"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { authService, type AuthUser } from "@/lib/auth";

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    fullName?: string
  ) => Promise<{ user: User | null; error: string | null }>;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ user: User | null; error: string | null }>;
  signOut: () => Promise<{ error: string | null }>;
  updateProfile: (updates: any) => Promise<boolean>;
  resendConfirmationEmail: (email: string) => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        try {
          const profile = await authService.getProfile(session.user.id);
          setUser({ ...session.user, profile });
        } catch (error) {
          console.error("Error getting profile:", error);
          // Set user without profile if profile fetch fails
          setUser({ ...session.user, profile: undefined });
        }
      }

      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        try {
          const profile = await authService.getProfile(session.user.id);
          setUser({ ...session.user, profile });
        } catch (error) {
          console.error("Error getting profile:", error);
          // Set user without profile if profile fetch fails
          setUser({ ...session.user, profile: undefined });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName?: string) => {
    const result = await authService.signUp(email, password, fullName);
    return result;
  };

  const signIn = async (email: string, password: string) => {
    const result = await authService.signIn(email, password);
    return result;
  };

  const signOut = async () => {
    const result = await authService.signOut();
    if (!result.error) {
      setUser(null);
    }
    return result;
  };

  const updateProfile = async (updates: any) => {
    if (!user) return false;

    const success = await authService.updateProfile(user.id, updates);
    if (success) {
      const updatedProfile = await authService.getProfile(user.id);
      setUser({ ...user, profile: updatedProfile });
    }
    return success;
  };

  const resendConfirmationEmail = async (email: string) => {
    const result = await authService.resendConfirmationEmail(email);
    return result;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signUp,
        signIn,
        signOut,
        updateProfile,
        resendConfirmationEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
