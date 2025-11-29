import { FolderWithMetrics } from "@/shared/db/repository/folders";
import { RoutineWithMetrics } from "@/shared/db/repository/routines";
import { BaseFolder } from "@/shared/db/schema";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { Typography } from "@/shared/ui/typography";
import { Folder } from "lucide-react-native";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFolderDetailData } from "../hooks/use-folder-detail-data";
import { useMainWorkoutsData } from "../hooks/use-main-workouts-data";
import { EmptyStateV2 } from "./EmptyStateV2";
import { FolderCardV2 } from "./FolderCardV2";
import { NextWorkoutCardV2 } from "./NextWorkoutCardV2";
import { QuickStatsBar } from "./QuickStatsBar";
import { RoutineCardV2 } from "./RoutineCardV2";
import { SectionHeader } from "./SectionHeader";

type Props = {
  selectedFolder: BaseFolder | null;
  onRoutineLongPress: (routine: RoutineWithMetrics) => void;
  onFolderLongPress: (folder: FolderWithMetrics) => void;
};

export const WorkoutsContent = ({
  selectedFolder,
  onRoutineLongPress,
  onFolderLongPress,
}: Props) => {
  const insets = useSafeAreaInsets();
  const { colors, isDarkMode } = useColorScheme();
  const prefs = useUserPreferences();
  const lang = prefs?.language ?? "es";

  // Calculate header height to match TrackerFeatureV2
  const headerHeight = insets.top + 8 + 60 + 20;

  // Main data (when no folder is selected)
  const { routines: mainRoutines, folders } = useMainWorkoutsData();

  // Folder data (when a folder is selected)
  const { routines: folderRoutines } = useFolderDetailData(
    selectedFolder?.id || "skip"
  );

  // Use the appropriate data based on selection
  const routines = selectedFolder ? folderRoutines : mainRoutines;
  const isEmpty = selectedFolder
    ? folderRoutines.length === 0
    : mainRoutines.length === 0 && folders.length === 0;

  // Folder view content
  if (selectedFolder) {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.content,
          { paddingTop: headerHeight, paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          entering={FadeIn.duration(300)}
          exiting={FadeOut.duration(200)}
        >
          {/* Folder info header */}
          <View
            style={[
              styles.folderInfoCard,
              {
                backgroundColor: isDarkMode
                  ? "rgba(255,255,255,0.04)"
                  : "rgba(255,255,255,0.8)",
                borderColor: isDarkMode
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(0,0,0,0.06)",
              },
            ]}
          >
            <View
              style={[
                styles.folderIconLarge,
                {
                  backgroundColor: `${
                    selectedFolder.color || colors.primary[500]
                  }20`,
                },
              ]}
            >
              {selectedFolder.icon ? (
                <Typography style={{ fontSize: 28 }}>
                  {selectedFolder.icon}
                </Typography>
              ) : (
                <Folder
                  size={28}
                  color={selectedFolder.color || colors.primary[500]}
                />
              )}
            </View>
            <View style={styles.folderInfoText}>
              <Typography
                variant="h4"
                weight="bold"
                style={{ color: colors.text }}
              >
                {selectedFolder.name}
              </Typography>
              <Typography
                variant="body2"
                color="textMuted"
                style={{ marginTop: 4 }}
              >
                {folderRoutines.length}{" "}
                {folderRoutines.length === 1
                  ? lang === "es"
                    ? "rutina"
                    : "routine"
                  : lang === "es"
                  ? "rutinas"
                  : "routines"}
              </Typography>
            </View>
          </View>

          {/* Routines in folder */}
          {folderRoutines.length > 0 ? (
            <View style={styles.section}>
              <View style={styles.routinesList}>
                {folderRoutines.map((routine) => (
                  <RoutineCardV2
                    key={routine.id}
                    routine={routine}
                    onLongPress={onRoutineLongPress}
                  />
                ))}
              </View>
            </View>
          ) : (
            <View style={styles.emptyFolderState}>
              <View
                style={[
                  styles.emptyFolderIcon,
                  {
                    backgroundColor: isDarkMode
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(0,0,0,0.03)",
                  },
                ]}
              >
                <Folder size={40} color={colors.textMuted} />
              </View>
              <Typography
                variant="body1"
                color="textMuted"
                align="center"
                style={{ marginTop: 16 }}
              >
                {lang === "es" ? "Carpeta vacía" : "Empty folder"}
              </Typography>
              <Typography
                variant="caption"
                color="textMuted"
                align="center"
                style={{ marginTop: 4, opacity: 0.7 }}
              >
                {lang === "es"
                  ? "Mueve rutinas aquí para organizarlas"
                  : "Move routines here to organize them"}
              </Typography>
            </View>
          )}
        </Animated.View>
      </ScrollView>
    );
  }

  // Main view content
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        { paddingTop: headerHeight, paddingBottom: insets.bottom + 100 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {isEmpty ? (
        <EmptyStateV2 />
      ) : (
        <>
          {/* Next Workout Hero Card */}
          <NextWorkoutCardV2 routines={routines} />

          {/* Quick Stats */}
          <QuickStatsBar
            routinesCount={routines.length}
            foldersCount={folders.length}
          />

          {/* Folders Section */}
          {folders.length > 0 && (
            <View style={styles.section}>
              <SectionHeader
                title={lang === "es" ? "Carpetas" : "Folders"}
                count={folders.length}
              />
              <View style={styles.foldersGrid}>
                {folders.map((folder) => (
                  <FolderCardV2
                    key={folder.id}
                    folder={folder}
                    onLongPress={onFolderLongPress}
                  />
                ))}
              </View>
            </View>
          )}

          {/* Routines Section */}
          {routines.length > 0 && (
            <View style={styles.section}>
              <SectionHeader
                title={lang === "es" ? "Mis Rutinas" : "My Routines"}
                count={routines.length}
              />
              <View style={styles.routinesList}>
                {routines.map((routine) => (
                  <RoutineCardV2
                    key={routine.id}
                    routine={routine}
                    onLongPress={onRoutineLongPress}
                  />
                ))}
              </View>
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 24,
  },
  foldersGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 12,
  },
  routinesList: {
    gap: 12,
    marginTop: 12,
  },
  folderInfoCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 8,
  },
  folderIconLarge: {
    width: 64,
    height: 64,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  folderInfoText: {
    flex: 1,
    marginLeft: 16,
  },
  emptyFolderState: {
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyFolderIcon: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
});
