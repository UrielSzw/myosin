import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { toSupportedLanguage } from "@/shared/types/language";
import { Typography } from "@/shared/ui/typography";
import { BlurView } from "expo-blur";
import {
  AlertTriangle,
  ChevronRight,
  Layers,
  Play,
  PlusCircle,
  RotateCcw,
  Shuffle,
  Split,
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

type ActionOption = {
  id: string;
  icon: React.ReactNode;
  label: string;
  description?: string;
  color: string;
  onPress: () => void;
  show?: boolean;
  disabled?: boolean;
  warning?: string;
};

type Props = {
  visible: boolean;
  isMultiBlock: boolean;
  isCircuit?: boolean;
  canUseTimerMode?: boolean;
  hasBalancedSets?: boolean;
  exerciseName?: string | null;
  onClose: () => void;
  onDelete: () => void;
  onConvertToIndividual: () => void;
  onAddExercise: () => void;
  onReplace: () => void;
  onReorderExercises?: () => void;
  onReorderBlocks?: () => void;
  onStartTimerMode?: () => void;
};

export const BlockOptionsSheetV2 = ({
  visible,
  isMultiBlock,
  isCircuit,
  canUseTimerMode,
  hasBalancedSets = true,
  exerciseName,
  onClose,
  onDelete,
  onConvertToIndividual,
  onAddExercise,
  onReplace,
  onReorderExercises,
  onReorderBlocks,
  onStartTimerMode,
}: Props) => {
  const { colors, isDarkMode } = useColorScheme();
  const prefs = useUserPreferences();
  const lang = toSupportedLanguage(prefs?.language);

  // Animations
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;
  const optionsAnim = useRef(
    [0, 1, 2, 3, 4, 5].map(() => new Animated.Value(0))
  ).current;

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
  }, [visible, backdropAnim, slideAnim, optionsAnim]);

  const t = {
    blockOptions: { es: "Opciones del Bloque", en: "Block Options" },
    exerciseOptions: { es: "Opciones del Ejercicio", en: "Exercise Options" },
    addExercise: { es: "Agregar Ejercicio", en: "Add Exercise" },
    addExerciseDesc: {
      es: "Añadir otro ejercicio al superset",
      en: "Add another exercise to superset",
    },
    addExerciseSuperset: { es: "Crear Superserie", en: "Create Superset" },
    addExerciseSupersetDesc: {
      es: "Combinar con otro ejercicio",
      en: "Combine with another exercise",
    },
    replaceExercise: { es: "Reemplazar Ejercicio", en: "Replace Exercise" },
    replaceExerciseDesc: {
      es: "Cambiar por otro ejercicio",
      en: "Change to another exercise",
    },
    separateExercises: { es: "Separar Ejercicios", en: "Separate Exercises" },
    separateExercisesDesc: {
      es: "Convertir a bloques individuales",
      en: "Convert to individual blocks",
    },
    reorderExercises: { es: "Reordenar Ejercicios", en: "Reorder Exercises" },
    reorderExercisesDesc: {
      es: "Cambiar orden dentro del bloque",
      en: "Change order within block",
    },
    reorderBlocks: { es: "Reordenar Bloques", en: "Reorder Blocks" },
    reorderBlocksDesc: {
      es: "Cambiar orden de la rutina",
      en: "Change routine order",
    },
    deleteBlock: { es: "Eliminar Bloque", en: "Delete Block" },
    deleteExercise: { es: "Eliminar Ejercicio", en: "Delete Exercise" },
    deleteDesc: {
      es: "Esta acción no se puede deshacer",
      en: "This action cannot be undone",
    },
    startTimerMode: { es: "Iniciar Timer", en: "Start Timer" },
    startTimerModeDesc: {
      es: "Timer automático para el circuito",
      en: "Automatic timer for the circuit",
    },
    unbalancedSetsWarning: {
      es: "Igualar sets por ejercicio",
      en: "Balance sets per exercise",
    },
  };

  // Check if timer mode should be shown (circuit with time exercises)
  const showTimerModeOption =
    isCircuit && canUseTimerMode && !!onStartTimerMode;
  // Timer is disabled if sets are unbalanced
  const timerModeDisabled = !hasBalancedSets;

  const options: ActionOption[] = [
    {
      id: "timerMode",
      icon: <Play size={22} color="#fff" strokeWidth={2} fill="#fff" />,
      label: t.startTimerMode[lang],
      description: timerModeDisabled
        ? t.unbalancedSetsWarning[lang]
        : t.startTimerModeDesc[lang],
      color: timerModeDisabled ? colors.textMuted : "#4A90E2", // Circuit blue or muted
      onPress: () => {
        if (timerModeDisabled) return;
        onClose();
        onStartTimerMode?.();
      },
      show: showTimerModeOption,
      disabled: timerModeDisabled,
      warning: timerModeDisabled ? t.unbalancedSetsWarning[lang] : undefined,
    },
    {
      id: "add",
      icon: <PlusCircle size={22} color="#fff" strokeWidth={2} />,
      label: isMultiBlock ? t.addExercise[lang] : t.addExerciseSuperset[lang],
      description: isMultiBlock
        ? t.addExerciseDesc[lang]
        : t.addExerciseSupersetDesc[lang],
      color: "#10b981",
      onPress: () => {
        onClose();
        onAddExercise();
      },
      show: true,
    },
    {
      id: "replace",
      icon: <RotateCcw size={22} color="#fff" strokeWidth={2} />,
      label: t.replaceExercise[lang],
      description: t.replaceExerciseDesc[lang],
      color: colors.primary[500],
      onPress: () => {
        onClose();
        onReplace();
      },
      show: !isMultiBlock,
    },
    {
      id: "separate",
      icon: <Split size={22} color="#fff" strokeWidth={2} />,
      label: t.separateExercises[lang],
      description: t.separateExercisesDesc[lang],
      color: "#8b5cf6",
      onPress: () => {
        onClose();
        onConvertToIndividual();
      },
      show: isMultiBlock,
    },
    {
      id: "reorder-exercises",
      icon: <Shuffle size={22} color="#fff" strokeWidth={2} />,
      label: t.reorderExercises[lang],
      description: t.reorderExercisesDesc[lang],
      color: "#f59e0b",
      onPress: () => {
        onClose();
        onReorderExercises?.();
      },
      show: isMultiBlock && !!onReorderExercises,
    },
    {
      id: "reorder-blocks",
      icon: <Shuffle size={22} color="#fff" strokeWidth={2} />,
      label: t.reorderBlocks[lang],
      description: t.reorderBlocksDesc[lang],
      color: "#06b6d4",
      onPress: () => {
        onClose();
        onReorderBlocks?.();
      },
      show: !!onReorderBlocks,
    },
    {
      id: "delete",
      icon: <Trash2 size={22} color="#fff" strokeWidth={2} />,
      label: isMultiBlock ? t.deleteBlock[lang] : t.deleteExercise[lang],
      description: t.deleteDesc[lang],
      color: colors.error[500],
      onPress: () => {
        onClose();
        onDelete();
      },
      show: true,
    },
  ].filter((opt) => opt.show);

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

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerInfo}>
              <View
                style={[
                  styles.headerIcon,
                  { backgroundColor: `${colors.primary[500]}20` },
                ]}
              >
                <Layers size={22} color={colors.primary[500]} />
              </View>
              <View style={styles.headerText}>
                <Typography
                  variant="h4"
                  weight="bold"
                  numberOfLines={1}
                  style={{ color: colors.text }}
                >
                  {isMultiBlock
                    ? t.blockOptions[lang]
                    : t.exerciseOptions[lang]}
                </Typography>
                {!isMultiBlock && exerciseName && (
                  <Typography
                    variant="caption"
                    color="textMuted"
                    numberOfLines={1}
                    style={{ marginTop: 4 }}
                  >
                    {exerciseName}
                  </Typography>
                )}
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
              const isDisabled = option.disabled;

              return (
                <Animated.View key={option.id} style={animatedStyle}>
                  <Pressable
                    onPress={isDisabled ? undefined : option.onPress}
                    disabled={isDisabled}
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
                        borderColor: isDisabled
                          ? `${colors.warning[500]}30`
                          : isDestructive
                          ? `${colors.error[500]}20`
                          : isDarkMode
                          ? "rgba(255,255,255,0.08)"
                          : "rgba(0,0,0,0.06)",
                        opacity: isDisabled ? 0.6 : pressed ? 0.8 : 1,
                        transform: [
                          { scale: pressed && !isDisabled ? 0.98 : 1 },
                        ],
                      },
                    ]}
                  >
                    {/* Icon */}
                    <View
                      style={[
                        styles.optionIcon,
                        {
                          backgroundColor: isDisabled
                            ? colors.textMuted
                            : option.color,
                        },
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
                          color: isDisabled
                            ? colors.textMuted
                            : isDestructive
                            ? colors.error[500]
                            : colors.text,
                        }}
                      >
                        {option.label}
                      </Typography>
                      {option.description && (
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginTop: 2,
                          }}
                        >
                          {isDisabled && (
                            <AlertTriangle
                              size={12}
                              color={colors.warning[500]}
                              style={{ marginRight: 4 }}
                            />
                          )}
                          <Typography
                            variant="caption"
                            style={{
                              color: isDisabled
                                ? colors.warning[500]
                                : isDestructive
                                ? `${colors.error[500]}80`
                                : colors.textMuted,
                            }}
                          >
                            {option.description}
                          </Typography>
                        </View>
                      )}
                    </View>

                    {/* Arrow or Warning */}
                    <View
                      style={[
                        styles.arrowContainer,
                        {
                          backgroundColor: isDisabled
                            ? `${colors.warning[500]}15`
                            : isDestructive
                            ? `${colors.error[500]}10`
                            : isDarkMode
                            ? "rgba(255,255,255,0.05)"
                            : "rgba(0,0,0,0.03)",
                        },
                      ]}
                    >
                      {isDisabled ? (
                        <AlertTriangle size={16} color={colors.warning[500]} />
                      ) : (
                        <ChevronRight
                          size={16}
                          color={
                            isDestructive ? colors.error[500] : colors.textMuted
                          }
                        />
                      )}
                    </View>
                  </Pressable>
                </Animated.View>
              );
            })}
          </View>

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
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    flex: 1,
    marginLeft: 14,
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
});
