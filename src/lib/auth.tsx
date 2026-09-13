import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import type { User, Session } from "@supabase/supabase-js";
import { supabase } from "./supabaseClient";

export type UserRole = "user" | "admin";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  isPremium: boolean;
  role: UserRole;
  isAdmin: boolean;
  refreshPremiumStatus: () => Promise<void>;
  signInWithPassword: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  getAccessToken: () => string | null;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [role, setRole] = useState<UserRole>("user");

  const fetchPremiumStatus = useCallback(async (accessToken: string | undefined) => {
    if (!accessToken) {
      setIsPremium(false);
      return;
    }
    try {
      const res = await fetch("/api/billing/status", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) {
        setIsPremium(false);
        return;
      }
      const data = await res.json();
      setIsPremium(Boolean(data.isPremium));
    } catch {
      setIsPremium(false);
    }
  }, []);

  const fetchRole = useCallback(async (accessToken: string | undefined) => {
    if (!accessToken) {
      setRole("user");
      return;
    }
    try {
      const res = await fetch("/api/profile", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) {
        setRole("user");
        return;
      }
      const data = await res.json();
      setRole(data.role === "admin" ? "admin" : "user");
    } catch {
      setRole("user");
    }
  }, []);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      Promise.all([fetchPremiumStatus(data.session?.access_token), fetchRole(data.session?.access_token)]).finally(() =>
        setLoading(false),
      );
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      fetchPremiumStatus(newSession?.access_token);
      fetchRole(newSession?.access_token);
    });

    return () => subscription.subscription.unsubscribe();
  }, [fetchPremiumStatus, fetchRole]);

  const signInWithPassword = async (email: string, password: string) => {
    if (!supabase) return { error: "Login não configurado" };
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  };

  const signUp = async (email: string, password: string) => {
    if (!supabase) return { error: "Login não configurado" };
    const { error } = await supabase.auth.signUp({ email, password });
    return { error: error?.message ?? null };
  };

  const signInWithGoogle = async () => {
    if (!supabase) return;
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
  };

  const signOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
  };

  const getAccessToken = () => session?.access_token ?? null;

  const refreshPremiumStatus = async () => {
    await fetchPremiumStatus(session?.access_token);
  };

  return (
    <AuthContext.Provider
      value={{
        user: session?.user ?? null,
        loading,
        isPremium,
        role,
        isAdmin: role === "admin",
        refreshPremiumStatus,
        signInWithPassword,
        signUp,
        signInWithGoogle,
        signOut,
        getAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
