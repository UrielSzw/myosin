import { useActiveMainActions } from "@/features/active-workout/hooks/use-active-workout-store";
import { FolderWithMetrics } from "@/shared/db/repository/folders";
import { RoutineWithMetrics } from "@/shared/db/repository/routines";
import { useSelectedFolderStore } from "@/shared/hooks/use-selected-folder-store";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { useAuth } from "@/shared/providers/auth-provider";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, View } from "react-native";
import { folderService } from "../folder-form-v2/service/folder";
import { AuroraBackground } from "./components/AuroraBackground";
import { CreateActionSheet } from "./components/CreateActionSheet";
import { FolderOptionsSheet } from "./components/FolderOptionsSheet";
import { MoveRoutineSheet } from "./components/MoveRoutineSheet";
import { RoutineOptionsSheet } from "./components/RoutineOptionsSheet";
import { WorkoutsContent } from "./components/WorkoutsContent";
import { WorkoutsHeader } from "./components/WorkoutsHeader";
import { useMainWorkoutsData } from "./hooks/use-main-workouts-data";
import { useRoutineOptions } from "./hooks/use-routine-options";

export const WorkoutsFeatureV2 = () => {
  const selectedFolder = useSelectedFolderStore(
    (state) => state.selectedFolder
  );
  const [showCreateSheet, setShowCreateSheet] = useState(false);
  const [showRoutineOptions, setShowRoutineOptions] = useState(false);
  const [showFolderOptions, setShowFolderOptions] = useState(false);
  const [showMoveRoutine, setShowMoveRoutine] = useState(false);
  const [selectedRoutine, setSelectedRoutine] =
    useState<RoutineWithMetrics | null>(null);
  const [selectedFolderForOptions, setSelectedFolderForOptions] =
    useState<FolderWithMetrics | null>(null);

  const { initializeWorkout } = useActiveMainActions();
  const { user } = useAuth();
  const { folders } = useMainWorkoutsData();
  const queryClient = useQueryClient();
  const prefs = useUserPreferences();
  const lang = prefs?.language ?? "es";
  const { handleDeleteRoutine, handleEditRoutine, handleRemoveTrainingDays } =
    useRoutineOptions();

  const handleRoutineLongPress = (routine: RoutineWithMetrics) => {
    setSelectedRoutine(routine);
    setShowRoutineOptions(true);
  };

  const handleStartWorkout = async () => {
    if (!selectedRoutine || !user?.id) return;
    try {
      await initializeWorkout(selectedRoutine.id, user.id);
      router.push("/workout/active");
    } catch (error) {
      console.error("Error starting workout:", error);
    }
  };

  const handleMoveToFolder = () => {
    // Small delay to allow the options sheet to close first
    setTimeout(() => {
      setShowMoveRoutine(true);
    }, 100);
  };

  const handleFolderLongPress = (folder: FolderWithMetrics) => {
    setSelectedFolderForOptions(folder);
    setShowFolderOptions(true);
  };

  const handleEditFolder = () => {
    if (!selectedFolderForOptions) return;
    router.push(`/folders/edit/${selectedFolderForOptions.id}`);
  };

  const handleDeleteFolder = () => {
    if (!selectedFolderForOptions) return;

    Alert.alert(
      lang === "es" ? "Eliminar Carpeta" : "Delete Folder",
      lang === "es"
        ? "¿Estás seguro de que quieres eliminar esta carpeta? Las rutinas dentro de ella se moverán a la vista principal."
        : "Are you sure you want to delete this folder? Routines inside will be moved to the main view.",
      [
        {
          text: lang === "es" ? "Cancelar" : "Cancel",
          style: "cancel",
        },
        {
          text: lang === "es" ? "Eliminar" : "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await folderService.deleteFolder(selectedFolderForOptions.id);
              queryClient.invalidateQueries({ queryKey: ["folders"] });
              queryClient.invalidateQueries({ queryKey: ["routines"] });
              setSelectedFolderForOptions(null);
            } catch (error) {
              console.error("Error deleting folder:", error);
              Alert.alert(
                lang === "es" ? "Error" : "Error",
                lang === "es"
                  ? "No se pudo eliminar la carpeta"
                  : "Could not delete the folder"
              );
            }
          },
        },
      ]
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <AuroraBackground />
      <WorkoutsHeader
        selectedFolder={selectedFolder}
        onPressAdd={() => setShowCreateSheet(true)}
      />
      <WorkoutsContent
        selectedFolder={selectedFolder}
        onRoutineLongPress={handleRoutineLongPress}
        onFolderLongPress={handleFolderLongPress}
      />
      <CreateActionSheet
        visible={showCreateSheet}
        onClose={() => setShowCreateSheet(false)}
      />
      <RoutineOptionsSheet
        visible={showRoutineOptions}
        routine={selectedRoutine}
        onClose={() => {
          setShowRoutineOptions(false);
        }}
        onStartWorkout={handleStartWorkout}
        onEdit={() => selectedRoutine && handleEditRoutine(selectedRoutine)}
        onMoveToFolder={handleMoveToFolder}
        onClearTrainingDays={() =>
          selectedRoutine && handleRemoveTrainingDays(selectedRoutine)
        }
        onDelete={() => selectedRoutine && handleDeleteRoutine(selectedRoutine)}
      />
      <MoveRoutineSheet
        visible={showMoveRoutine}
        routine={selectedRoutine}
        currentFolderId={selectedRoutine?.folder_id}
        folders={folders}
        onClose={() => {
          setShowMoveRoutine(false);
          setSelectedRoutine(null);
        }}
      />
      <FolderOptionsSheet
        visible={showFolderOptions}
        folder={selectedFolderForOptions}
        onClose={() => {
          setShowFolderOptions(false);
        }}
        onEdit={handleEditFolder}
        onDelete={handleDeleteFolder}
      />
    </View>
  );
};
