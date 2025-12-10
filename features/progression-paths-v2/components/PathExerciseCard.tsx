import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { toSupportedLanguage } from "@/shared/types/language";
import { Typography } from "@/shared/ui/typography";
import { Check, ChevronRight, Crown, Lock, Target } from "lucide-react-native";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, { FadeInRight } from "react-native-reanimated";
import type { PathExercise } from "../types";

// ============================================================================
// Translations
// ============================================================================

const translations = {
  locked: {
    es: "Bloqueado",
    en: "Locked",
  },
  unlocking: {
    es: "En progreso",
    en: "In progress",
  },
  unlocked: {
    es: "Desbloqueado",
    en: "Unlocked",
  },
  mastered: {
    es: "Dominado",
    en: "Mastered",
  },
};

// ============================================================================
// Props
// ============================================================================

interface Props {
  exercise: PathExercise;
  index: number;
  isLast: boolean;
  onPress: (exercise: PathExercise) => void;
}

// ============================================================================
// Component
// ============================================================================

export const PathExerciseCard: React.FC<Props> = ({
  exercise,
  index,
  isLast,
  onPress,
}) => {
  const { colors, colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const prefs = useUserPreferences();
  const lang = toSupportedLanguage(prefs?.language) as "es" | "en";
  const t = translations;

  // Status colors and icons
  const getStatusConfig = () => {
    switch (exercise.status) {
      case "mastered":
        return {
          icon: Crown,
          color: colors.warning[500],
          bgColor: `${colors.warning[500]}15`,
          label: t.mastered[lang],
        };
      case "unlocked":
        return {
          icon: Check,
          color: colors.success[500],
          bgColor: `${colors.success[500]}15`,
          label: t.unlocked[lang],
        };
      case "unlocking":
        return {
          icon: Target,
          color: colors.primary[500],
          bgColor: `${colors.primary[500]}15`,
          label: `${exercise.progress?.percentage || 0}%`,
        };
      case "locked":
      default:
        return {
          icon: Lock,
          color: colors.textMuted,
          bgColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
          label: t.locked[lang],
        };
    }
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  const cardBg =
    exercise.status === "locked"
      ? isDark
        ? "rgba(255,255,255,0.02)"
        : "rgba(0,0,0,0.01)"
      : isDark
      ? "rgba(255,255,255,0.04)"
      : "rgba(0,0,0,0.02)";

  const cardBorder =
    exercise.status === "unlocking"
      ? colors.primary[500]
      : isDark
      ? "rgba(255,255,255,0.08)"
      : "rgba(0,0,0,0.06)";

  return (
    <Animated.View entering={FadeInRight.duration(300).delay(index * 60)}>
      {/* Connector line */}
      {!isLast && (
        <View style={styles.connectorContainer}>
          <View
            style={[
              styles.connectorLine,
              {
                backgroundColor:
                  exercise.status === "unlocked" ||
                  exercise.status === "mastered"
                    ? colors.success[500]
                    : isDark
                    ? "rgba(255,255,255,0.12)"
                    : "rgba(0,0,0,0.08)",
              },
            ]}
          />
        </View>
      )}

      <TouchableOpacity
        style={[
          styles.card,
          {
            backgroundColor: cardBg,
            borderColor: cardBorder,
            borderWidth: exercise.status === "unlocking" ? 1.5 : 1,
          },
        ]}
        onPress={() => onPress(exercise)}
        activeOpacity={0.7}
      >
        {/* Level indicator */}
        <View
          style={[styles.levelBadge, { backgroundColor: statusConfig.bgColor }]}
        >
          <Typography
            variant="caption"
            weight="bold"
            style={{ color: statusConfig.color }}
          >
            {index + 1}
          </Typography>
        </View>

        {/* Main content */}
        <View style={styles.content}>
          <Typography
            variant="body1"
            weight={exercise.status === "unlocking" ? "semibold" : "medium"}
            numberOfLines={1}
            style={{
              opacity: exercise.status === "locked" ? 0.6 : 1,
            }}
          >
            {exercise.exerciseName}
          </Typography>

          {/* Progress bar for unlocking */}
          {exercise.status === "unlocking" && exercise.progress && (
            <View style={styles.progressContainer}>
              <View
                style={[
                  styles.progressBar,
                  {
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.08)"
                      : "rgba(0,0,0,0.06)",
                  },
                ]}
              >
                <View
                  style={[
                    styles.progressFill,
                    {
                      backgroundColor: colors.primary[500],
                      width: `${exercise.progress.percentage}%`,
                    },
                  ]}
                />
              </View>
            </View>
          )}
        </View>

        {/* Status icon */}
        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: statusConfig.bgColor },
            ]}
          >
            <StatusIcon size={16} color={statusConfig.color} />
          </View>
          <ChevronRight
            size={18}
            color={colors.textMuted}
            style={{ marginLeft: 8 }}
          />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    padding: 14,
    marginBottom: 0,
  },
  connectorContainer: {
    position: "absolute",
    left: 23,
    top: 56,
    bottom: -8,
    width: 2,
    zIndex: -1,
  },
  connectorLine: {
    flex: 1,
    width: 2,
    borderRadius: 1,
  },
  levelBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  content: {
    flex: 1,
    marginRight: 12,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default PathExerciseCard;
