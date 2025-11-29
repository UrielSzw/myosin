import { useActiveMainActions } from "@/features/active-workout-v2/hooks/use-active-workout-store";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { useAuth } from "@/shared/providers/auth-provider";
import { useSyncEngine } from "@/shared/sync/sync-engine";
import { workoutsTranslations } from "@/shared/translations/workouts";
import { Typography } from "@/shared/ui/typography";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import {
  Dumbbell,
  FolderPlus,
  PenTool,
  Sparkles,
  X,
  Zap,
} from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

type Props = {
  visible: boolean;
  onClose: () => void;
};

type ActionOption = {
  id: string;
  icon: React.ReactNode;
  label: string;
  description: string;
  color: string;
  onPress: () => void;
};

export const CreateActionSheet = ({ visible, onClose }: Props) => {
  const { colors, isDarkMode } = useColorScheme();
  const prefs = useUserPreferences();
  const lang = (prefs?.language ?? "es") as "es" | "en";
  const t = workoutsTranslations;

  const { initializeQuickWorkout } = useActiveMainActions();
  const { sync } = useSyncEngine();
  const { user } = useAuth();
  const [isLoadingQuickWorkout, setIsLoadingQuickWorkout] = useState(false);

  // Animations
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;
  const optionsAnim = useRef(
    [0, 1, 2, 3].map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    if (visible) {
      // Open animation
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
        // Stagger options animation
        Animated.stagger(
          50,
          optionsAnim.map((anim) =>
            Animated.spring(anim, {
              toValue: 1,
              tension: 100,
              friction: 8,
              useNativeDriver: true,
            })
          )
        ).start();
      });
    } else {
      // Close animation
      optionsAnim.forEach((anim) => anim.setValue(0));
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

  const handleClose = () => {
    onClose();
  };

  const handleCreateFromScratch = () => {
    handleClose();
    router.push("/routines/create");
  };

  const handleCreateFromTemplate = () => {
    handleClose();
    router.push("/routines/templates");
  };

  const handleCreateFolder = () => {
    handleClose();
    router.push("/folders/create");
  };

  const handleQuickWorkout = async () => {
    if (isLoadingQuickWorkout) return;

    setIsLoadingQuickWorkout(true);
    try {
      if (!user?.id) {
        console.error("No user ID available");
        return;
      }

      const quickWorkoutName = t.quickWorkout[lang];
      const routineData = await initializeQuickWorkout(
        user.id,
        quickWorkoutName
      );

      // Sync in background
      sync("ROUTINE_CREATE_QUICK_WORKOUT", {
        ...routineData,
        created_by_user_id: user.id,
      }).catch((err) => {
        console.warn("Failed to sync quick workout routine:", err);
      });

      handleClose();
      router.push("/workout/active");
    } catch (error) {
      console.error("Error starting quick workout:", error);
      Alert.alert(t.errorTitle[lang], t.errorStartingQuickWorkout[lang]);
    } finally {
      setIsLoadingQuickWorkout(false);
    }
  };

  const options: ActionOption[] = [
    {
      id: "quick",
      icon: <Dumbbell size={24} color="#fff" strokeWidth={2} />,
      label: t.quickWorkoutLabel[lang],
      description: t.quickWorkoutDescription[lang],
      color: "#10b981", // emerald
      onPress: handleQuickWorkout,
    },
    {
      id: "scratch",
      icon: <PenTool size={24} color="#fff" strokeWidth={2} />,
      label: t.createRoutineLabel[lang],
      description: t.createRoutineDescription[lang],
      color: colors.primary[500],
      onPress: handleCreateFromScratch,
    },
    {
      id: "template",
      icon: <Zap size={24} color="#fff" strokeWidth={2} />,
      label: t.useTemplateLabel[lang],
      description: t.useTemplateDescription[lang],
      color: "#f59e0b", // amber
      onPress: handleCreateFromTemplate,
    },
    {
      id: "folder",
      icon: <FolderPlus size={24} color="#fff" strokeWidth={2} />,
      label: t.newFolderLabel[lang],
      description: t.newFolderDescription[lang],
      color: "#8b5cf6", // violet
      onPress: handleCreateFolder,
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleClose}
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
        <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />
      </Animated.View>

      {/* Sheet */}
      <Animated.View
        style={[
          styles.sheet,
          {
            transform: [{ translateY: slideAnim }],
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
              <Sparkles size={20} color={colors.primary[500]} />
              <Typography
                variant="h4"
                weight="bold"
                style={{ color: colors.text, marginLeft: 10 }}
              >
                {t.create[lang]}
              </Typography>
            </View>
            <Pressable
              onPress={handleClose}
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

          {/* Options */}
          <View style={styles.optionsContainer}>
            {options.map((option, index) => {
              const animatedStyle = {
                opacity: optionsAnim[index],
                transform: [
                  {
                    translateY: optionsAnim[index].interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  },
                  {
                    scale: optionsAnim[index].interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.95, 1],
                    }),
                  },
                ],
              };

              return (
                <Animated.View key={option.id} style={animatedStyle}>
                  <Pressable
                    onPress={option.onPress}
                    disabled={option.id === "quick" && isLoadingQuickWorkout}
                    style={({ pressed }) => [
                      styles.optionCard,
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
                    {/* Icon */}
                    <View
                      style={[
                        styles.optionIcon,
                        { backgroundColor: option.color },
                      ]}
                    >
                      {option.icon}
                    </View>

                    {/* Text */}
                    <View style={styles.optionText}>
                      <Typography
                        variant="body1"
                        weight="semibold"
                        style={{ color: colors.text }}
                      >
                        {option.label}
                      </Typography>
                      <Typography
                        variant="caption"
                        style={{ color: colors.textMuted, marginTop: 2 }}
                      >
                        {option.description}
                      </Typography>
                    </View>

                    {/* Arrow indicator */}
                    <View
                      style={[
                        styles.arrowContainer,
                        {
                          backgroundColor: isDarkMode
                            ? "rgba(255,255,255,0.05)"
                            : "rgba(0,0,0,0.03)",
                        },
                      ]}
                    >
                      <View
                        style={[
                          styles.arrow,
                          { borderColor: colors.textMuted },
                        ]}
                      />
                    </View>
                  </Pressable>
                </Animated.View>
              );
            })}
          </View>

          {/* Bottom spacing */}
          <View style={{ height: 34 }} />
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
  optionsContainer: {
    paddingHorizontal: 16,
    gap: 10,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
  },
  optionIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  optionText: {
    flex: 1,
    marginLeft: 16,
  },
  arrowContainer: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  arrow: {
    width: 8,
    height: 8,
    borderTopWidth: 2,
    borderRightWidth: 2,
    transform: [{ rotate: "45deg" }],
    marginLeft: -2,
  },
});
