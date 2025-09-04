import { BaseFolder } from "@/shared/db/schema";
import { ScreenWrapper } from "@/shared/ui/screen-wrapper";
import React, { useState } from "react";
import { Text } from "react-native";
import { Body } from "./elements/body";
import { EmptyState } from "./elements/empty-state";
import { Header } from "./elements/header";
import { useFolders } from "./hooks/use-folders";
import { useRoutinesByFolder } from "./hooks/use-routines-by-folder";

export const WorkoutsFeature = () => {
  const [selectedFolder, setSelectedFolder] = useState<BaseFolder | null>(null);

  const { routines, loading, error } = useRoutinesByFolder(
    selectedFolder?.id || null
  );

  const {
    folders,
    loading: foldersLoading,
    error: foldersError,
  } = useFolders();

  if (loading || foldersLoading) return <Text>Loading...</Text>;
  if (error || foldersError)
    return <Text>Error: {error?.message || foldersError?.message}</Text>;

  return (
    <ScreenWrapper withSheets>
      <Header
        selectedFolder={selectedFolder}
        routinesLength={routines.length}
      />

      <Body
        routines={routines}
        folders={folders}
        selectedFolder={selectedFolder}
        setSelectedFolder={setSelectedFolder}
      />

      {routines.length === 0 && folders.length === 0 && <EmptyState />}
    </ScreenWrapper>
  );
};
