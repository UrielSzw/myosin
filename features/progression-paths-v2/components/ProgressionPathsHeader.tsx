import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { toSupportedLanguage } from "@/shared/types/language";
import { Typography } from "@/shared/ui/typography";
import { ChevronLeft, Trees } from "lucide-react-native";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ============================================================================
// Translations
// ============================================================================

const translations = {
  title: {
    es: "Progresiones",
    en: "Progressions",
  },
  subtitle: {
    es: "Tu camino hacia skills avanzados",
    en: "Your path to advanced skills",
  },
};

// ============================================================================
// Props
// ============================================================================

interface Props {
  onBack: () => void;
  pathsCount: number;
  completedPaths: number;
}

// ============================================================================
// Component
// ============================================================================

export const ProgressionPathsHeader: React.FC<Props> = ({
  onBack,
  pathsCount,
  completedPaths,
}) => {
  const insets = useSafeAreaInsets();
  const { colors, colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const prefs = useUserPreferences();
  const lang = toSupportedLanguage(prefs?.language) as "es" | "en";
  const t = translations;

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
            { backgroundColor: `${colors.primary[500]}15` },
          ]}
        >
          <Trees size={28} color={colors.primary[500]} />
        </View>
        <View style={styles.titleText}>
          <Typography variant="h5" weight="bold">
            {t.title[lang]}
          </Typography>
          <Typography variant="caption" color="textMuted">
            {t.subtitle[lang]}
          </Typography>
        </View>
      </View>

      {/* Stats pill */}
      {pathsCount > 0 && (
        <View
          style={[
            styles.statsPill,
            {
              backgroundColor: isDark
                ? "rgba(255,255,255,0.06)"
                : "rgba(0,0,0,0.04)",
            },
          ]}
        >
          <Typography variant="caption" color="textMuted">
            {completedPaths}/{pathsCount} paths
          </Typography>
        </View>
      )}
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
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  titleText: {
    marginLeft: 12,
    flex: 1,
  },
  statsPill: {
    alignSelf: "flex-start",
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
});

export default ProgressionPathsHeader;
