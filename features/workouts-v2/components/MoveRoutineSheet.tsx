import { RoutineWithMetrics } from "@/shared/db/repository/routines";
import { BaseFolder } from "@/shared/db/schema";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { queryKeys } from "@/shared/queries/query-keys";
import { useHaptic } from "@/shared/services/haptic-service";
import { workoutsTranslations } from "@/shared/translations/workouts";
import { Typography } from "@/shared/ui/typography";
import { useQueryClient } from "@tanstack/react-query";
import { BlurView } from "expo-blur";
import {
  ArrowRight,
  Check,
  Folder,
  FolderInput,
  FolderMinus,
  X,
} from "lucide-react-native";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { routinesService } from "../service/routines";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

type Props = {
  visible: boolean;
  onClose: () => void;
  routine: RoutineWithMetrics | null;
  currentFolderId?: string | null;
  folders?: BaseFolder[];
};

export const MoveRoutineSheet = ({
  visible,
  onClose,
  routine,
  currentFolderId,
  folders,
}: Props) => {
  const { colors, isDarkMode } = useColorScheme();
  const insets = useSafeAreaInsets();
  const prefs = useUserPreferences();
  const lang = prefs?.language ?? "es";
  const t = workoutsTranslations;
  const haptic = useHaptic();
  const queryClient = useQueryClient();

  // Animations
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 65,
          friction: 11,
          useNativeDriver: true,
        }),
      ]).start(() => {
        Animated.spring(contentAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }).start();
      });
    } else {
      contentAnim.setValue(0);
      Animated.parallel([
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: SCREEN_HEIGHT,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  if (!routine) return null;

  const availableFolders = folders?.filter(
    (folder) => folder.id !== currentFolderId
  );

  const handleMoveToFolder = async (folderId: string | null) => {
    haptic.light();
    await routinesService.updateRoutineFolderId(routine.id, folderId);
    queryClient.invalidateQueries({ queryKey: queryKeys.workouts.all });
    onClose();
  };

  const currentFolder = folders?.find((f) => f.id === currentFolderId);

  // Predefined folder colors for visual variety
  const folderColors = [
    "#10b981", // emerald
    "#8b5cf6", // violet
    "#f59e0b", // amber
    "#ec4899", // pink
    "#06b6d4", // cyan
    "#f97316", // orange
  ];

  const getFolderColor = (folder: BaseFolder, index: number) => {
    return folder.color || folderColors[index % folderColors.length];
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      {/* Backdrop */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: "rgba(0,0,0,0.6)",
            opacity: backdropAnim,
          },
        ]}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      {/* Sheet */}
      <Animated.View
        style={[
          styles.sheet,
          {
            transform: [{ translateY: slideAnim }],
            maxHeight: SCREEN_HEIGHT * 0.85,
          },
        ]}
      >
        <View
          style={[
            styles.sheetContent,
            {
              backgroundColor: isDarkMode
                ? "rgba(20, 20, 25, 0.95)"
                : "rgba(255, 255, 255, 0.98)",
              paddingBottom: insets.bottom + 20,
            },
          ]}
        >
          {Platform.OS === "ios" && (
            <BlurView
              intensity={isDarkMode ? 40 : 60}
              tint={isDarkMode ? "dark" : "light"}
              style={StyleSheet.absoluteFill}
            />
          )}

          {/* Handle */}
          <View style={styles.handleContainer}>
            <View
              style={[
                styles.handle,
                {
                  backgroundColor: isDarkMode
                    ? "rgba(255,255,255,0.2)"
                    : "rgba(0,0,0,0.15)",
                },
              ]}
            />
          </View>

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <FolderInput size={20} color={colors.primary[500]} />
              <Typography
                variant="h4"
                weight="bold"
                style={{ color: colors.text, marginLeft: 10 }}
              >
                {t.moveRoutine[lang]}
              </Typography>
            </View>
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [
                styles.closeButton,
                {
                  backgroundColor: isDarkMode
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.05)",
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <X size={20} color={colors.textMuted} />
            </Pressable>
          </View>

          {/* Selected Routine Card */}
          <Animated.View
            style={[
              styles.routineCard,
              {
                backgroundColor: isDarkMode
                  ? "rgba(255,255,255,0.04)"
                  : "rgba(0,0,0,0.02)",
                borderColor: isDarkMode
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(0,0,0,0.06)",
                opacity: contentAnim,
                transform: [
                  {
                    translateY: contentAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [10, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <View
              style={[
                styles.routineIcon,
                { backgroundColor: `${colors.primary[500]}15` },
              ]}
            >
              <ArrowRight size={18} color={colors.primary[500]} />
            </View>
            <View style={styles.routineInfo}>
              <Typography
                variant="body1"
                weight="semibold"
                numberOfLines={1}
                style={{ color: colors.text }}
              >
                {routine.name}
              </Typography>
              {currentFolder && (
                <View style={styles.currentFolderBadge}>
                  <Folder size={12} color={colors.textMuted} />
                  <Typography
                    variant="caption"
                    color="textMuted"
                    style={{ marginLeft: 4 }}
                  >
                    {t.currentlyIn[lang]} {currentFolder.name}
                  </Typography>
                </View>
              )}
            </View>
          </Animated.View>

          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Remove from folder option */}
            {currentFolderId && (
              <Animated.View
                style={{
                  opacity: contentAnim,
                  transform: [
                    {
                      translateY: contentAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [15, 0],
                      }),
                    },
                  ],
                }}
              >
                <Pressable
                  onPress={() => handleMoveToFolder(null)}
                  style={({ pressed }) => [
                    styles.folderOption,
                    {
                      backgroundColor: isDarkMode
                        ? "rgba(239, 68, 68, 0.08)"
                        : "rgba(239, 68, 68, 0.05)",
                      borderColor: `${colors.error[500]}20`,
                      opacity: pressed ? 0.8 : 1,
                      transform: [{ scale: pressed ? 0.98 : 1 }],
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.folderIconContainer,
                      { backgroundColor: colors.error[500] },
                    ]}
                  >
                    <FolderMinus size={20} color="#fff" />
                  </View>
                  <View style={styles.folderOptionText}>
                    <Typography
                      variant="body1"
                      weight="semibold"
                      style={{ color: colors.error[500] }}
                    >
                      {t.removeFromFolder[lang]}
                    </Typography>
                    <Typography
                      variant="caption"
                      style={{ color: colors.error[400], marginTop: 2 }}
                    >
                      {t.moveToMainRoutines[lang]}
                    </Typography>
                  </View>
                </Pressable>
              </Animated.View>
            )}

            {/* Section title */}
            {availableFolders && availableFolders.length > 0 && (
              <Typography
                variant="body2"
                weight="medium"
                color="textMuted"
                style={styles.sectionTitle}
              >
                {currentFolderId
                  ? t.moveToAnotherFolder[lang]
                  : t.moveToFolder[lang]}
              </Typography>
            )}

            {/* Available folders */}
            {availableFolders && availableFolders.length > 0 ? (
              availableFolders.map((folder, index) => {
                const folderColor = getFolderColor(folder, index);

                return (
                  <Animated.View
                    key={folder.id}
                    style={{
                      opacity: contentAnim,
                      transform: [
                        {
                          translateY: contentAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [20 + index * 5, 0],
                          }),
                        },
                      ],
                    }}
                  >
                    <Pressable
                      onPress={() => handleMoveToFolder(folder.id)}
                      style={({ pressed }) => [
                        styles.folderOption,
                        {
                          backgroundColor: isDarkMode
                            ? "rgba(255,255,255,0.04)"
                            : "rgba(0,0,0,0.02)",
                          borderColor: isDarkMode
                            ? "rgba(255,255,255,0.08)"
                            : "rgba(0,0,0,0.06)",
                          opacity: pressed ? 0.8 : 1,
                          transform: [{ scale: pressed ? 0.98 : 1 }],
                        },
                      ]}
                    >
                      <View
                        style={[
                          styles.folderIconContainer,
                          { backgroundColor: folderColor },
                        ]}
                      >
                        {folder.icon ? (
                          <Typography style={{ fontSize: 20 }}>
                            {folder.icon}
                          </Typography>
                        ) : (
                          <Folder size={20} color="#fff" />
                        )}
                      </View>
                      <View style={styles.folderOptionText}>
                        <Typography
                          variant="body1"
                          weight="semibold"
                          style={{ color: colors.text }}
                        >
                          {folder.name}
                        </Typography>
                      </View>
                      <View
                        style={[
                          styles.selectIndicator,
                          {
                            backgroundColor: isDarkMode
                              ? "rgba(255,255,255,0.05)"
                              : "rgba(0,0,0,0.03)",
                          },
                        ]}
                      >
                        <Check size={16} color={colors.textMuted} />
                      </View>
                    </Pressable>
                  </Animated.View>
                );
              })
            ) : (
              <Animated.View
                style={[
                  styles.emptyState,
                  {
                    opacity: contentAnim,
                  },
                ]}
              >
                <View
                  style={[
                    styles.emptyIcon,
                    {
                      backgroundColor: isDarkMode
                        ? "rgba(255,255,255,0.05)"
                        : "rgba(0,0,0,0.03)",
                    },
                  ]}
                >
                  <Folder size={32} color={colors.textMuted} />
                </View>
                <Typography
                  variant="body1"
                  color="textMuted"
                  align="center"
                  style={{ marginTop: 12 }}
                >
                  {currentFolderId ? t.noOtherFolders[lang] : t.noFolders[lang]}
                </Typography>
                <Typography
                  variant="caption"
                  color="textMuted"
                  align="center"
                  style={{ marginTop: 4, opacity: 0.7 }}
                >
                  {lang === "es"
                    ? "Crea carpetas para organizar tus rutinas"
                    : "Create folders to organize your routines"}
                </Typography>
              </Animated.View>
            )}
          </ScrollView>
        </View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  sheetContent: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: "hidden",
  },
  handleContainer: {
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 8,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  routineCard: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  routineIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  routineInfo: {
    flex: 1,
    marginLeft: 12,
  },
  currentFolderBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  scrollView: {
    maxHeight: SCREEN_HEIGHT * 0.45,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  sectionTitle: {
    marginTop: 8,
    marginBottom: 12,
    marginLeft: 4,
  },
  folderOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 10,
  },
  folderIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  folderOptionText: {
    flex: 1,
    marginLeft: 14,
  },
  selectIndicator: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 32,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
