import { useCallback, useState } from "react";

export type SheetTypeV2 =
  | "setType"
  | "measurementTemplate"
  | "restTime"
  | "blockOptions"
  | "exerciseOptions"
  | "routineSettings"
  | "rpeSelector"
  | "tempoSelector"
  | null;

export const useFormRoutineSheetsV2 = () => {
  const [activeSheet, setActiveSheet] = useState<SheetTypeV2>(null);

  const openSheet = useCallback((sheet: SheetTypeV2) => {
    setActiveSheet(sheet);
  }, []);

  const closeSheet = useCallback(() => {
    setActiveSheet(null);
  }, []);

  const isSheetOpen = useCallback(
    (sheet: SheetTypeV2) => activeSheet === sheet,
    [activeSheet]
  );

  return {
    activeSheet,
    openSheet,
    closeSheet,
    isSheetOpen,
    // Individual visibility states for convenience
    isSetTypeSheetOpen: activeSheet === "setType",
    isMeasurementTemplateSheetOpen: activeSheet === "measurementTemplate",
    isRestTimeSheetOpen: activeSheet === "restTime",
    isBlockOptionsSheetOpen: activeSheet === "blockOptions",
    isExerciseOptionsSheetOpen: activeSheet === "exerciseOptions",
    isRoutineSettingsSheetOpen: activeSheet === "routineSettings",
    isRpeSelectorSheetOpen: activeSheet === "rpeSelector",
    isTempoSelectorSheetOpen: activeSheet === "tempoSelector",
  };
};
