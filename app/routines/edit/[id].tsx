import { RoutineFormFeature } from "@/features/routine-form";
import { useMainActions } from "@/features/routine-form/hooks/use-routine-form-store";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";

export default function EditRoutineScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { initializeForm } = useMainActions();
  const { show_rpe, show_tempo } = useUserPreferences() || {};

  useEffect(() => {
    if (id) {
      initializeForm(id, show_rpe, show_tempo);
    }
  }, [id, initializeForm, show_rpe, show_tempo]);

  return <RoutineFormFeature />;
}
