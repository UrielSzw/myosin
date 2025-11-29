import { db, sqlite } from "@/shared/db/client";
import migrations from "@/shared/db/drizzle/migrations";
import { loadExercisesSeed } from "@/shared/db/seed/seed";
import { useNetwork } from "@/shared/hooks/use-network";
import { useProtectedRoute } from "@/shared/hooks/use-protected-route";
import { AuthProvider } from "@/shared/providers/auth-provider";
import { LoadingScreen } from "@/shared/ui/loading-screen";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";

const queryClient = new QueryClient();

/**
 * AppContent: Renderiza todas las rutas y maneja la navegación protegida
 * - useProtectedRoute maneja los redirects automáticos
 * - No hay renderizado condicional de rutas
 * - El Stack siempre tiene todas las rutas disponibles
 */
function AppContent() {
  const { loading } = useProtectedRoute();

  // Mostrar loading mientras se verifica la sesión
  if (loading) {
    return <LoadingScreen />;
  }

  // Renderizar todas las rutas - la protección se hace en los layouts individuales
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(authenticated)" />
      <Stack.Screen name="auth" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  const { success, error } = useMigrations(db, migrations);
  const isConnected = useNetwork();

  useDrizzleStudio(sqlite);

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (success && isConnected) {
      loadExercisesSeed();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success]);

  if (!loaded) {
    return <LoadingScreen />;
  }

  if (error || !success) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
          <AuthProvider>
            <AppContent />
            <StatusBar style="auto" />
          </AuthProvider>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
