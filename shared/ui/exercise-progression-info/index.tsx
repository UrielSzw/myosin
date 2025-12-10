import { progressionPathsRepository } from "@/shared/db/repository/progressions";
import { BaseExercise } from "@/shared/db/schema";
import type { ProgressionPath } from "@/shared/db/schema/progressions";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { toSupportedLanguage } from "@/shared/types/language";
import { Typography } from "@/shared/ui/typography";
import { TrendingUp } from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

// ============================================================================
// Types
// ============================================================================

interface Props {
  exercise: BaseExercise;
}

// ============================================================================
// Translations
// ============================================================================

const translations = {
  partOf: {
    es: "Parte de",
    en: "Part of",
  },
  // Path names
  pathNames: {
    "progressions.paths.pullup.name": {
      es: "Progresión de Dominadas",
      en: "Pull-up Progression",
    },
    "progressions.paths.pushup.name": {
      es: "Progresión de Flexiones",
      en: "Push-up Progression",
    },
    "progressions.paths.dip.name": {
      es: "Progresión de Fondos",
      en: "Dip Progression",
    },
  } as Record<string, { es: string; en: string }>,
};

// ============================================================================
// Component - Passive informational badge (no interaction)
// ============================================================================

export const ExerciseProgressionInfo: React.FC<Props> = ({ exercise }) => {
  const { colors } = useColorScheme();
  const prefs = useUserPreferences();
  const lang = toSupportedLanguage(prefs?.language) as "es" | "en";
  const t = translations;

  const [paths, setPaths] = useState<ProgressionPath[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadPaths = useCallback(async () => {
    setIsLoading(true);
    try {
      const exercisePaths =
        await progressionPathsRepository.getPathsForExercise(exercise.id);
      setPaths(exercisePaths);
    } catch (error) {
      console.error("Error loading paths:", error);
    } finally {
      setIsLoading(false);
    }
  }, [exercise.id]);

  useEffect(() => {
    loadPaths();
  }, [loadPaths]);

  // Don't render anything if no paths or loading
  if (isLoading || paths.length === 0) {
    return null;
  }

  // Get the first path (usually exercises belong to one main path)
  const mainPath = paths[0]!;
  const pathColor = mainPath.color || colors.secondary[500];

  // Get translated path name
  const pathName = t.pathNames[mainPath.name_key]?.[lang] || mainPath.name_key;

  return (
    <Animated.View entering={FadeIn.delay(200).duration(300)}>
      <View
        style={[
          styles.badge,
          {
            backgroundColor: `${pathColor}15`,
            borderColor: `${pathColor}25`,
          },
        ]}
      >
        {/* Icon */}
        <View
          style={[styles.iconContainer, { backgroundColor: `${pathColor}20` }]}
        >
          <TrendingUp size={14} color={pathColor} />
        </View>

        {/* Text */}
        <Typography
          variant="caption"
          weight="medium"
          style={{ color: pathColor, marginLeft: 8 }}
        >
          {t.partOf[lang]}: {pathName}
        </Typography>
      </View>
    </Animated.View>
  );
};

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  iconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ExerciseProgressionInfo;
