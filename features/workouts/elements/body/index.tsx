import { RoutineWithMetrics } from "@/shared/db/repository/routines";
import { BaseFolder } from "@/shared/db/schema";
import { Typography } from "@/shared/ui/typography";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { useRef, useState } from "react";
import { View } from "react-native";
import { useRoutineOptions } from "../../hooks/use-routine-options";
import { FoldersBody } from "../folders-view";
import { MainView } from "../main-view";
import { MoveRoutineModal } from "../move-routine-modal";
import { RoutineList } from "../routine-list";
import { RoutineOptionsBottomSheet } from "../routine-options-sheet";

type Props = {
  routines: RoutineWithMetrics[];
  folders: BaseFolder[];
  selectedFolder: BaseFolder | null;
  setSelectedFolder: (folder: BaseFolder | null) => void;
  refetch: () => Promise<void>;
};

export const Body: React.FC<Props> = ({
  routines,
  folders,
  selectedFolder,
  setSelectedFolder,
  refetch,
}) => {
  const { handleDeleteRoutine, handleEditRoutine } = useRoutineOptions();

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

    await handleDeleteRoutine(selectedRoutine, refetch);

    routineOptionsBottomSheetRef.current?.dismiss();
    setSelectedRoutine(null);
  };

  const handleEdit = async () => {
    if (!selectedRoutine) return;

    handleEditRoutine(selectedRoutine);
    routineOptionsBottomSheetRef.current?.dismiss();
    setSelectedRoutine(null);
  };

  return (
    <>
      {selectedFolder ? (
        <FoldersBody
          selectedFolderId={selectedFolder.id}
          setSelectedFolder={setSelectedFolder}
        >
          <RoutineList
            routines={routines}
            setRoutineToMove={setRoutineToMove}
            onPressRoutine={handleRoutineOptions}
          />
        </FoldersBody>
      ) : (
        <MainView
          folders={folders}
          onReorder={() => {}}
          setSelectedFolder={setSelectedFolder}
        >
          {routines.length > 0 && (
            <View style={{ marginBottom: 24 }}>
              <Typography
                variant="h5"
                weight="semibold"
                style={{ marginBottom: 16 }}
              >
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
      )}

      <MoveRoutineModal
        visible={!!routineToMove}
        onClose={() => {
          setRoutineToMove(null);
        }}
        routine={routineToMove}
        folders={folders}
        currentFolderId={routineToMove?.folder_id}
        refetch={refetch}
      />

      <RoutineOptionsBottomSheet
        ref={routineOptionsBottomSheetRef}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />
    </>
  );
};
