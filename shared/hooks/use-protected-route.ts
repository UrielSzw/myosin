import { useAuth } from "@/shared/providers/auth-provider";
import { useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

/**
 * Hook para proteger rutas y redirigir según el estado de autenticación
 *
 * Lógica:
 * - Si user y está en /auth → redirect a /(authenticated)
 * - Si !user y está en /(authenticated) → redirect a /auth/sign-in
 * - Si loading → no hace nada (espera)
 */
export function useProtectedRoute() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // No hacer nada mientras está cargando
    if (loading) {
      return;
    }

    // Obtener el primer segmento de la ruta actual
    const inAuthGroup = segments[0] === "auth";
    const inAuthenticatedGroup = segments[0] === "(authenticated)";

    // Usuario autenticado pero en rutas de auth → redirect a app
    if (user && inAuthGroup) {
      console.log("🔐 [Route Guard] User authenticated, redirecting to app");
      router.replace("/(authenticated)/(tabs)");
      return;
    }

    // Usuario NO autenticado pero en rutas protegidas → redirect a auth
    if (!user && inAuthenticatedGroup) {
      console.log(
        "🚫 [Route Guard] User not authenticated, redirecting to sign-in"
      );
      router.replace("/auth/sign-in");
      return;
    }

    // Si no hay usuario y no está en ningún grupo, ir a sign-in
    if (!user && !inAuthGroup && !inAuthenticatedGroup) {
      console.log("🚫 [Route Guard] Initial redirect to sign-in");
      router.replace("/auth/sign-in");
      return;
    }

    // Si hay usuario y no está en ningún grupo, ir a app
    if (user && !inAuthGroup && !inAuthenticatedGroup) {
      console.log("🔐 [Route Guard] Initial redirect to app");
      router.replace("/(authenticated)/(tabs)");
      return;
    }
  }, [user, loading, segments, router]);

  return { user, loading };
}
