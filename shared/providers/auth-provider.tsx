import { AuthError, Session, User } from "@supabase/supabase-js";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Alert } from "react-native";
import { useUserProfileStore } from "../hooks/use-user-profile";
import { supabase } from "../services/supabase";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    displayName?: string
  ) => Promise<{ error: AuthError | null }>;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  updateProfile: (updates: {
    display_name?: string;
    avatar_url?: string;
  }) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signUp: async () => ({ error: null }),
  signIn: async () => ({ error: null }),
  signOut: async () => ({ error: null }),
  resetPassword: async () => ({ error: null }),
  updateProfile: async () => ({ error: null }),
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const loadAvatarColor = useUserProfileStore((s) => s.loadAvatarColor);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("Error getting initial session:", error);
        } else {
          setSession(session);
          setUser(session?.user ?? null);

          // NO cargar preferencias aquí - LoginSyncGate se encarga
          // Esto evita race conditions con la detección de usuario previo
        }
      } catch (error) {
        console.error("Error in getInitialSession:", error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();
    // Cargar avatar color al iniciar la app
    loadAvatarColor();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (event === "SIGNED_OUT") {
        // Clear any local data here if needed
        console.warn("[AuthProvider] User signed out");
      }

      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        // NO cargar preferencias aquí - LoginSyncGate se encarga de:
        // 1. Detectar si hay datos de otro usuario
        // 2. Hacer full_reset si es necesario
        // 3. Cargar los datos del nuevo usuario
        // Cargar aquí causaría una race condition que sobrescribe la detección de usuario previo
        console.warn(
          `[AuthProvider] ${event} for user: ${session?.user?.email}`
        );
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [loadAvatarColor]);

  const signUp = useCallback(
    async (email: string, password: string, displayName?: string) => {
      try {
        setLoading(true);

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              display_name: displayName || email.split("@")[0],
            },
          },
        });

        if (error) {
          Alert.alert("Sign Up Error", error.message);
          return { error };
        }

        if (data.user && !data.user.email_confirmed_at) {
          Alert.alert(
            "Check your email",
            "We sent you a confirmation link. Please check your email and click the link to verify your account."
          );
        }

        return { error: null };
      } catch (error) {
        const authError = error as AuthError;
        Alert.alert("Sign Up Error", authError.message);
        return { error: authError };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        Alert.alert("Sign In Error", error.message);
        return { error };
      }

      return { error: null };
    } catch (error) {
      const authError = error as AuthError;
      Alert.alert("Sign In Error", authError.message);
      return { error: authError };
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      setLoading(true);

      const { error } = await supabase.auth.signOut();

      if (error) {
        Alert.alert("Sign Out Error", error.message);
        return { error };
      }

      return { error: null };
    } catch (error) {
      const authError = error as AuthError;
      Alert.alert("Sign Out Error", authError.message);
      return { error: authError };
    } finally {
      setLoading(false);
    }
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "myosin://reset-password",
      });

      if (error) {
        Alert.alert("Reset Password Error", error.message);
        return { error };
      }

      Alert.alert(
        "Check your email",
        "We sent you a password reset link. Please check your email and follow the instructions."
      );

      return { error: null };
    } catch (error) {
      const authError = error as AuthError;
      Alert.alert("Reset Password Error", authError.message);
      return { error: authError };
    }
  }, []);

  const updateProfile = useCallback(
    async (updates: { display_name?: string; avatar_url?: string }) => {
      try {
        if (!user) {
          throw new Error("No user logged in");
        }

        const { error } = await supabase.auth.updateUser({
          data: updates,
        });

        if (error) {
          Alert.alert("Update Profile Error", error.message);
          return { error };
        }

        return { error: null };
      } catch (error) {
        const updateError = error as Error;
        Alert.alert("Update Profile Error", updateError.message);
        return { error: updateError };
      }
    },
    [user]
  );

  const value: AuthContextType = useMemo(
    () => ({
      user,
      session,
      loading,
      signUp,
      signIn,
      signOut,
      resetPassword,
      updateProfile,
    }),
    [
      user,
      session,
      loading,
      signUp,
      signIn,
      signOut,
      resetPassword,
      updateProfile,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Helper hook for auth state checking
export const useAuthState = () => {
  const { user, loading } = useAuth();

  return useMemo(
    () => ({
      isAuthenticated: !!user,
      isLoading: loading,
      user,
    }),
    [user, loading]
  );
};
