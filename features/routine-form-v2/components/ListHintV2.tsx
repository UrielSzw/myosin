import { toSupportedLanguage } from "@/shared/types/language";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { routineFormTranslations } from "@/shared/translations/routine-form";
import { Typography } from "@/shared/ui/typography";
import { BlurView } from "expo-blur";
import { Lightbulb } from "lucide-react-native";
import React from "react";
import { StyleSheet, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

export const ListHintV2: React.FC = () => {
  const { isDarkMode } = useColorScheme();
  const prefs = useUserPreferences();
  const lang = toSupportedLanguage(prefs?.language);
  const t = routineFormTranslations;

  return (
    <Animated.View
      entering={FadeInDown.delay(200).duration(400)}
      style={styles.container}
    >
      <BlurView
        intensity={isDarkMode ? 20 : 15}
        tint={isDarkMode ? "dark" : "light"}
        style={[
          styles.card,
          {
            borderColor: isDarkMode
              ? "rgba(234, 179, 8, 0.2)"
              : "rgba(234, 179, 8, 0.3)",
            backgroundColor: isDarkMode
              ? "rgba(234, 179, 8, 0.08)"
              : "rgba(234, 179, 8, 0.05)",
          },
        ]}
      >
        {/* Subtle decorative glow */}
        <View style={styles.decorativeGlow} />

        {/* Icon */}
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: isDarkMode
                ? "rgba(234, 179, 8, 0.2)"
                : "rgba(234, 179, 8, 0.15)",
            },
          ]}
        >
          <Lightbulb size={16} color="#EAB308" />
        </View>

        {/* Text */}
        <Typography
          variant="caption"
          weight="medium"
          style={[styles.text, { color: isDarkMode ? "#FCD34D" : "#B45309" }]}
        >
          {t.listHint[lang]}
        </Typography>
      </BlurView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden",
    gap: 12,
  },
  decorativeGlow: {
    position: "absolute",
    top: -20,
    right: -20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#EAB308",
    opacity: 0.1,
  },
  accentBar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: "#EAB308",
    borderTopLeftRadius: 14,
    borderBottomLeftRadius: 14,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    flex: 1,
    lineHeight: 18,
  },
});
