import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  // Create profile if missing (client-side safety net in case DB trigger didn't run)
  const ensureUserProfileExists = async (sessionUser) => {
    try {
      if (!sessionUser?.id) return;
      // Check if profile exists
      const { data: existingRows, error: fetchError } = await supabase
        ?.from("user_profiles")
        ?.select("id")
        ?.eq("id", sessionUser?.id)
        ?.limit(1);

      if (fetchError) return;
      if (existingRows && existingRows?.length > 0) return;

      const inferredName =
        sessionUser?.user_metadata?.full_name ||
        sessionUser?.user_metadata?.name ||
        (sessionUser?.email ? sessionUser?.email?.split?.("@")?.[0] : "User");

      const inferredRole = sessionUser?.user_metadata?.role || "alumni";

      const { data: createdRows, error: upsertError } = await supabase
        ?.from("user_profiles")
        ?.upsert(
          [
            {
              id: sessionUser?.id,
              email: sessionUser?.email,
              full_name: inferredName,
              role: inferredRole,
            },
          ],
          { onConflict: "id" }
        )
        ?.select("*")
        ?.limit(1);

      const created = createdRows?.[0];
      if (!upsertError && created) {
        setUserProfile(created);
      }
    } catch (_) {
      // no-op: fallback creation is best-effort
    }
  };

  // Isolated async operations - never called from auth callbacks
  const profileOperations = {
    async load(userId) {
      if (!userId) return;
      setProfileLoading(true);
      try {
        const { data, error } = await supabase
          ?.from("user_profiles")
          ?.select("*")
          ?.eq("id", userId)
          ?.single();
        if (!error) setUserProfile(data);
      } catch (error) {
        console.error("Profile load error:", error);
      } finally {
        setProfileLoading(false);
      }
    },

    clear() {
      setUserProfile(null);
      setProfileLoading(false);
    },
  };

  // Auth state handlers - PROTECTED from async modification
  const authStateHandlers = {
    // This handler MUST remain synchronous - Supabase requirement
    onChange: (event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);

      if (session?.user) {
        // Fire-and-forget: ensure profile exists, then load
        ensureUserProfileExists(session?.user);
        profileOperations?.load(session?.user?.id);
      } else {
        profileOperations?.clear();
      }
    },
  };

  useEffect(() => {
    const handleRedirectSession = async () => {
      try {
        const url =
          typeof window !== "undefined" ? new URL(window.location.href) : null;
        const hasCode = !!url?.searchParams?.get("code");
        const hash = typeof window !== "undefined" ? window.location.hash : "";
        const hashParams = hash?.startsWith("#")
          ? new URLSearchParams(hash.slice(1))
          : null;
        const hasAccessToken = !!hashParams?.get("access_token");

        if (hasCode || hasAccessToken) {
          await supabase?.auth?.exchangeCodeForSession();
          if (typeof window !== "undefined") {
            const cleanUrl = window.location.origin + window.location.pathname;
            window.history.replaceState({}, document.title, cleanUrl);
          }
        }
      } catch (_) {
        // best-effort only
      }
    };

    handleRedirectSession();

    // Initial session check
    supabase?.auth?.getSession()?.then(({ data: { session } }) => {
      authStateHandlers?.onChange(null, session);
    });

    // CRITICAL: This must remain synchronous
    const {
      data: { subscription },
    } = supabase?.auth?.onAuthStateChange(authStateHandlers?.onChange);

    return () => subscription?.unsubscribe();
  }, []);

  // Auth methods
  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase?.auth?.signInWithPassword({
        email,
        password,
      });
      if (!error && data?.user) {
        // Best-effort ensure profile exists
        ensureUserProfileExists(data?.user);
      }
      return { data, error };
    } catch (error) {
      return { error: { message: "Network error. Please try again." } };
    }
  };

  const signUp = async (email, password, metadata = {}) => {
    try {
      const { data, error } = await supabase?.auth?.signUp({
        email,
        password,
        options: {
          data: metadata,
          // Ensure the confirmation link points back to the same origin/port as the running app
          emailRedirectTo:
            (typeof window !== "undefined"
              ? window.location.origin
              : undefined) + "/login",
        },
      });
      if (!error && data?.user) {
        // Best-effort ensure profile exists immediately (for projects without email confirm)
        ensureUserProfileExists(data?.user);
      }
      return { data, error };
    } catch (error) {
      return { error: { message: "Network error. Please try again." } };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase?.auth?.signOut();
      if (!error) {
        setUser(null);
        profileOperations?.clear();
      }
      return { error };
    } catch (error) {
      return { error: { message: "Network error. Please try again." } };
    }
  };

  const updateProfile = async (updates) => {
    if (!user) return { error: { message: "No user logged in" } };

    try {
      const { data, error } = await supabase
        ?.from("user_profiles")
        ?.update(updates)
        ?.eq("id", user?.id)
        ?.select()
        ?.single();
      if (!error) setUserProfile(data);
      return { data, error };
    } catch (error) {
      return { error: { message: "Network error. Please try again." } };
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    profileLoading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
