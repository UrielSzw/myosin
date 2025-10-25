import { db, sqlite } from "@/shared/db/client";
import migrations from "@/shared/db/drizzle/migrations";
import { loadExercisesSeed } from "@/shared/db/seed/seed";
import { useUserPreferencesLoad } from "@/shared/hooks/use-user-preferences-store";
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

export default function RootLayout() {
  console.log("🚀 RootLayout starting...");

  const loadUserPreferences = useUserPreferencesLoad();
  const { success, error } = useMigrations(db, migrations);

  console.log("📊 Migration status:", { success, error });

  useDrizzleStudio(sqlite);

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      // Load data from storage when app starts
      loadUserPreferences("default-user");
    }
  }, [loaded, loadUserPreferences]);

  useEffect(() => {
    if (success) {
      loadExercisesSeed();
    }
  }, [success]);

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  if (error || !success) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
          <Stack.Screen
            name="routines/create"
            options={{
              presentation: "fullScreenModal",
              headerShown: false,
              gestureEnabled: false,
            }}
          />
          <Stack.Screen
            name="routines/edit/[id]"
            options={{
              presentation: "fullScreenModal",
              headerShown: false,
              gestureEnabled: false,
            }}
          />
          <Stack.Screen
            name="routines/templates"
            options={{
              // presentation: "modal",
              headerShown: false,
              // gestureEnabled: false,
            }}
          />
          <Stack.Screen
            name="routines/template-detail/[id]"
            options={{
              presentation: "modal",
              headerShown: false,
              // gestureEnabled: false,
            }}
          />
          <Stack.Screen
            name="folders/create"
            options={{
              presentation: "modal",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="folders/edit/[id]"
            options={{
              presentation: "modal",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="routines/reorder-blocks"
            options={{
              presentation: "fullScreenModal",
              headerShown: false,
              title: "Reordenar Bloques",
              gestureEnabled: false,
            }}
          />
          <Stack.Screen
            name="routines/reorder-exercises"
            options={{
              presentation: "fullScreenModal",
              headerShown: false,
              title: "Reordenar Ejercicios",
              gestureEnabled: false,
              gestureDirection: "horizontal",
              fullScreenGestureEnabled: false,
            }}
          />
          <Stack.Screen
            name="workout/active"
            options={{
              presentation: "fullScreenModal",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="profile/workout-config"
            options={{
              presentation: "modal",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="metric/create"
            options={{
              presentation: "modal",
              headerShown: false,
              gestureEnabled: false,
            }}
          />
          <Stack.Screen
            name="workout-session/[id]"
            options={{
              presentation: "modal",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="workout-session/workout-session-list"
            options={{
              headerShown: false,
              title: "Sesiones de Entrenamiento",
            }}
          />
          <Stack.Screen
            name="pr-list/index"
            options={{
              headerShown: false,
              title: "Records Personales",
            }}
          />
          <Stack.Screen
            name="pr-detail/[exerciseId]"
            options={{
              presentation: "modal",
              headerShown: false,
              title: "Historial de PR",
            }}
          />
        </Stack>
        <StatusBar style="auto" />
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
