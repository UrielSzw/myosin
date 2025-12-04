import { toSupportedLanguage } from "@/shared/types/language";
import { BaseFolder } from "@/shared/db/schema";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useSelectedFolderStore } from "@/shared/hooks/use-selected-folder-store";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { workoutsTranslations as t } from "@/shared/translations/workouts";
import { Typography } from "@/shared/ui/typography";
import { BlurView } from "expo-blur";
import { ChevronLeft, FolderOpen, Plus } from "lucide-react-native";
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
  const lang = toSupportedLanguage(prefs?.language);

  const handleBack = () => {
    setSelectedFolder(null);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      {/* Glass effect background */}
      {Platform.OS === "ios" && (
        <BlurView
          intensity={isDarkMode ? 25 : 40}
          tint={isDarkMode ? "dark" : "light"}
          style={StyleSheet.absoluteFill}
        />
      )}

      <View style={styles.content}>
        {/* Left: Back button or empty space */}
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
              <ChevronLeft size={20} color={colors.text} />
            </Pressable>
          ) : (
            <View style={styles.placeholder} />
          )}
        </View>

        {/* Center: Title */}
        <View style={styles.centerSection}>
          {selectedFolder ? (
            <View style={styles.folderTitle}>
              <View
                style={[
                  styles.folderIconContainer,
                  {
                    backgroundColor: `${
                      selectedFolder.color || colors.primary[500]
                    }20`,
                  },
                ]}
              >
                <FolderOpen
                  size={16}
                  color={selectedFolder.color || colors.primary[500]}
                />
              </View>
              <Typography
                variant="body1"
                weight="semibold"
                numberOfLines={1}
                style={{ color: colors.text, maxWidth: 180 }}
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
              {t.routines[lang]}
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
            <Plus size={18} color="#fff" strokeWidth={2.5} />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    height: 56,
  },
  leftSection: {
    width: 40,
    alignItems: "flex-start",
  },
  centerSection: {
    flex: 1,
    alignItems: "center",
  },
  rightSection: {
    width: 40,
    alignItems: "flex-end",
  },
  placeholder: {
    width: 36,
    height: 36,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  folderTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  folderIconContainer: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0ea5e9",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});
