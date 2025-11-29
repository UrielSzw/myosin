import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { Typography } from "@/shared/ui/typography";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import { Dumbbell, Sparkles } from "lucide-react-native";
import React from "react";
import {
  Dimensions,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export const EmptyStateV2 = () => {
  const { colors, isDarkMode } = useColorScheme();
  const prefs = useUserPreferences();
  const lang = prefs?.language ?? "es";

  const handleCreateRoutine = () => {
    router.push("/routines/create" as any);
  };

  return (
    <View style={styles.container}>
      {/* Illustration */}
      <View style={styles.illustrationContainer}>
        {/* Background glow */}
        <View
          style={[
            styles.illustrationGlow,
            { backgroundColor: colors.primary[500] },
          ]}
        />

        {/* Glass circle with icon */}
        <View
          style={[
            styles.illustrationCircle,
            {
              backgroundColor: isDarkMode
                ? "rgba(255,255,255,0.05)"
                : "rgba(255,255,255,0.8)",
              borderColor: isDarkMode
                ? "rgba(255,255,255,0.08)"
                : "rgba(0,0,0,0.04)",
            },
          ]}
        >
          {Platform.OS === "ios" && (
            <BlurView
              intensity={isDarkMode ? 20 : 40}
              tint={isDarkMode ? "dark" : "light"}
              style={StyleSheet.absoluteFill}
            />
          )}
          <Dumbbell size={48} color={colors.primary[500]} strokeWidth={1.5} />
        </View>
      </View>

      {/* Text content */}
      <View style={styles.textContent}>
        <Typography
          variant="h3"
          weight="bold"
          align="center"
          style={{ color: colors.text }}
        >
          {lang === "es"
            ? "Tu viaje comienza aquí"
            : "Your journey starts here"}
        </Typography>
        <Typography
          variant="body1"
          align="center"
          style={{ color: colors.textMuted, marginTop: 8, lineHeight: 24 }}
        >
          {lang === "es"
            ? "Crea tu primera rutina y empieza a transformar tu entrenamiento"
            : "Create your first routine and start transforming your training"}
        </Typography>
      </View>

      {/* CTA Button */}
      <View style={styles.ctaContainer}>
        <View
          style={[styles.ctaGlow, { backgroundColor: colors.primary[500] }]}
        />
        <Pressable
          onPress={handleCreateRoutine}
          style={({ pressed }) => [
            styles.ctaButton,
            {
              backgroundColor: colors.primary[500],
              opacity: pressed ? 0.9 : 1,
              transform: [{ scale: pressed ? 0.98 : 1 }],
            },
          ]}
        >
          <Sparkles size={20} color="#fff" style={{ marginRight: 8 }} />
          <Typography variant="body1" weight="bold" style={{ color: "#fff" }}>
            {lang === "es" ? "Crear Rutina" : "Create Routine"}
          </Typography>
        </Pressable>
      </View>

      {/* Hint text */}
      <Typography
        variant="caption"
        align="center"
        color="textMuted"
        style={{ marginTop: 16, opacity: 0.7 }}
      >
        {lang === "es"
          ? "O toca el + en la parte superior"
          : "Or tap + at the top"}
      </Typography>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingTop: SCREEN_HEIGHT * 0.1,
  },
  illustrationContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
  },
  illustrationGlow: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    opacity: 0.1,
  },
  illustrationCircle: {
    width: 120,
    height: 120,
    borderRadius: 40,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  textContent: {
    alignItems: "center",
    marginBottom: 32,
  },
  ctaContainer: {
    position: "relative",
    width: "100%",
  },
  ctaGlow: {
    position: "absolute",
    top: 8,
    left: 20,
    right: 20,
    bottom: -4,
    borderRadius: 16,
    opacity: 0.2,
  },
  ctaButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    shadowColor: "#0ea5e9",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
});
