import { WorkoutSummaryV2 } from "@/features/workout-summary-v2";
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
      <WorkoutSummaryV2 />
    </>
  );
}
