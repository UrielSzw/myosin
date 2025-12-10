import { AuroraBackground } from "@/features/workouts-v2/components/AuroraBackground";
import type { BaseExercise } from "@/shared/db/schema";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { toSupportedLanguage } from "@/shared/types/language";
import {
  ExerciseDetailViewV2,
  type ProgressionContext,
} from "@/shared/ui/exercise-detail-v2";
import { Typography } from "@/shared/ui/typography";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PathDetailHeader } from "./components/PathDetailHeader";
import { PathExerciseCard } from "./components/PathExerciseCard";
import { useProgressionPaths } from "./hooks/use-progression-paths";
import type { PathExercise, ProgressionPath } from "./types";

// ============================================================================
// Translations
// ============================================================================

const translations = {
  exercises: {
    es: "Ejercicios del path",
    en: "Path exercises",
  },
  startHere: {
    es: "Empezá acá",
    en: "Start here",
  },
  currentFocus: {
    es: "Enfoque actual",
    en: "Current focus",
  },
  loading: {
    es: "Cargando...",
    en: "Loading...",
  },
  notFound: {
    es: "Path no encontrado",
    en: "Path not found",
  },
};

// ============================================================================
// Component
// ============================================================================

export const PathDetailView: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const prefs = useUserPreferences();
  const lang = toSupportedLanguage(prefs?.language) as "es" | "en";
  const t = translations;

  // Get path data from params - can be pathId or pathData (serialized)
  const params = useLocalSearchParams<{ pathId?: string; pathData?: string }>();

  // Use the hook to load paths if we only have pathId
  const { paths, isLoading } = useProgressionPaths();

  // Determine the path to display
  const [path, setPath] = useState<ProgressionPath | null>(null);

  // V2 Background
  const screenBg = isDark ? "rgba(10, 10, 12, 1)" : "rgba(250, 250, 252, 1)";

  useEffect(() => {
    // First try to parse pathData if provided
    if (params.pathData) {
      try {
        const parsed = JSON.parse(params.pathData) as ProgressionPath;
        setPath(parsed);
        return;
      } catch {
        console.warn("Failed to parse path data");
      }
    }

    // If we have pathId, find it in the loaded paths
    if (params.pathId && paths.length > 0) {
      const found = paths.find((p) => p.pathId === params.pathId);
      if (found) {
        setPath(found);
      }
    }
  }, [params.pathData, params.pathId, paths]);

  // State for exercise detail modal
  const [selectedExercise, setSelectedExercise] = useState<BaseExercise | null>(
    null
  );
  const [selectedProgressionContext, setSelectedProgressionContext] =
    useState<ProgressionContext | null>(null);

  const handleBack = () => {
    router.back();
  };

  const handleExercisePress = useCallback(
    (exercise: PathExercise) => {
      if (!path || !exercise.exerciseData) return;

      // Use pre-loaded exercise data - no async loading needed!
      const progressionContext: ProgressionContext = {
        pathId: path.pathId,
        pathName: path.pathName,
        pathColor:
          path.exercises[0]?.exerciseId === exercise.exerciseId
            ? colors.primary[500]
            : colors.secondary[500],
        currentLevel: exercise.order + 1, // 1-indexed for display
        maxLevel: path.maxLevel,
        status: exercise.status,
        unlockCriteriaForNext: exercise.unlockCriteriaForNext,
        nextExerciseName: exercise.nextExerciseName,
      };

      setSelectedExercise(exercise.exerciseData);
      setSelectedProgressionContext(progressionContext);
    },
    [path, colors.primary, colors.secondary]
  );

  const handleCloseExerciseDetail = useCallback(() => {
    setSelectedExercise(null);
    setSelectedProgressionContext(null);
  }, []);

  // Loading state
  if (isLoading && !path) {
    return (
      <View style={styles.container}>
        <AuroraBackground />
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={colors.primary[500]} />
          <Typography
            variant="body2"
            color="textMuted"
            style={{ marginTop: 12 }}
          >
            {t.loading[lang]}
          </Typography>
        </View>
      </View>
    );
  }

  // Error state
  if (!path) {
    return (
      <View style={styles.container}>
        <AuroraBackground />
        <View style={styles.centerContent}>
          <Typography variant="body1" color="textMuted">
            {t.notFound[lang]}
          </Typography>
        </View>
      </View>
    );
  }

  // Find the first unlocking or first locked exercise for "start here" indicator
  const focusIndex = path.exercises.findIndex((e) => e.status === "unlocking");
  const startIndex =
    focusIndex >= 0
      ? focusIndex
      : path.exercises.findIndex((e) => e.status === "locked");

  return (
    <View style={styles.container}>
      <AuroraBackground />

      <PathDetailHeader path={path} onBack={handleBack} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Section header */}
        <View style={styles.sectionHeader}>
          <Typography variant="caption" weight="semibold" color="textMuted">
            {t.exercises[lang].toUpperCase()}
          </Typography>
          <View
            style={[
              styles.countBadge,
              {
                backgroundColor: isDark
                  ? "rgba(255,255,255,0.06)"
                  : "rgba(0,0,0,0.04)",
              },
            ]}
          >
            <Typography variant="caption" color="textMuted">
              {path.exercises.length}
            </Typography>
          </View>
        </View>

        {/* Start here / Current focus indicator */}
        {startIndex >= 0 && startIndex < path.exercises.length && (
          <Animated.View
            entering={FadeIn.duration(300).delay(200)}
            style={[
              styles.focusIndicator,
              {
                backgroundColor: `${colors.primary[500]}10`,
                borderColor: `${colors.primary[500]}30`,
              },
            ]}
          >
            <Typography
              variant="caption"
              weight="semibold"
              style={{ color: colors.primary[500] }}
            >
              {focusIndex >= 0 ? t.currentFocus[lang] : t.startHere[lang]}:{" "}
              {path.exercises[startIndex]?.exerciseName}
            </Typography>
          </Animated.View>
        )}

        {/* Exercise list */}
        <View style={styles.exerciseList}>
          {path.exercises.map((exercise, index) => (
            <PathExerciseCard
              key={exercise.exerciseId}
              exercise={exercise}
              index={index}
              isLast={index === path.exercises.length - 1}
              onPress={handleExercisePress}
            />
          ))}
        </View>
      </ScrollView>

      {/* Exercise Detail Modal */}
      <Modal
        visible={!!selectedExercise}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleCloseExerciseDetail}
        backdropColor={screenBg}
      >
        {selectedExercise && (
          <ExerciseDetailViewV2
            exercise={selectedExercise}
            onClose={handleCloseExerciseDetail}
            progressionContext={selectedProgressionContext ?? undefined}
          />
        )}
      </Modal>
    </View>
  );
};

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  countBadge: {
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  focusIndicator: {
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
  },
  exerciseList: {
    gap: 12,
  },
});

export default PathDetailView;
