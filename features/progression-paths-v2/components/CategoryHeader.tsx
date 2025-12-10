import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { toSupportedLanguage } from "@/shared/types/language";
import { Typography } from "@/shared/ui/typography";
import React from "react";
import { StyleSheet, View } from "react-native";

// ============================================================================
// Translations
// ============================================================================

const categoryLabels = {
  upper_body: { es: "Tren Superior", en: "Upper Body" },
  lower_body: { es: "Tren Inferior", en: "Lower Body" },
  core: { es: "Core", en: "Core" },
  pull: { es: "Tirón", en: "Pull" },
  push: { es: "Empuje", en: "Push" },
  skills: { es: "Skills", en: "Skills" },
  default: { es: "Otros", en: "Other" },
} as const;

// ============================================================================
// Props
// ============================================================================

interface Props {
  category: string;
}

// ============================================================================
// Component
// ============================================================================

export const CategoryHeader: React.FC<Props> = ({ category }) => {
  const { colors, colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const prefs = useUserPreferences();
  const lang = toSupportedLanguage(prefs?.language) as "es" | "en";

  // Normalize category for lookup
  const normalizedCategory = category.toLowerCase().replace(/[^a-z_]/g, "_");
  const labelKey = Object.keys(categoryLabels).find((key) =>
    normalizedCategory.includes(key)
  ) as keyof typeof categoryLabels | undefined;

  const label = labelKey
    ? categoryLabels[labelKey][lang]
    : categoryLabels.default[lang];

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.line,
          {
            backgroundColor: isDark
              ? "rgba(255,255,255,0.08)"
              : "rgba(0,0,0,0.06)",
          },
        ]}
      />
      <View
        style={[
          styles.labelContainer,
          {
            backgroundColor: isDark
              ? "rgba(255,255,255,0.06)"
              : "rgba(0,0,0,0.04)",
          },
        ]}
      >
        <Typography
          variant="caption"
          weight="semibold"
          style={{ color: colors.textMuted, letterSpacing: 0.5 }}
        >
          {label.toUpperCase()}
        </Typography>
      </View>
      <View
        style={[
          styles.line,
          {
            backgroundColor: isDark
              ? "rgba(255,255,255,0.08)"
              : "rgba(0,0,0,0.06)",
          },
        ]}
      />
    </View>
  );
};

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
    paddingHorizontal: 8,
  },
  line: {
    flex: 1,
    height: 1,
  },
  labelContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginHorizontal: 12,
  },
});

export default CategoryHeader;
