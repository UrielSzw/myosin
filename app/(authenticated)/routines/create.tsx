import { RoutineFormV2Feature } from "@/features/routine-form-v2";
import { useMainActions } from "@/features/routine-form-v2/hooks/use-routine-form-store";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import React, { useEffect } from "react";

export default function CreateRoutineScreen() {
  const { show_rpe, show_tempo } = useUserPreferences() || {};
  const { initializeForm } = useMainActions();

  useEffect(() => {
    initializeForm(undefined, show_rpe, show_tempo);
  }, [initializeForm, show_rpe, show_tempo]);

  return <RoutineFormV2Feature />;
}
