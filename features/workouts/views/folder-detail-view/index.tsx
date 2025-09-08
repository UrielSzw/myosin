import { RoutineWithMetrics } from "@/shared/db/repository/routines";
import { BaseFolder } from "@/shared/db/schema";
import React, { useEffect } from "react";
import { FoldersBody } from "../../elements/folders-view";
import { MoveRoutineModal } from "../../elements/move-routine-modal";
import { RoutineList } from "../../elements/routine-list";
import { useFolderDetailData } from "../../hooks/use-folder-detail-data";
import { useWorkoutsMetricsStore } from "../../hooks/use-workouts-metrics-store";

type Props = {
  selectedFolder: BaseFolder;
  setRoutineToMove: (routine: RoutineWithMetrics | null) => void;
  handleRoutineOptions: (routine: RoutineWithMetrics | null) => void;
  routineToMove: RoutineWithMetrics | null;
};

export const FolderDetailView = ({
  selectedFolder,
  routineToMove,
  setRoutineToMove,
  handleRoutineOptions,
}: Props) => {
  const setTotalRoutines = useWorkoutsMetricsStore(
    (state) => state.setTotalRoutines
  );
  const { routines, count } = useFolderDetailData(selectedFolder.id);

  useEffect(() => {
    setTotalRoutines(count);
  }, [count, setTotalRoutines]);

  return (
    <>
      <FoldersBody selectedFolderId={selectedFolder.id}>
        <RoutineList
          routines={routines}
          setRoutineToMove={setRoutineToMove}
          onPressRoutine={handleRoutineOptions}
        />
      </FoldersBody>

      <MoveRoutineModal
        visible={!!routineToMove}
        onClose={() => {
          setRoutineToMove(null);
        }}
        routine={routineToMove}
        currentFolderId={routineToMove?.folder_id}
      />
    </>
  );
};
