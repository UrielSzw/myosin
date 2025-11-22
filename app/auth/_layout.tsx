import { useProtectedRoute } from "@/shared/hooks/use-protected-route";
import { Stack } from "expo-router";
import { ActivityIndicator, View } from "react-native";

function LoadingScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
}

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
