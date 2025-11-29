import { FolderWithMetrics } from "@/shared/db/repository/folders";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useSelectedFolderStore } from "@/shared/hooks/use-selected-folder-store";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { Typography } from "@/shared/ui/typography";
import { BlurView } from "expo-blur";
import { ChevronRight, FolderOpen } from "lucide-react-native";
import React from "react";
import {
  Dimensions,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = (SCREEN_WIDTH - 40 - 12) / 2; // 40 = padding, 12 = gap

type Props = {
  folder: FolderWithMetrics;
  onLongPress?: (folder: FolderWithMetrics) => void;
};

export const FolderCardV2 = ({ folder, onLongPress }: Props) => {
  const { colors, isDarkMode } = useColorScheme();
  const prefs = useUserPreferences();
  const lang = prefs?.language ?? "es";
  const setSelectedFolder = useSelectedFolderStore(
    (state) => state.setSelectedFolder
  );

  const handlePress = () => {
    setSelectedFolder(folder);
  };

  const handleLongPress = () => {
    onLongPress?.(folder);
  };

  // Generate a color based on folder name (consistent per folder)
  const folderColors = [
    "#A855F7", // Purple
    "#EC4899", // Pink
    "#F97316", // Orange
    "#10B981", // Emerald
    "#6366F1", // Indigo
    "#EAB308", // Yellow
  ];

  const colorIndex =
    folder.name
      .split("")
      .reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0) %
    folderColors.length;
  const folderColor = folderColors[colorIndex];

  return (
    <Pressable
      onPress={handlePress}
      onLongPress={handleLongPress}
      delayLongPress={400}
      style={({ pressed }) => [
        { opacity: pressed ? 0.8 : 1, width: CARD_WIDTH },
      ]}
    >
      <View
        style={[
          styles.card,
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

        <View style={styles.content}>
          {/* Folder icon */}
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: `${folderColor}15` },
            ]}
          >
            <FolderOpen size={22} color={folderColor} />
          </View>

          {/* Folder name */}
          <Typography
            variant="body2"
            weight="semibold"
            style={{ color: colors.text, marginTop: 12 }}
            numberOfLines={1}
          >
            {folder.name}
          </Typography>

          {/* Routine count */}
          <Typography
            variant="caption"
            color="textMuted"
            style={{ marginTop: 2 }}
          >
            {folder.routineCount}{" "}
            {folder.routineCount === 1
              ? lang === "es"
                ? "rutina"
                : "routine"
              : lang === "es"
              ? "rutinas"
              : "routines"}
          </Typography>

          {/* Chevron indicator */}
          <View style={styles.chevronContainer}>
            <ChevronRight size={16} color={colors.textMuted} />
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: "hidden",
    aspectRatio: 1,
  },
  content: {
    flex: 1,
    padding: 16,
    position: "relative",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  chevronContainer: {
    position: "absolute",
    bottom: 14,
    right: 14,
    opacity: 0.5,
  },
});
