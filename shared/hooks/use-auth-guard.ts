import { useRouter } from "expo-router";
import { useEffect } from "react";
import { useAuth } from "../providers/auth-provider";

interface UseAuthGuardOptions {
  redirectTo?: string;
  requireAuth?: boolean;
}

/**
 * Hook to protect routes that require authentication
 * @param options Configuration options
 * @returns Auth state and utility functions
 */
export function useAuthGuard(options: UseAuthGuardOptions = {}) {
  const { redirectTo = "/auth/sign-in", requireAuth = true } = options;
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !user) {
        // User is not authenticated, redirect to auth screen
        router.replace(redirectTo as any);
      } else if (!requireAuth && user) {
        // User is authenticated but on a public route, redirect to main app
        router.replace("/(tabs)/" as any);
      }
    }
  }, [user, loading, requireAuth, redirectTo, router]);

  return {
    user,
    loading,
    isAuthenticated: !!user,
    canAccess: loading || (requireAuth ? !!user : true),
  };
}

/**
 * Hook specifically for protected routes
 */
export function useRequireAuth(redirectTo?: string) {
  return useAuthGuard({ requireAuth: true, redirectTo });
}

/**
 * Hook specifically for public routes (auth screens)
 */
export function usePublicRoute(redirectTo?: string) {
  return useAuthGuard({ requireAuth: false, redirectTo });
}
