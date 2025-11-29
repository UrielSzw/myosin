import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { profileTranslations as t } from "@/shared/translations/profile";
import { Typography } from "@/shared/ui/typography";
import { BlurView } from "expo-blur";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const ProfileHeader = () => {
  const insets = useSafeAreaInsets();
  const { colors, isDarkMode } = useColorScheme();
  const prefs = useUserPreferences();
  const lang = (prefs?.language ?? "es") as "es" | "en";

  return (
    <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
      {Platform.OS === "ios" && (
        <BlurView
          intensity={isDarkMode ? 25 : 40}
          tint={isDarkMode ? "dark" : "light"}
          style={StyleSheet.absoluteFill}
        />
      )}

      <View style={styles.headerContent}>
        {/* Title centered */}
        <Typography variant="h4" weight="bold" style={{ color: colors.text }}>
          {t.title[lang]}
        </Typography>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
});
