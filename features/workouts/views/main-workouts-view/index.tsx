import { RoutineWithMetrics } from "@/shared/db/repository/routines";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { workoutsTranslations } from "@/shared/translations/workouts";
import { Typography } from "@/shared/ui/typography";
import React, { useEffect } from "react";
import { View } from "react-native";
import { useMainWorkoutsData } from "../../../workouts-v2/hooks/use-main-workouts-data";
import { useWorkoutsMetricsStore } from "../../../workouts-v2/hooks/use-workouts-metrics-store";
import { EmptyState } from "../../elements/empty-state";
import { MainView } from "../../elements/main-view";
import { MoveRoutineModal } from "../../elements/move-routine-modal";
import { NextWorkoutCard } from "../../elements/next-workout-card";
import { RoutineList } from "../../elements/routine-list";

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
  const prefs = useUserPreferences();
  const lang = prefs?.language ?? "es";
  const t = workoutsTranslations;

  useEffect(() => {
    setTotalRoutines(count);
  }, [count, setTotalRoutines]);

  // Combine all routines (including those in folders) for next workout calculation
  const allRoutines = routines;

  return (
    <>
      <MainView
        folders={folders}
        routinesCount={routines.length}
        headerContent={<NextWorkoutCard routines={allRoutines} />}
      >
        {routines.length > 0 && (
          <View style={{ marginBottom: 24, marginTop: 16 }}>
            <Typography variant="h5" weight="semibold">
              {t.myRoutines[lang]}
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
