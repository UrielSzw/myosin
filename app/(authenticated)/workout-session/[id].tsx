import { WorkoutSessionDetailV2 } from "@/features/workout-session-detail-v2";
import { useLocalSearchParams } from "expo-router";
import React from "react";

export default function WorkoutSessionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  if (!id) {
    throw new Error("Session ID is required");
  }

  return <WorkoutSessionDetailV2 sessionId={id} />;
}
