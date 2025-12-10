import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { toSupportedLanguage } from "@/shared/types/language";
import { Typography } from "@/shared/ui/typography";
import {
  ChevronRight,
  Crown,
  Lock,
  Sparkles,
  Target,
  Unlock,
} from "lucide-react-native";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import type { ProgressionPath } from "../types";

// ============================================================================
// Translations
// ============================================================================

const translations = {
  current: {
    es: "Actual",
    en: "Current",
  },
  next: {
    es: "Siguiente",
    en: "Next",
  },
  mastered: {
    es: "¡Dominado!",
    en: "Mastered!",
  },
  ultimate: {
    es: "Meta",
    en: "Goal",
  },
  level: {
    es: (current: number, max: number) => `Nivel ${current}/${max}`,
    en: (current: number, max: number) => `Level ${current}/${max}`,
  },
  exercises: {
    es: (count: number) =>
      count === 1 ? "1 ejercicio" : `${count} ejercicios`,
    en: (count: number) => (count === 1 ? "1 exercise" : `${count} exercises`),
  },
};

// ============================================================================
// Props
// ============================================================================

interface Props {
  path: ProgressionPath;
  index: number;
  onPress: (path: ProgressionPath) => void;
}

// ============================================================================
// Component
// ============================================================================

export const PathCard: React.FC<Props> = ({ path, index, onPress }) => {
  const { colors, colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const prefs = useUserPreferences();
  const lang = toSupportedLanguage(prefs?.language) as "es" | "en";
  const t = translations;

  const cardBg = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.02)";
  const cardBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";

  const progressPercentage = Math.round(
    (path.currentLevel / path.maxLevel) * 100
  );
  const isCompleted = path.currentLevel === path.maxLevel;

  // Determine status icon and color
  const getStatusInfo = () => {
    if (isCompleted) {
      return {
        icon: Crown,
        color: colors.warning[500],
        label: t.mastered[lang],
      };
    }
    if (path.currentExercise?.status === "unlocking") {
      return {
        icon: Target,
        color: colors.primary[500],
        label: `${path.currentExercise.progress?.percentage || 0}%`,
      };
    }
    if (path.currentLevel > 0) {
      return {
        icon: Unlock,
        color: colors.success[500],
        label: t.level[lang](path.currentLevel, path.maxLevel),
      };
    }
    return {
      icon: Lock,
      color: colors.textMuted,
      label: t.level[lang](0, path.maxLevel),
    };
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  return (
    <Animated.View entering={FadeInDown.duration(300).delay(index * 50)}>
      <TouchableOpacity
        style={[
          styles.card,
          {
            backgroundColor: cardBg,
            borderColor: cardBorder,
          },
        ]}
        onPress={() => onPress(path)}
        activeOpacity={0.7}
      >
        {/* Top section: Path name and status */}
        <View style={styles.topSection}>
          <View style={styles.pathInfo}>
            <Typography variant="body1" weight="semibold" numberOfLines={1}>
              {path.ultimateSkill}
            </Typography>
            <Typography
              variant="caption"
              color="textMuted"
              numberOfLines={1}
              style={{ marginTop: 2 }}
            >
              {t.exercises[lang](path.exercises.length)}
            </Typography>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: `${statusInfo.color}15` },
            ]}
          >
            <StatusIcon size={14} color={statusInfo.color} />
            <Typography
              variant="caption"
              weight="medium"
              style={{ color: statusInfo.color, marginLeft: 4 }}
            >
              {statusInfo.label}
            </Typography>
          </View>
        </View>

        {/* Progress bar */}
        <View style={styles.progressSection}>
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
                  backgroundColor: isCompleted
                    ? colors.warning[500]
                    : colors.primary[500],
                  width: `${progressPercentage}%`,
                },
              ]}
            />
          </View>
        </View>

        {/* Bottom section: Current -> Next */}
        <View style={styles.bottomSection}>
          {path.currentExercise && !isCompleted ? (
            <View style={styles.journeyInfo}>
              <View style={styles.exerciseInfo}>
                <Sparkles size={12} color={colors.primary[500]} />
                <Typography
                  variant="caption"
                  color="textMuted"
                  numberOfLines={1}
                  style={{ marginLeft: 4, flex: 1 }}
                >
                  {path.currentExercise.exerciseName}
                </Typography>
              </View>
              {path.nextExercise && (
                <>
                  <ChevronRight
                    size={14}
                    color={colors.textMuted}
                    style={{ marginHorizontal: 4 }}
                  />
                  <View style={styles.exerciseInfo}>
                    <Lock size={12} color={colors.textMuted} />
                    <Typography
                      variant="caption"
                      color="textMuted"
                      numberOfLines={1}
                      style={{ marginLeft: 4, flex: 1 }}
                    >
                      {path.nextExercise.exerciseName}
                    </Typography>
                  </View>
                </>
              )}
            </View>
          ) : isCompleted ? (
            <View style={styles.completedInfo}>
              <Crown size={14} color={colors.warning[500]} />
              <Typography
                variant="caption"
                weight="medium"
                style={{ color: colors.warning[500], marginLeft: 4 }}
              >
                {t.mastered[lang]}
              </Typography>
            </View>
          ) : (
            <View style={styles.lockedInfo}>
              <Lock size={14} color={colors.textMuted} />
              <Typography
                variant="caption"
                color="textMuted"
                style={{ marginLeft: 4 }}
              >
                {path.exercises[0]?.exerciseName}
              </Typography>
            </View>
          )}

          <ChevronRight size={20} color={colors.textMuted} />
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
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  topSection: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  pathInfo: {
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  progressSection: {
    marginBottom: 12,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  bottomSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  journeyInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
  },
  exerciseInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  completedInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  lockedInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
});

export default PathCard;
