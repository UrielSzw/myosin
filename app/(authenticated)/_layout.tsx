import { Stack } from "expo-router";

export default function AuthenticatedLayout() {
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
          title: "Reordenar Bloques",
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="routines/reorder-exercises"
        options={{
          presentation: "fullScreenModal",
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
        name="metric/create"
        options={{
          presentation: "modal",
          gestureEnabled: false,
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
          title: "Sesiones de Entrenamiento",
        }}
      />
      <Stack.Screen
        name="pr-list/index"
        options={{
          title: "Records Personales",
        }}
      />
      <Stack.Screen
        name="pr-detail/[exerciseId]"
        options={{
          presentation: "modal",
          title: "Historial de PR",
        }}
      />
    </Stack>
  );
}
