import { WorkoutSessionDetailFeature } from "@/features/workout-session-detail";
import { useLocalSearchParams } from "expo-router";
import React from "react";

export default function WorkoutSessionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  if (!id) {
    throw new Error("Session ID is required");
  }

  return <WorkoutSessionDetailFeature sessionId={id} />;
}
