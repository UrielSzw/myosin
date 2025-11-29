import { useReorderBlocks } from "@/features/routine-form-v2/shared/use-reorder-blocks";
import { useReorderExercises } from "@/features/routine-form-v2/shared/use-reorder-exercises";
import { useHaptic } from "@/shared/services/haptic-service";
import { MeasurementTemplateId } from "@/shared/types/measurement";
import { ISetType, RPEValue } from "@/shared/types/workout";
import {
  BlockOptionsSheetV2,
  ExerciseOptionsSheetV2,
  MeasurementTemplateSelectorV2,
  RestTimeSheetV2,
  RPESelectorV2,
  SetTypeSheetV2,
  TempoSelectorV2,
} from "@/shared/ui/sheets-v2";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import React, { useCallback } from "react";
import { SheetTypeV2 } from "../hooks/use-form-routine-sheets-v2";
import {
  useBlockActions,
  useExerciseActions,
  useMainActions,
  useRoutineFormCurrentState,
  useSetActions,
} from "../hooks/use-routine-form-store";
import { RoutineSettingsBottomSheet } from "./RoutineSettingsBottomSheet";

type Props = {
  activeSheet: SheetTypeV2;
  closeSheet: () => void;
  // Keep refs for components that still use BottomSheetModal
  routineSettingsBottomSheetRef: React.RefObject<BottomSheetModal | null>;
};

export const BottomSheetsV2: React.FC<Props> = ({
  activeSheet,
  closeSheet,
  routineSettingsBottomSheetRef,
}) => {
  const {
    currentRestTime,
    isCurrentBlockMulti,
    currentSetType,
    currentExerciseName,
    currentSetTempo,
    currentBlockId,
    currentRestTimeType,
    currentMeasurementTemplate,
  } = useRoutineFormCurrentState();

  const { setExerciseModalMode, setIsExerciseModalOpen, clearCurrentState } =
    useMainActions();

  const { deleteSet, updateSetType, updateRpe, updateTempo } = useSetActions();
  const { updateRestTime, deleteBlock, convertBlockToIndividual } =
    useBlockActions();
  const { deleteExercise, updateMeasurementTemplate } = useExerciseActions();

  const { initializeReorder } = useReorderExercises();
  const { initializeReorder: initializeReorderBlocks } = useReorderBlocks();
  const haptic = useHaptic();

  // Set Type handlers
  const handleUpdateSetType = useCallback(
    (type: ISetType) => {
      updateSetType(type);
      closeSheet();
      clearCurrentState();
    },
    [updateSetType, closeSheet, clearCurrentState]
  );

  const handleDeleteSet = useCallback(() => {
    deleteSet();
    closeSheet();
    clearCurrentState();
  }, [deleteSet, closeSheet, clearCurrentState]);

  // Rest Time handlers
  const handleUpdateRestTime = useCallback(
    (restTime: number) => {
      updateRestTime(restTime);
      closeSheet();
      clearCurrentState();
    },
    [updateRestTime, closeSheet, clearCurrentState]
  );

  // Block Options handlers
  const handleDeleteBlock = useCallback(() => {
    deleteBlock();
    closeSheet();
    clearCurrentState();
  }, [deleteBlock, closeSheet, clearCurrentState]);

  const handleConvertBlockToIndividual = useCallback(() => {
    convertBlockToIndividual();
    closeSheet();
    clearCurrentState();
  }, [convertBlockToIndividual, closeSheet, clearCurrentState]);

  const handleShowAddExerciseModal = useCallback(() => {
    setExerciseModalMode("add-to-block");
    setIsExerciseModalOpen(true);
    closeSheet();
  }, [setExerciseModalMode, setIsExerciseModalOpen, closeSheet]);

  const handleShowReplaceModal = useCallback(() => {
    setExerciseModalMode("replace");
    setIsExerciseModalOpen(true);
    closeSheet();
  }, [setExerciseModalMode, setIsExerciseModalOpen, closeSheet]);

  const handleReorderExercises = useCallback(() => {
    if (!currentBlockId) return;
    closeSheet();
    initializeReorder(currentBlockId);
    router.push("/routines/reorder-exercises");
  }, [currentBlockId, initializeReorder, closeSheet]);

  const handleReorderBlocks = useCallback(() => {
    if (!currentBlockId) return;
    closeSheet();
    haptic.drag();
    initializeReorderBlocks();
    router.push("/routines/reorder-blocks");
  }, [currentBlockId, initializeReorderBlocks, haptic, closeSheet]);

  // Exercise Options handlers
  const handleDeleteExercise = useCallback(() => {
    deleteExercise();
    closeSheet();
    clearCurrentState();
  }, [deleteExercise, closeSheet, clearCurrentState]);

  // Measurement Template handler
  const handleUpdateMeasurementTemplate = useCallback(
    (templateId: MeasurementTemplateId) => {
      updateMeasurementTemplate(templateId);
      closeSheet();
      clearCurrentState();
    },
    [updateMeasurementTemplate, closeSheet, clearCurrentState]
  );

  // RPE handler
  const handleUpdateRpe = useCallback(
    (rpe: RPEValue | null) => {
      updateRpe(rpe);
      closeSheet();
      clearCurrentState();
    },
    [updateRpe, closeSheet, clearCurrentState]
  );

  // Tempo handler
  const handleUpdateTempo = useCallback(
    (tempo: string | null) => {
      updateTempo(tempo);
      closeSheet();
      clearCurrentState();
    },
    [updateTempo, closeSheet, clearCurrentState]
  );

  return (
    <>
      {/* V2 Modal-based sheets */}
      <SetTypeSheetV2
        visible={activeSheet === "setType"}
        onClose={closeSheet}
        onSelectSetType={handleUpdateSetType}
        onDeleteSet={handleDeleteSet}
        currentSetType={currentSetType}
      />

      <RestTimeSheetV2
        visible={activeSheet === "restTime"}
        onClose={closeSheet}
        currentValue={currentRestTime || 0}
        onSelect={handleUpdateRestTime}
        restTimeType={currentRestTimeType || "between-sets"}
      />

      <BlockOptionsSheetV2
        visible={activeSheet === "blockOptions"}
        onClose={closeSheet}
        onDelete={handleDeleteBlock}
        onConvertToIndividual={handleConvertBlockToIndividual}
        onAddExercise={handleShowAddExerciseModal}
        onReplace={handleShowReplaceModal}
        onReorderExercises={handleReorderExercises}
        onReorderBlocks={handleReorderBlocks}
        isMultiBlock={!!isCurrentBlockMulti}
        exerciseName={currentExerciseName}
      />

      <ExerciseOptionsSheetV2
        visible={activeSheet === "exerciseOptions"}
        onClose={closeSheet}
        onDelete={handleDeleteExercise}
        onReplace={handleShowReplaceModal}
        isInMultiBlock={isCurrentBlockMulti}
        exerciseName={currentExerciseName}
      />

      <MeasurementTemplateSelectorV2
        visible={activeSheet === "measurementTemplate"}
        onClose={closeSheet}
        currentTemplate={currentMeasurementTemplate}
        onSelect={handleUpdateMeasurementTemplate}
      />

      <TempoSelectorV2
        visible={activeSheet === "tempoSelector"}
        onClose={closeSheet}
        selectedTempo={currentSetTempo || ""}
        onSelect={handleUpdateTempo}
      />

      <RPESelectorV2
        visible={activeSheet === "rpeSelector"}
        onClose={closeSheet}
        onSelect={handleUpdateRpe}
        mode="form"
      />

      {/* Legacy BottomSheetModal components (to be converted later) */}
      <RoutineSettingsBottomSheet ref={routineSettingsBottomSheetRef} />
    </>
  );
};
