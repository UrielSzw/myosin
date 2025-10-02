import { RoutineFormFeature } from "@/features/routine-form";
import { useMainActions } from "@/features/routine-form/hooks/use-routine-form-store";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import React, { useEffect } from "react";

export default function CreateRoutineScreen() {
  const { show_rpe, show_tempo } = useUserPreferences() || {};
  const { initializeForm } = useMainActions();

  useEffect(() => {
    initializeForm(undefined, show_rpe, show_tempo);
  }, [initializeForm, show_rpe, show_tempo]);

  return <RoutineFormFeature />;
}
