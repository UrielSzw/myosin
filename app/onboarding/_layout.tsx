import { useAuth } from "@/shared/providers/auth-provider";
import { LoadingScreen } from "@/shared/ui/loading-screen";
import { Redirect, Stack } from "expo-router";

/**
 * Onboarding Layout: Protege las rutas de onboarding
 * - Usuario debe estar autenticado para acceder
 * - Si no hay usuario, redirige a auth
 */
export default function OnboardingLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  // Si no hay usuario, redirigir a auth
  if (!user) {
    return <Redirect href="/auth/sign-in" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        gestureEnabled: false, // Deshabilitamos gesto de regreso para flujo controlado
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="sex" />
      <Stack.Screen name="birthdate" />
      <Stack.Screen name="measurements" />
      <Stack.Screen name="goal" />
      <Stack.Screen name="activity" />
      <Stack.Screen name="complete" />
    </Stack>
  );
}
