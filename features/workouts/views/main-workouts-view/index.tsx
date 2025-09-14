import { RoutineWithMetrics } from "@/shared/db/repository/routines";
import { Typography } from "@/shared/ui/typography";
import React, { useEffect } from "react";
import { View } from "react-native";
import { EmptyState } from "../../elements/empty-state";
import { MainView } from "../../elements/main-view";
import { MoveRoutineModal } from "../../elements/move-routine-modal";
import { RoutineList } from "../../elements/routine-list";
import { useMainWorkoutsData } from "../../hooks/use-main-workouts-data";
import { useWorkoutsMetricsStore } from "../../hooks/use-workouts-metrics-store";

type Props = {
  routineToMove: RoutineWithMetrics | null;
  setRoutineToMove: (routine: RoutineWithMetrics | null) => void;
  handleRoutineOptions: (routine: RoutineWithMetrics | null) => void;
};

export const MainWorkoutsView = ({
  routineToMove,
  setRoutineToMove,
  handleRoutineOptions,
}: Props) => {
  const setTotalRoutines = useWorkoutsMetricsStore(
    (state) => state.setTotalRoutines
  );
  const { routines, folders, count } = useMainWorkoutsData();

  useEffect(() => {
    setTotalRoutines(count);
  }, [count, setTotalRoutines]);

  return (
    <>
      <MainView folders={folders} routinesCount={routines.length}>
        {routines.length > 0 && (
          <View style={{ marginBottom: 24, marginTop: 16 }}>
            <Typography variant="h5" weight="semibold">
              Rutinas
            </Typography>
          </View>
        )}
        <RoutineList
          routines={routines}
          setRoutineToMove={setRoutineToMove}
          onPressRoutine={handleRoutineOptions}
        />
      </MainView>

      {routines.length === 0 && folders.length === 0 && <EmptyState />}

      <MoveRoutineModal
        visible={!!routineToMove}
        onClose={() => {
          setRoutineToMove(null);
        }}
        routine={routineToMove}
        folders={folders}
        currentFolderId={routineToMove?.folder_id}
      />
    </>
  );
};
