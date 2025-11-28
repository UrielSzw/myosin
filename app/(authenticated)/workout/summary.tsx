import { WorkoutSummaryFeature } from "@/features/workout-summary";
import { Stack } from "expo-router";

export default function WorkoutSummaryScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <WorkoutSummaryFeature />
    </>
  );
}
