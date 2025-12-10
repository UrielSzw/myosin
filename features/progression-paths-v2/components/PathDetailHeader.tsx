import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { toSupportedLanguage } from "@/shared/types/language";
import { Typography } from "@/shared/ui/typography";
import { ChevronLeft, Crown, Target } from "lucide-react-native";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { ProgressionPath } from "../types";

// ============================================================================
// Translations
// ============================================================================

const translations = {
  goal: {
    es: "Meta final",
    en: "Ultimate goal",
  },
  level: {
    es: (current: number, max: number) => `Nivel ${current} de ${max}`,
    en: (current: number, max: number) => `Level ${current} of ${max}`,
  },
  mastered: {
    es: "¡Path completado!",
    en: "Path completed!",
  },
};

// ============================================================================
// Props
// ============================================================================

interface Props {
  path: ProgressionPath;
  onBack: () => void;
}

// ============================================================================
// Component
// ============================================================================

export const PathDetailHeader: React.FC<Props> = ({ path, onBack }) => {
  const insets = useSafeAreaInsets();
  const { colors, colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const prefs = useUserPreferences();
  const lang = toSupportedLanguage(prefs?.language) as "es" | "en";
  const t = translations;

  const isCompleted = path.currentLevel === path.maxLevel;
  const progressPercentage = Math.round(
    (path.currentLevel / path.maxLevel) * 100
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      {/* Back button row */}
      <View style={styles.topRow}>
        <TouchableOpacity
          onPress={onBack}
          style={[
            styles.backButton,
            {
              backgroundColor: isDark
                ? "rgba(255,255,255,0.08)"
                : "rgba(0,0,0,0.05)",
            },
          ]}
          activeOpacity={0.7}
        >
          <ChevronLeft size={22} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Title section */}
      <View style={styles.titleSection}>
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: isCompleted
                ? `${colors.warning[500]}15`
                : `${colors.primary[500]}15`,
            },
          ]}
        >
          {isCompleted ? (
            <Crown size={28} color={colors.warning[500]} />
          ) : (
            <Target size={28} color={colors.primary[500]} />
          )}
        </View>
        <View style={styles.titleText}>
          <Typography variant="caption" color="textMuted">
            {t.goal[lang]}
          </Typography>
          <Typography variant="h5" weight="bold" numberOfLines={1}>
            {path.ultimateSkill}
          </Typography>
        </View>
      </View>

      {/* Progress section */}
      <View
        style={[
          styles.progressSection,
          {
            backgroundColor: isDark
              ? "rgba(255,255,255,0.04)"
              : "rgba(0,0,0,0.02)",
          },
        ]}
      >
        <View style={styles.progressHeader}>
          <Typography variant="body2" weight="medium">
            {isCompleted
              ? t.mastered[lang]
              : t.level[lang](path.currentLevel, path.maxLevel)}
          </Typography>
          <Typography
            variant="body2"
            weight="semibold"
            style={{
              color: isCompleted ? colors.warning[500] : colors.primary[500],
            }}
          >
            {progressPercentage}%
          </Typography>
        </View>
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
    </View>
  );
};

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  titleSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  titleText: {
    marginLeft: 14,
    flex: 1,
  },
  progressSection: {
    borderRadius: 14,
    padding: 14,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
});

export default PathDetailHeader;
