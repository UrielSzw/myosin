import { RoutineWithMetrics } from "@/shared/db/repository/routines";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { workoutsTranslations } from "@/shared/translations/workouts";
import { Typography } from "@/shared/ui/typography";
import { BlurView } from "expo-blur";
import {
  Calendar,
  Eraser,
  FolderInput,
  MoreHorizontal,
  Pen,
  Play,
  Trash2,
  X,
} from "lucide-react-native";
import React, { useEffect, useRef } from "react";
import {
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
  routine: RoutineWithMetrics | null;
  onClose: () => void;
  onStartWorkout: () => void;
  onEdit: () => void;
  onMoveToFolder: () => void;
  onClearTrainingDays: () => void;
  onDelete: () => void;
};

type ActionOption = {
  id: string;
  icon: React.ReactNode;
  label: string;
  color: string;
  textColor?: string;
  onPress: () => void;
  show?: boolean;
};

export const RoutineOptionsSheet = ({
  visible,
  routine,
  onClose,
  onStartWorkout,
  onEdit,
  onMoveToFolder,
  onClearTrainingDays,
  onDelete,
}: Props) => {
  const { colors, isDarkMode } = useColorScheme();
  const prefs = useUserPreferences();
  const lang = prefs?.language ?? "es";
  const t = workoutsTranslations;

  // Animations
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;
  const optionsAnim = useRef(
    [0, 1, 2, 3, 4].map(() => new Animated.Value(0))
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
          40,
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

  const hasTrainingDays = !!(
    routine?.training_days && routine.training_days.length > 0
  );

  const options: ActionOption[] = [
    {
      id: "start",
      icon: <Play size={22} color="#fff" fill="#fff" strokeWidth={2} />,
      label: lang === "es" ? "Iniciar Entrenamiento" : "Start Workout",
      color: "#10b981", // emerald
      onPress: () => {
        onClose();
        onStartWorkout();
      },
      show: true,
    },
    {
      id: "edit",
      icon: <Pen size={22} color="#fff" strokeWidth={2} />,
      label: t.editRoutine[lang],
      color: colors.primary[500],
      onPress: () => {
        onClose();
        onEdit();
      },
      show: true,
    },
    {
      id: "move",
      icon: <FolderInput size={22} color="#fff" strokeWidth={2} />,
      label: lang === "es" ? "Mover a Carpeta" : "Move to Folder",
      color: "#8b5cf6", // violet
      onPress: () => {
        onClose();
        onMoveToFolder();
      },
      show: true,
    },
    {
      id: "clear_days",
      icon: <Eraser size={22} color="#fff" strokeWidth={2} />,
      label: t.removeTrainingDays[lang],
      color: "#f59e0b", // amber
      onPress: () => {
        onClose();
        onClearTrainingDays();
      },
      show: hasTrainingDays,
    },
    {
      id: "delete",
      icon: <Trash2 size={22} color="#fff" strokeWidth={2} />,
      label: t.deleteRoutine[lang],
      color: colors.error[500],
      onPress: () => {
        onClose();
        onDelete();
      },
      show: true,
    },
  ].filter((opt) => opt.show);

  if (!routine) return null;

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

          {/* Header with routine info */}
          <View style={styles.header}>
            <View style={styles.headerInfo}>
              <View
                style={[
                  styles.routineIcon,
                  { backgroundColor: `${colors.primary[500]}20` },
                ]}
              >
                <MoreHorizontal size={20} color={colors.primary[500]} />
              </View>
              <View style={styles.headerText}>
                <Typography
                  variant="h4"
                  weight="bold"
                  numberOfLines={1}
                  style={{ color: colors.text }}
                >
                  {routine.name}
                </Typography>
                <View style={styles.routineMeta}>
                  <Typography variant="caption" color="textMuted">
                    {routine.blocksCount}{" "}
                    {routine.blocksCount === 1
                      ? lang === "es"
                        ? "bloque"
                        : "block"
                      : lang === "es"
                      ? "bloques"
                      : "blocks"}
                    {" · "}
                    {routine.exercisesCount}{" "}
                    {routine.exercisesCount === 1
                      ? lang === "es"
                        ? "ejercicio"
                        : "exercise"
                      : lang === "es"
                      ? "ejercicios"
                      : "exercises"}
                  </Typography>
                  {hasTrainingDays && (
                    <View style={styles.scheduledBadge}>
                      <Calendar
                        size={10}
                        color={colors.primary[500]}
                        style={{ marginRight: 4 }}
                      />
                      <Typography
                        variant="caption"
                        weight="medium"
                        style={{ color: colors.primary[500], fontSize: 11 }}
                      >
                        {lang === "es" ? "Programada" : "Scheduled"}
                      </Typography>
                    </View>
                  )}
                </View>
              </View>
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

          {/* Options */}
          <View style={styles.optionsContainer}>
            {options.map((option, index) => {
              const animatedStyle = {
                opacity: optionsAnim[index] || new Animated.Value(1),
                transform: [
                  {
                    translateY: (
                      optionsAnim[index] || new Animated.Value(1)
                    ).interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  },
                  {
                    scale: (
                      optionsAnim[index] || new Animated.Value(1)
                    ).interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.95, 1],
                    }),
                  },
                ],
              };

              const isDestructive = option.id === "delete";

              return (
                <Animated.View key={option.id} style={animatedStyle}>
                  <Pressable
                    onPress={option.onPress}
                    style={({ pressed }) => [
                      styles.optionCard,
                      {
                        backgroundColor: isDestructive
                          ? isDarkMode
                            ? "rgba(239, 68, 68, 0.08)"
                            : "rgba(239, 68, 68, 0.05)"
                          : isDarkMode
                          ? "rgba(255,255,255,0.04)"
                          : "rgba(0,0,0,0.02)",
                        borderColor: isDestructive
                          ? `${colors.error[500]}20`
                          : isDarkMode
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
                        style={{
                          color: isDestructive
                            ? colors.error[500]
                            : colors.text,
                        }}
                      >
                        {option.label}
                      </Typography>
                    </View>

                    {/* Arrow indicator */}
                    <View
                      style={[
                        styles.arrowContainer,
                        {
                          backgroundColor: isDestructive
                            ? `${colors.error[500]}10`
                            : isDarkMode
                            ? "rgba(255,255,255,0.05)"
                            : "rgba(0,0,0,0.03)",
                        },
                      ]}
                    >
                      <View
                        style={[
                          styles.arrow,
                          {
                            borderColor: isDestructive
                              ? colors.error[500]
                              : colors.textMuted,
                          },
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
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 20,
  },
  headerInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 12,
  },
  routineIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    flex: 1,
    marginLeft: 14,
  },
  routineMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 8,
  },
  scheduledBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: "rgba(14, 165, 233, 0.1)",
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
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  optionIcon: {
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
  optionText: {
    flex: 1,
    marginLeft: 14,
  },
  arrowContainer: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  arrow: {
    width: 7,
    height: 7,
    borderTopWidth: 2,
    borderRightWidth: 2,
    transform: [{ rotate: "45deg" }],
    marginLeft: -2,
  },
});
