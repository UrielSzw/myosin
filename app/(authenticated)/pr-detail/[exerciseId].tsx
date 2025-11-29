import { PRDetailFeatureV2 } from "@/features/pr-detail-v2";
import { useLocalSearchParams } from "expo-router";
import React from "react";

export default function PRDetailScreen() {
  const { exerciseId } = useLocalSearchParams<{ exerciseId: string }>();

  if (!exerciseId) {
    throw new Error("Exercise ID is required");
  }

  return <PRDetailFeatureV2 exerciseId={exerciseId} />;
}
