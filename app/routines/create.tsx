import { RoutineFormFeature } from "@/features/routine-form";
import { useMainActions } from "@/features/routine-form/hooks/use-routine-form-store";
import React, { useEffect } from "react";

export default function CreateRoutineScreen() {
  const { initializeForm } = useMainActions();

  useEffect(() => {
    initializeForm();
  }, [initializeForm]);

  return <RoutineFormFeature />;
}
