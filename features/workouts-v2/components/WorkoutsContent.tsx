import { FolderWithMetrics } from "@/shared/db/repository/folders";
import { RoutineWithMetrics } from "@/shared/db/repository/routines";
import { BaseFolder } from "@/shared/db/schema";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { workoutsTranslations as t } from "@/shared/translations/workouts";
import { toSupportedLanguage } from "@/shared/types/language";
import { Typography } from "@/shared/ui/typography";
import { Folder } from "lucide-react-native";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import Animated, { FadeIn, FadeInDown, FadeOut } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFolderDetailData } from "../hooks/use-folder-detail-data";
import { useMainWorkoutsData } from "../hooks/use-main-workouts-data";
import { EmptyStateV2 } from "./EmptyStateV2";
import { FolderCardV2 } from "./FolderCardV2";
import { NextWorkoutCardV2 } from "./NextWorkoutCardV2";
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
  const { colors } = useColorScheme();
  const prefs = useUserPreferences();
  const lang = toSupportedLanguage(prefs?.language);

  // Calculate header height to match TrackerFeatureV2
  const headerHeight = insets.top + 8 + 60 + 20;

  // Main data (when no folder is selected)
  const {
    routines: mainRoutines,
    folders,
    loading: mainLoading,
  } = useMainWorkoutsData();

  // Folder data (when a folder is selected)
  const { routines: folderRoutines, loading: folderLoading } =
    useFolderDetailData(selectedFolder?.id || "skip");

  // Use the appropriate data based on selection
  const routines = selectedFolder ? folderRoutines : mainRoutines;
  const isLoading = selectedFolder ? folderLoading : mainLoading;
  const isEmpty = selectedFolder
    ? folderRoutines.length === 0
    : mainRoutines.length === 0 && folders.length === 0;

  // Don't render content until data is loaded to avoid empty state flash
  if (isLoading) {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.content,
          { paddingTop: headerHeight, paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      />
    );
  }

  // Folder view content
  if (selectedFolder) {
    const folderColor = selectedFolder.color || colors.primary[500];

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
          {/* Routines in folder */}
          {folderRoutines.length > 0 ? (
            <View style={styles.section}>
              <View style={styles.routinesList}>
                {folderRoutines.map((routine, index) => (
                  <Animated.View
                    key={routine.id}
                    entering={FadeInDown.duration(300).delay(100 + index * 50)}
                  >
                    <RoutineCardV2
                      routine={routine}
                      onLongPress={onRoutineLongPress}
                    />
                  </Animated.View>
                ))}
              </View>
            </View>
          ) : (
            <View style={styles.emptyFolderState}>
              <View
                style={[
                  styles.emptyFolderIcon,
                  {
                    backgroundColor: `${folderColor}15`,
                  },
                ]}
              >
                <Folder size={40} color={folderColor} />
              </View>
              <Typography
                variant="body1"
                color="textMuted"
                align="center"
                style={{ marginTop: 16 }}
              >
                {t.emptyFolder[lang]}
              </Typography>
              <Typography
                variant="caption"
                color="textMuted"
                align="center"
                style={{ marginTop: 4, opacity: 0.7 }}
              >
                {t.moveRoutinesHere[lang]}
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
          <Animated.View entering={FadeInDown.duration(400).delay(100)}>
            <NextWorkoutCardV2 routines={routines} />
          </Animated.View>

          {/* Folders Section */}
          {folders.length > 0 && (
            <Animated.View
              entering={FadeInDown.duration(400).delay(200)}
              style={styles.section}
            >
              <SectionHeader title={t.folders[lang]} count={folders.length} />
              <View style={styles.foldersGrid}>
                {folders.map((folder, index) => (
                  <Animated.View
                    key={folder.id}
                    entering={FadeInDown.duration(300).delay(250 + index * 50)}
                    style={styles.folderCardWrapper}
                  >
                    <FolderCardV2
                      folder={folder}
                      onLongPress={onFolderLongPress}
                    />
                  </Animated.View>
                ))}
              </View>
            </Animated.View>
          )}

          {/* Routines Section */}
          {routines.length > 0 && (
            <Animated.View
              entering={FadeInDown.duration(400).delay(
                folders.length > 0 ? 300 + folders.length * 50 : 200
              )}
              style={styles.section}
            >
              <SectionHeader
                title={t.myRoutines[lang]}
                count={routines.length}
              />
              <View style={styles.routinesList}>
                {routines.map((routine, index) => (
                  <Animated.View
                    key={routine.id}
                    entering={FadeInDown.duration(300).delay(
                      (folders.length > 0 ? 350 + folders.length * 50 : 250) +
                        index * 50
                    )}
                  >
                    <RoutineCardV2
                      routine={routine}
                      onLongPress={onRoutineLongPress}
                    />
                  </Animated.View>
                ))}
              </View>
            </Animated.View>
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
  folderCardWrapper: {
    width: "48%",
  },
  routinesList: {
    gap: 12,
    marginTop: 12,
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
