import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Typography } from "@/shared/ui/typography";
import { BlurView } from "expo-blur";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  selectedDate: string;
};

export const TrackerHeaderV2: React.FC<Props> = ({ selectedDate }) => {
  const { colors, isDarkMode } = useColorScheme();
  const insets = useSafeAreaInsets();

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
          Tracker
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
