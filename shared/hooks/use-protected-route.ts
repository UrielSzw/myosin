import { useAuth } from "@/shared/providers/auth-provider";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { useRouter, useSegments } from "expo-router";
import { useEffect, useRef } from "react";

/**
 * Hook para proteger rutas y redirigir según el estado de autenticación
 *
 * Lógica:
 * - Si user y está en /auth → verificar onboarding, luego redirect
 * - Si user y está en /(authenticated) → verificar onboarding (desde store, sin async)
 * - Si !user y está en /(authenticated) → redirect a /auth/sign-in
 * - Si loading → no hace nada (espera)
 */
export function useProtectedRoute() {
  const { user, loading } = useAuth();
  const prefs = useUserPreferences();
  const segments = useSegments();
  const router = useRouter();
  const hasHandledRef = useRef(false);
  const lastUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    // Reset si el usuario cambia
    if (user?.id !== lastUserIdRef.current) {
      hasHandledRef.current = false;
      lastUserIdRef.current = user?.id ?? null;
    }

    // No hacer nada mientras está cargando auth
    if (loading) {
      return;
    }

    // Obtener el primer segmento de la ruta actual
    const inAuthGroup = segments[0] === "auth";
    const inAuthenticatedGroup = segments[0] === "(authenticated)";
    const inOnboardingGroup = segments[0] === "onboarding";

    // Usuario autenticado en rutas de auth → redirigir según onboarding
    if (user && inAuthGroup) {
      if (prefs?.onboarding_completed) {
        console.log("✅ [Route Guard] Onboarding complete, redirecting to app");
        router.replace("/(authenticated)/(tabs)/");
      } else {
        console.log("🎯 [Route Guard] Onboarding needed, redirecting...");
        router.replace("/onboarding");
      }
      return;
    }

    // Usuario autenticado en rutas protegidas → verificar onboarding
    if (user && inAuthenticatedGroup) {
      // Si onboarding no está completo, redirigir
      if (prefs && !prefs.onboarding_completed) {
        console.log("🎯 [Route Guard] Onboarding incomplete, redirecting...");
        router.replace("/onboarding");
      }
      // Si está completo, no hacer nada - dejar que la app cargue normal
      return;
    }

    // Usuario autenticado en onboarding → verificar si ya completó
    if (user && inOnboardingGroup) {
      // Si ya completó onboarding pero está en /onboarding, redirigir a app
      if (prefs?.onboarding_completed) {
        console.log("✅ [Route Guard] Onboarding already done, redirecting to app");
        router.replace("/(authenticated)/(tabs)/");
      }
      return;
    }

    // Usuario NO autenticado pero en rutas protegidas → redirect a auth
    if (!user && inAuthenticatedGroup) {
      console.log("🚫 [Route Guard] User not authenticated, redirecting to sign-in");
      router.replace("/auth/sign-in");
      return;
    }

    // Usuario NO autenticado pero en onboarding → redirect a auth
    if (!user && inOnboardingGroup) {
      console.log("🚫 [Route Guard] User not authenticated, redirecting to sign-in");
      router.replace("/auth/sign-in");
      return;
    }

    // Si no hay usuario y no está en auth, ir a sign-in
    if (!user && !inAuthGroup) {
      if (!hasHandledRef.current) {
        console.log("🚫 [Route Guard] Initial redirect to sign-in");
        hasHandledRef.current = true;
        router.replace("/auth/sign-in");
      }
      return;
    }

    // Si hay usuario pero no está en ningún grupo conocido, redirigir
    if (user && !inAuthGroup && !inAuthenticatedGroup && !inOnboardingGroup) {
      if (!hasHandledRef.current) {
        hasHandledRef.current = true;
        if (prefs?.onboarding_completed) {
          console.log("✅ [Route Guard] Redirecting to app");
          router.replace("/(authenticated)/(tabs)/");
        } else {
          console.log("🎯 [Route Guard] Redirecting to onboarding");
          router.replace("/onboarding");
        }
      }
      return;
    }
  }, [user, loading, segments, router, prefs]);

  return { user, loading };
}
