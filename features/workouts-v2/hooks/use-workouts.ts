import { RoutineWithMetrics } from "@/shared/db/repository/routines";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useRef, useState } from "react";
import { useRoutineOptions } from "./use-routine-options";

export const useWorkouts = () => {
  const { handleDeleteRoutine, handleEditRoutine, handleRemoveTrainingDays } =
    useRoutineOptions();

  const routineOptionsBottomSheetRef = useRef<BottomSheetModal>(null);
  const [routineToMove, setRoutineToMove] = useState<RoutineWithMetrics | null>(
    null
  );
  const [selectedRoutine, setSelectedRoutine] =
    useState<RoutineWithMetrics | null>(null);

  const handleRoutineOptions = (routine: RoutineWithMetrics | null) => {
    setSelectedRoutine(routine);
    routineOptionsBottomSheetRef.current?.present();
  };

  const handleDelete = async () => {
    // Lógica para eliminar la rutina
    if (!selectedRoutine) return;

    await handleDeleteRoutine(selectedRoutine);

    routineOptionsBottomSheetRef.current?.dismiss();
    setSelectedRoutine(null);
  };

  const handleEdit = async () => {
    if (!selectedRoutine) return;

    handleEditRoutine(selectedRoutine);
    routineOptionsBottomSheetRef.current?.dismiss();
    setSelectedRoutine(null);
  };

  const handleClearTrainingDays = async () => {
    if (!selectedRoutine) return;

    await handleRemoveTrainingDays(selectedRoutine);
    routineOptionsBottomSheetRef.current?.dismiss();
    setSelectedRoutine(null);
  };

  return {
    routineOptionsBottomSheetRef,
    routineToMove,
    setRoutineToMove,
    handleRoutineOptions,
    handleDelete,
    handleEdit,
    handleClearTrainingDays,
    selectedRoutine,
  };
};
