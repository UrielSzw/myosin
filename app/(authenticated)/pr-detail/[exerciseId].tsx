import { PRDetailFeature } from "@/features/pr-detail";
import { useLocalSearchParams } from "expo-router";
import React from "react";

export default function PRDetailScreen() {
  const { exerciseId } = useLocalSearchParams<{ exerciseId: string }>();

  if (!exerciseId) {
    throw new Error("Exercise ID is required");
  }

  return <PRDetailFeature exerciseId={exerciseId} />;
}
