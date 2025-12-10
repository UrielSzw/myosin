import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { toSupportedLanguage } from "@/shared/types/language";
import { Typography } from "@/shared/ui/typography";
import { Trees } from "lucide-react-native";
import React from "react";
import { StyleSheet, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

// ============================================================================
// Translations
// ============================================================================

const translations = {
  title: {
    es: "Sin progresiones",
    en: "No progressions",
  },
  description: {
    es: "Las progresiones se cargarán automáticamente con los datos de ejercicios. Asegurate de tener ejercicios con progresiones configuradas.",
    en: "Progressions will be loaded automatically with exercise data. Make sure you have exercises with progressions configured.",
  },
};

// ============================================================================
// Component
// ============================================================================

export const EmptyState: React.FC = () => {
  const { colors, colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const prefs = useUserPreferences();
  const lang = toSupportedLanguage(prefs?.language) as "es" | "en";
  const t = translations;

  return (
    <Animated.View
      entering={FadeIn.duration(400)}
      style={[
        styles.container,
        {
          backgroundColor: isDark
            ? "rgba(255,255,255,0.04)"
            : "rgba(0,0,0,0.02)",
        },
      ]}
    >
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: `${colors.primary[500]}15` },
        ]}
      >
        <Trees size={40} color={colors.primary[500]} />
      </View>
      <Typography
        variant="body1"
        weight="semibold"
        align="center"
        style={{ marginTop: 16 }}
      >
        {t.title[lang]}
      </Typography>
      <Typography
        variant="body2"
        color="textMuted"
        align="center"
        style={{ marginTop: 8, maxWidth: 280 }}
      >
        {t.description[lang]}
      </Typography>
    </Animated.View>
  );
};

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    borderRadius: 20,
    marginHorizontal: 16,
    marginTop: 40,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default EmptyState;
