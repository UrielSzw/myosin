import { db, sqlite } from "@/shared/db/client";
import migrations from "@/shared/db/drizzle/migrations";
import { loadExercisesSeed } from "@/shared/db/seed/seed";
import { useNetwork } from "@/shared/hooks/use-network";
import { AuthProvider, useAuth } from "@/shared/providers/auth-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";

const queryClient = new QueryClient();

function LoadingScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
}

function AppContent() {
  const { user, loading } = useAuth();
  // const loadUserPreferences = useUserPreferencesLoad();

  // Cargar preferences cuando el usuario esté disponible
  // useEffect(() => {
  //   if (user?.id) {
  //     loadUserPreferences(user.id);
  //   }
  // }, [user?.id, loadUserPreferences]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {user ? (
        <>
          <Stack.Screen name="(authenticated)" />
          <Stack.Screen name="+not-found" />
        </>
      ) : (
        <Stack.Screen name="auth" />
      )}
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
    return null;
  }

  if (error || !success) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <AppContent />
          <StatusBar style="auto" />
        </GestureHandlerRootView>
      </AuthProvider>
    </QueryClientProvider>
  );
}
