import { BaseFolder } from "@/shared/db/schema";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useSelectedFolderStore } from "@/shared/hooks/use-selected-folder-store";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { Typography } from "@/shared/ui/typography";
import { BlurView } from "expo-blur";
import { ChevronLeft, Dumbbell, FolderOpen, Plus } from "lucide-react-native";
import React from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  selectedFolder: BaseFolder | null;
  onPressAdd: () => void;
};

export const WorkoutsHeader = ({ selectedFolder, onPressAdd }: Props) => {
  const { colors, isDarkMode } = useColorScheme();
  const insets = useSafeAreaInsets();
  const setSelectedFolder = useSelectedFolderStore(
    (state) => state.setSelectedFolder
  );
  const prefs = useUserPreferences();
  const lang = prefs?.language ?? "es";

  const handleBack = () => {
    setSelectedFolder(null);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Glass effect background */}
      {Platform.OS === "ios" && (
        <BlurView
          intensity={isDarkMode ? 40 : 60}
          tint={isDarkMode ? "dark" : "light"}
          style={StyleSheet.absoluteFill}
        />
      )}
      {Platform.OS === "android" && (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: isDarkMode
                ? "rgba(3, 5, 8, 0.85)"
                : "rgba(248, 250, 252, 0.9)",
            },
          ]}
        />
      )}

      <View style={styles.content}>
        {/* Left: Back button or Logo */}
        <View style={styles.leftSection}>
          {selectedFolder ? (
            <Pressable
              onPress={handleBack}
              style={({ pressed }) => [
                styles.backButton,
                {
                  backgroundColor: isDarkMode
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(0,0,0,0.05)",
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <ChevronLeft size={22} color={colors.text} />
            </Pressable>
          ) : (
            <View
              style={[
                styles.logoContainer,
                {
                  backgroundColor: `${colors.primary[500]}15`,
                },
              ]}
            >
              <Dumbbell size={22} color={colors.primary[500]} />
            </View>
          )}
        </View>

        {/* Center: Title */}
        <View style={styles.centerSection}>
          {selectedFolder ? (
            <View style={styles.folderTitle}>
              <FolderOpen
                size={18}
                color={colors.primary[500]}
                style={{ marginRight: 8 }}
              />
              <Typography
                variant="body1"
                weight="semibold"
                numberOfLines={1}
                style={{ color: colors.text, maxWidth: 200 }}
              >
                {selectedFolder.name}
              </Typography>
            </View>
          ) : (
            <Typography
              variant="h4"
              weight="bold"
              style={{ color: colors.text }}
            >
              {lang === "es" ? "Rutinas" : "Routines"}
            </Typography>
          )}
        </View>

        {/* Right: Add button */}
        <View style={styles.rightSection}>
          <Pressable
            onPress={onPressAdd}
            style={({ pressed }) => [
              styles.addButton,
              {
                backgroundColor: colors.primary[500],
                opacity: pressed ? 0.8 : 1,
                transform: [{ scale: pressed ? 0.95 : 1 }],
              },
            ]}
          >
            <Plus size={20} color="#fff" strokeWidth={2.5} />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(128, 128, 128, 0.1)",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 56,
  },
  leftSection: {
    width: 44,
    alignItems: "flex-start",
  },
  centerSection: {
    flex: 1,
    alignItems: "center",
  },
  rightSection: {
    width: 44,
    alignItems: "flex-end",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  folderTitle: {
    flexDirection: "row",
    alignItems: "center",
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0ea5e9",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});
