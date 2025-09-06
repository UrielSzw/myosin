import { RoutineFormFeature } from "@/features/routine-form";
import { useMainActions } from "@/features/routine-form/hooks/use-routine-form-store";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";

export default function EditRoutineScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { initializeForm } = useMainActions();

  useEffect(() => {
    if (id) {
      initializeForm(id);
    }
  }, [id, initializeForm]);

  return <RoutineFormFeature />;
}
