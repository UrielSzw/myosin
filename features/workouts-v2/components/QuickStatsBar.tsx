import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
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
  const lang = prefs?.language ?? "es";

  return (
    <View style={styles.container}>
      {/* Routines stat */}
      <View
        style={[
          styles.statCard,
          {
            backgroundColor: isDarkMode
              ? "rgba(255,255,255,0.04)"
              : "rgba(255,255,255,0.8)",
            borderColor: isDarkMode
              ? "rgba(255,255,255,0.06)"
              : "rgba(0,0,0,0.04)",
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
        <View style={styles.statContent}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: `${colors.primary[500]}15` },
            ]}
          >
            <Dumbbell size={18} color={colors.primary[500]} />
          </View>
          <View style={styles.textContainer}>
            <Typography
              variant="h4"
              weight="bold"
              style={{ color: colors.text }}
            >
              {routinesCount}
            </Typography>
            <Typography variant="caption" color="textMuted">
              {lang === "es" ? "Rutinas" : "Routines"}
            </Typography>
          </View>
        </View>
      </View>

      {/* Folders stat */}
      <View
        style={[
          styles.statCard,
          {
            backgroundColor: isDarkMode
              ? "rgba(255,255,255,0.04)"
              : "rgba(255,255,255,0.8)",
            borderColor: isDarkMode
              ? "rgba(255,255,255,0.06)"
              : "rgba(0,0,0,0.04)",
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
        <View style={styles.statContent}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: "rgba(168, 85, 247, 0.15)" },
            ]}
          >
            <FolderOpen size={18} color="#A855F7" />
          </View>
          <View style={styles.textContainer}>
            <Typography
              variant="h4"
              weight="bold"
              style={{ color: colors.text }}
            >
              {foldersCount}
            </Typography>
            <Typography variant="caption" color="textMuted">
              {lang === "es" ? "Carpetas" : "Folders"}
            </Typography>
          </View>
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
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  statContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
});
