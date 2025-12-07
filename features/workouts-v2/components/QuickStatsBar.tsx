import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { workoutsTranslations as t } from "@/shared/translations/workouts";
import { toSupportedLanguage } from "@/shared/types/language";
import { Typography } from "@/shared/ui/typography";
import { BlurView } from "expo-blur";
import { Dumbbell, FolderOpen } from "lucide-react-native";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";

type Props = {
  routinesCount: number;
  foldersCount: number;
};

export const QuickStatsBar = ({ routinesCount, foldersCount }: Props) => {
  const { colors, isDarkMode } = useColorScheme();
  const prefs = useUserPreferences();
  const lang = toSupportedLanguage(prefs?.language);

  return (
    <View style={styles.container}>
      {/* Routines stat */}
      <View
        style={[
          styles.statCard,
          {
            backgroundColor: isDarkMode
              ? "rgba(255,255,255,0.04)"
              : "rgba(255,255,255,0.85)",
            borderColor: isDarkMode
              ? "rgba(255,255,255,0.08)"
              : "rgba(0,0,0,0.06)",
          },
        ]}
      >
        {Platform.OS === "ios" && (
          <BlurView
            intensity={isDarkMode ? 15 : 30}
            tint={isDarkMode ? "dark" : "light"}
            style={StyleSheet.absoluteFill}
          />
        )}

        {/* Decorative glow */}
        <View
          style={[
            styles.decorativeGlow,
            { backgroundColor: colors.primary[500] },
          ]}
        />

        <View style={styles.statContent}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: `${colors.primary[500]}15` },
            ]}
          >
            <Dumbbell size={20} color={colors.primary[500]} />
          </View>
          <Typography
            variant="h2"
            weight="bold"
            style={[styles.statValue, { color: colors.text }]}
          >
            {routinesCount}
          </Typography>
          <Typography variant="caption" color="textMuted">
            {t.routines[lang]}
          </Typography>
          <Typography
            variant="caption"
            weight="medium"
            style={[styles.sublabel, { color: colors.primary[500] }]}
          >
            {t.created[lang]}
          </Typography>
        </View>
      </View>

      {/* Folders stat */}
      <View
        style={[
          styles.statCard,
          {
            backgroundColor: isDarkMode
              ? "rgba(255,255,255,0.04)"
              : "rgba(255,255,255,0.85)",
            borderColor: isDarkMode
              ? "rgba(255,255,255,0.08)"
              : "rgba(0,0,0,0.06)",
          },
        ]}
      >
        {Platform.OS === "ios" && (
          <BlurView
            intensity={isDarkMode ? 15 : 30}
            tint={isDarkMode ? "dark" : "light"}
            style={StyleSheet.absoluteFill}
          />
        )}

        {/* Decorative glow */}
        <View style={[styles.decorativeGlow, { backgroundColor: "#A855F7" }]} />

        <View style={styles.statContent}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: "rgba(168, 85, 247, 0.15)" },
            ]}
          >
            <FolderOpen size={20} color="#A855F7" />
          </View>
          <Typography
            variant="h2"
            weight="bold"
            style={[styles.statValue, { color: colors.text }]}
          >
            {foldersCount}
          </Typography>
          <Typography variant="caption" color="textMuted">
            {t.folders[lang]}
          </Typography>
          <Typography
            variant="caption"
            weight="medium"
            style={[styles.sublabel, { color: "#A855F7" }]}
          >
            {t.organized[lang]}
          </Typography>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  statCard: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
    minHeight: 130,
  },
  decorativeGlow: {
    position: "absolute",
    top: -40,
    right: -40,
    width: 80,
    height: 80,
    borderRadius: 40,
    opacity: 0.15,
  },
  statContent: {
    padding: 16,
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  statValue: {
    fontSize: 32,
    lineHeight: 36,
    marginBottom: 2,
  },
  sublabel: {
    fontSize: 11,
    marginTop: 2,
  },
});
