import { useProtectedRoute } from "@/shared/hooks/use-protected-route";
import { LoadingScreen } from "@/shared/ui/loading-screen";
import { Stack } from "expo-router";

/**
 * Auth Layout: Protege todas las rutas de autenticación
 * - Verifica que el usuario NO esté autenticado
 * - Redirige a /(authenticated) si ya hay usuario
 */
export default function AuthLayout() {
  const { user, loading } = useProtectedRoute();

  // Mostrar loading mientras verifica auth
  if (loading) {
    return <LoadingScreen />;
  }

  // Si hay usuario, useProtectedRoute ya hizo el redirect
  // Este return solo es por TypeScript, nunca se ejecutará
  if (user) {
    return <LoadingScreen />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="sign-up" />
      <Stack.Screen name="forgot-password" />
    </Stack>
  );
}
