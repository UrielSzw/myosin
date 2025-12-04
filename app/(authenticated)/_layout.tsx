import { useProtectedRoute } from "@/shared/hooks/use-protected-route";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { useSync } from "@/shared/sync/hooks/use-sync";
import { sharedUiTranslations } from "@/shared/translations/shared-ui";
import { toSupportedLanguage } from "@/shared/types/language";
import { LoadingScreen } from "@/shared/ui/loading-screen";
import { Stack } from "expo-router";

/**
 * Authenticated Layout: Protege todas las rutas autenticadas
 * - Verifica que el usuario esté autenticado
 * - Inicializa el sistema de sync automático
 * - Redirige a /auth/sign-in si no hay usuario
 */
export default function AuthenticatedLayout() {
  const { user, loading } = useProtectedRoute();
  const prefs = useUserPreferences();
  const lang = toSupportedLanguage(prefs?.language);
  const t = sharedUiTranslations;

  // Inicializar sistema de sync solo cuando hay usuario autenticado
  useSync();

  // Mostrar loading mientras verifica auth
  if (loading) {
    return <LoadingScreen />;
  }

  // Si no hay usuario, useProtectedRoute ya hizo el redirect
  // Este return solo es por TypeScript, nunca se ejecutará
  if (!user) {
    return <LoadingScreen />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* Main tabs */}
      <Stack.Screen name="(tabs)" />

      {/* Modals and full screen experiences */}
      <Stack.Screen
        name="routines/create"
        options={{
          presentation: "fullScreenModal",
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="routines/edit/[id]"
        options={{
          presentation: "fullScreenModal",
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="routines/templates"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="routines/template-detail/[id]"
        options={{
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="routines/reorder-blocks"
        options={{
          presentation: "fullScreenModal",
          title: t.reorderBlocks[lang],
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="routines/reorder-exercises"
        options={{
          presentation: "fullScreenModal",
          title: t.reorderBlockExercises[lang],
          gestureEnabled: false,
          gestureDirection: "horizontal",
          fullScreenGestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="workout/active"
        options={{
          presentation: "fullScreenModal",
        }}
      />
      <Stack.Screen
        name="workout/summary"
        options={{
          presentation: "transparentModal",
          gestureEnabled: false,
          animation: "fade",
        }}
      />
      <Stack.Screen
        name="folders/create"
        options={{
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="folders/edit/[id]"
        options={{
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="profile/workout-config"
        options={{
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="profile/edit"
        options={{
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="workout-session/[id]"
        options={{
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="workout-session/workout-session-list"
        options={{
          title: t.workoutSessions[lang],
        }}
      />
      <Stack.Screen
        name="pr-list/index"
        options={{
          title: t.personalRecords[lang],
        }}
      />
      <Stack.Screen
        name="pr-detail/[exerciseId]"
        options={{
          presentation: "modal",
          title: t.prHistory[lang],
        }}
      />
    </Stack>
  );
}
