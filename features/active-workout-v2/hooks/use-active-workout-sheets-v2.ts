import { useCallback, useState } from "react";

export type IActiveSheetV2 =
  | "setType"
  | "restTime"
  | "blockOptions"
  | "exerciseOptions"
  | "rpeSelector"
  | "tempoMetronome"
  | "exerciseSelector"
  | "finishConfirm"
  | "exitConfirm"
  | null;

export const useActiveWorkoutSheetsV2 = () => {
  const [activeSheet, setActiveSheet] = useState<IActiveSheetV2>(null);

  const openSheet = useCallback((sheet: IActiveSheetV2) => {
    setActiveSheet(sheet);
  }, []);

  const closeSheet = useCallback(() => {
    setActiveSheet(null);
  }, []);

  const isSheetOpen = useCallback(
    (sheet: IActiveSheetV2) => activeSheet === sheet,
    [activeSheet]
  );

  return {
    activeSheet,
    openSheet,
    closeSheet,
    isSheetOpen,
    // Convenience methods for each sheet
    openSetTypeSheet: useCallback(() => openSheet("setType"), [openSheet]),
    openRestTimeSheet: useCallback(() => openSheet("restTime"), [openSheet]),
    openBlockOptionsSheet: useCallback(
      () => openSheet("blockOptions"),
      [openSheet]
    ),
    openExerciseOptionsSheet: useCallback(
      () => openSheet("exerciseOptions"),
      [openSheet]
    ),
    openRPESelectorSheet: useCallback(
      () => openSheet("rpeSelector"),
      [openSheet]
    ),
    openTempoMetronomeSheet: useCallback(
      () => openSheet("tempoMetronome"),
      [openSheet]
    ),
    openExerciseSelectorSheet: useCallback(
      () => openSheet("exerciseSelector"),
      [openSheet]
    ),
    openFinishConfirmSheet: useCallback(
      () => openSheet("finishConfirm"),
      [openSheet]
    ),
    openExitConfirmSheet: useCallback(
      () => openSheet("exitConfirm"),
      [openSheet]
    ),
  };
};
