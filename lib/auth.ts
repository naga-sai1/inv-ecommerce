import { supabase } from "./supabase";
import type { User } from "@supabase/supabase-js";

export interface AuthUser extends User {
  profile?: {
    full_name?: string;
    avatar_url?: string;
    phone?: string;
    address?: string;
    city?: string;
    postal_code?: string;
    country?: string;
  };
}

export class AuthService {
  /**
   * Sign up with email and password
   */
  async signUp(email: string, password: string, fullName?: string) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        console.error("Sign up error:", error);
        return { user: null, error: error.message };
      }

      // Create profile after successful signup
      if (data.user) {
        const profileCreated = await this.createProfile(data.user.id, email, fullName);
        if (!profileCreated) {
          console.warn("Profile creation failed, but user was created successfully");
          // Don't fail the signup if profile creation fails - user can still sign in
          // and profile can be created later
        }
      }

      return { user: data.user, error: null };
    } catch (error) {
      console.error("Sign up error:", error);
      return { user: null, error: "An unexpected error occurred" };
    }
  }

  /**
   * Sign in with email and password
   */
  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Sign in error:", error);
        return { user: null, error: error.message };
      }

      // Check if profile exists, create if it doesn't
      if (data.user) {
        const existingProfile = await this.getProfile(data.user.id);
        if (!existingProfile) {
          console.log("Profile not found, creating one...");
          await this.createProfile(data.user.id, data.user.email || email, data.user.user_metadata?.full_name);
        }
      }

      return { user: data.user, session: data.session, error: null };
    } catch (error) {
      console.error("Sign in error:", error);
      return { user: null, error: "An unexpected error occurred" };
    }
  }

  /**
   * Sign out
   */
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Sign out error:", error);
        return { error: error.message };
      }
      return { error: null };
    } catch (error) {
      console.error("Sign out error:", error);
      return { error: "An unexpected error occurred" };
    }
  }

  /**
   * Get current user
   */
  async getCurrentUser() {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error("Get user error:", error);
        return null;
      }

      return user;
    } catch (error) {
      console.error("Get user error:", error);
      return null;
    }
  }

  /**
   * Create user profile with better error handling
   */
  async createProfile(userId: string, email: string, fullName?: string) {
    try {
      // First, try to check if profile already exists
      const existingProfile = await this.getProfile(userId);
      if (existingProfile) {
        console.log("Profile already exists for user:", userId);
        return true;
      }

      const { data, error } = await supabase.from("profiles").insert([
        {
          id: userId,
          email,
          full_name: fullName,
        },
      ]).select();

      if (error) {
        console.error("Create profile error:", error);
        console.error("Error details:", {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        
        // If it's an RLS policy error, try alternative approach
        if (error.code === '42501' || error.message.includes('policy')) {
          console.log("Attempting alternative profile creation method...");
          return await this.createProfileAlternative(userId, email, fullName);
        }
        
        return false;
      }

      console.log("Profile created successfully:", data);
      return true;
    } catch (error) {
      console.error("Create profile error:", error);
      return false;
    }
  }

  /**
   * Alternative method to create profile using RPC function
   */
  async createProfileAlternative(userId: string, email: string, fullName?: string) {
    try {
      // Try using a function call instead of direct insert
      const { data, error } = await supabase.rpc('create_user_profile', {
        user_id: userId,
        user_email: email,
        user_full_name: fullName
      });

      if (error) {
        console.error("Alternative profile creation error:", error);
        return false;
      }

      console.log("Profile created via alternative method:", data);
      return true;
    } catch (error) {
      console.error("Alternative profile creation error:", error);
      return false;
    }
  }

  /**
   * Get user profile
   */
  async getProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Get profile error:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Get profile error:", error);
      return null;
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, updates: Partial<any>) {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", userId);

      if (error) {
        console.error("Update profile error:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Update profile error:", error);
      return false;
    }
  }

  /**
   * Reset password
   */
  async resetPassword(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        console.error("Reset password error:", error);
        return { error: error.message };
      }

      return { error: null };
    } catch (error) {
      console.error("Reset password error:", error);
      return { error: "An unexpected error occurred" };
    }
  }

  /**
   * Resend confirmation email
   */
  async resendConfirmationEmail(email: string) {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        console.error("Resend confirmation error:", error);
        return { error: error.message };
      }

      return { error: null };
    } catch (error) {
      console.error("Resend confirmation error:", error);
      return { error: "An unexpected error occurred" };
    }
  }
}

export const authService = new AuthService();
