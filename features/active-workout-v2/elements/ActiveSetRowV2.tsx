import {
  ActiveWorkoutExercise,
  useActiveMainActions,
  useActiveSetActions,
  useActiveWorkout,
} from "@/features/active-workout-v2/hooks/use-active-workout-store";
import { useNextSetIndicator } from "@/features/active-workout-v2/hooks/use-next-set-indicator";
import { usePRLogic } from "@/features/active-workout-v2/hooks/use-pr-logic";
import { useBlockStyles } from "@/shared/hooks/use-block-styles";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { useHaptic } from "@/shared/services/haptic-service";
import { getMeasurementTemplate } from "@/shared/types/measurement";
import { IBlockType, RPEValue } from "@/shared/types/workout";
import { MeasurementInput } from "@/shared/ui/measurement-input";
import { Typography } from "@/shared/ui/typography";
import { fromKm, fromMeters } from "@/shared/utils/distance-conversion";
import { fromKg } from "@/shared/utils/weight-conversion";
import { Check, ChevronRight, Timer, Trophy } from "lucide-react-native";
import React, { useCallback } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  FadeInRight,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from "react-native-reanimated";

type Props = {
  setId: string;
  blockType: IBlockType;
  blockId: string;
  exerciseInBlock: ActiveWorkoutExercise;
  onOpenSetType: () => void;
  onOpenRPESelector: () => void;
  onOpenTempoMetronome: () => void;
  index: number;
};

export const ActiveSetRowV2 = React.memo<Props>(
  ({
    exerciseInBlock,
    onOpenSetType,
    onOpenRPESelector,
    onOpenTempoMetronome,
    blockType,
    setId,
    blockId,
    index,
  }) => {
    const { colors, isDarkMode } = useColorScheme();
    const {
      getSetTypeColor,
      getSetTypeLabel,
      getBlockColors,
      formatMeasurementValue,
    } = useBlockStyles();
    const { completeSet, uncompleteSet, updateSetValue } =
      useActiveSetActions();
    const { setCurrentState } = useActiveMainActions();
    const { sets, exercisePreviousSets, session } = useActiveWorkout();

    const prefs = useUserPreferences();
    const weightUnit = prefs?.weight_unit ?? "kg";
    const distanceUnit = prefs?.distance_unit ?? "metric";
    const haptic = useHaptic();

    const nextSetIndicator = useNextSetIndicator(blockId);
    const { validatePR } = usePRLogic(exerciseInBlock.exercise_id, setId);

    const blockColors = getBlockColors(blockType);
    const set = sets[setId];

    // PR solo se muestra DESPUÉS de completar el set
    const isCurrentPR = set?.was_pr || false;

    const exercisePrevSets =
      exercisePreviousSets[exerciseInBlock.exercise_id] || [];
    const prevSet = exercisePrevSets.find(
      (prevData) => prevData.order_index === set.order_index
    );

    // Animation values - following SetRowV2 style
    const typeScale = useSharedValue(1);
    const checkScale = useSharedValue(1);

    const typeAnimatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: typeScale.value }],
    }));

    const checkAnimatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: checkScale.value }],
    }));

    const handleSetTypePress = useCallback(() => {
      typeScale.value = withSpring(0.9, { damping: 15 }, () => {
        typeScale.value = withSpring(1);
      });
      setCurrentState({
        currentSetId: set.tempId,
        currentExerciseInBlockId: exerciseInBlock.tempId,
        currentSetType: set.set_type,
      });
      onOpenSetType();
    }, [
      exerciseInBlock.tempId,
      onOpenSetType,
      set.tempId,
      set.set_type,
      setCurrentState,
      typeScale,
    ]);

    const handleShowRPESelector = useCallback(() => {
      setCurrentState({
        currentSetId: set.tempId,
        currentRpeValue: (set.actual_rpe as RPEValue) || null,
      });
      onOpenRPESelector();
    }, [onOpenRPESelector, set.tempId, set.actual_rpe, setCurrentState]);

    const handleCompleteSet = useCallback(() => {
      checkScale.value = withSequence(
        withSpring(0.8, { damping: 15 }),
        withSpring(1.1, { damping: 10 }),
        withSpring(1, { damping: 15 })
      );

      // Priority: store value → planned range → planned value → prev set → 0
      const getEffectiveValue = (
        storeValue: number | null,
        plannedRange: { min: number; max: number } | null,
        plannedValue: number | null,
        prevValue: number | null | undefined,
        fallback: number = 0
      ): number => {
        if (storeValue !== null) return storeValue;
        if (plannedRange) return plannedRange.min;
        if (plannedValue) return plannedValue;
        if (prevValue) return prevValue;
        return fallback;
      };

      const effectivePrimary = getEffectiveValue(
        set.actual_primary_value,
        set.planned_primary_range,
        set.planned_primary_value,
        prevSet?.actual_primary_value,
        0
      );

      const effectiveSecondary = getEffectiveValue(
        set.actual_secondary_value,
        set.planned_secondary_range,
        set.planned_secondary_value,
        prevSet?.actual_secondary_value,
        0
      );

      // PR validation for weight_reps templates
      const supportsPRTemplate =
        set.measurement_template === "weight_reps" ||
        set.measurement_template === "weight_reps_range";
      const prValidation = supportsPRTemplate
        ? validatePR(effectivePrimary, effectiveSecondary)
        : { isPR: false, estimatedOneRM: 0 };

      completeSet(exerciseInBlock.tempId, setId, blockId, {
        primaryValue: effectivePrimary,
        secondaryValue: effectiveSecondary,
        actualRpe: set.actual_rpe || set.planned_rpe || 0,
        estimated1RM: prValidation.estimatedOneRM,
        isPR: prValidation.isPR,
      });

      if (prValidation.isPR) {
        haptic.success();
      } else {
        haptic.medium();
      }
    }, [
      checkScale,
      set,
      prevSet,
      validatePR,
      completeSet,
      exerciseInBlock.tempId,
      setId,
      blockId,
      haptic,
    ]);

    const handleUncomplete = useCallback(() => {
      uncompleteSet(setId);
      haptic.selection();
    }, [uncompleteSet, setId, haptic]);

    // Handler para abrir el metronomo de tempo (debe estar antes del early return)
    const handleTempoPress = useCallback(() => {
      if (!set) return;
      setCurrentState({
        currentTempo: set.planned_tempo || null,
      });
      onOpenTempoMetronome();
    }, [set, setCurrentState, onOpenTempoMetronome]);

    if (!set) return null;

    const setNumber = set.order_index + 1;
    const setTypeLabel = getSetTypeLabel(set.set_type);
    const isSpecialSet = set.set_type !== "normal";
    const setTypeColor = getSetTypeColor(set.set_type);
    const isCompleted = !!set.completed_at;

    const template = getMeasurementTemplate(
      set.measurement_template,
      weightUnit,
      distanceUnit
    );
    const hasSecondaryField = template?.fields && template.fields.length > 1;

    // Helper para obtener placeholders basado en el template
    const getPlaceholderValue = (fieldType: "primary" | "secondary") => {
      const isSecondary = fieldType === "secondary";
      const plannedValue = isSecondary
        ? set.planned_secondary_value
        : set.planned_primary_value;
      const plannedRange = isSecondary
        ? set.planned_secondary_range
        : set.planned_primary_range;
      const prevValue = isSecondary
        ? prevSet?.actual_secondary_value
        : prevSet?.actual_primary_value;

      // Check field type
      const fieldIndex = isSecondary ? 1 : 0;
      const field = template?.fields[fieldIndex];
      const isWeightField = field?.type === "weight";
      const isDistanceField = field?.type === "distance";

      // Helper to format value based on field type
      const formatFieldValue = (value: number): string => {
        if (isWeightField) {
          return fromKg(value, weightUnit, 1).toString();
        }
        if (isDistanceField) {
          if (field?.unit === "km" || field?.unit === "mi") {
            return fromKm(value, distanceUnit, 2).toString();
          } else {
            return fromMeters(value, distanceUnit, 0).toString();
          }
        }
        return value.toString();
      };

      // PRIORIDAD 1: Si hay un range planificado, mostrarlo como string (ej: "8-12")
      if (plannedRange) {
        if (isWeightField) {
          const minFormatted = fromKg(plannedRange.min || 0, weightUnit, 1);
          const maxFormatted = fromKg(plannedRange.max || 0, weightUnit, 1);
          return `${minFormatted}-${maxFormatted}`;
        }
        if (isDistanceField) {
          if (field?.unit === "km" || field?.unit === "mi") {
            const minFormatted = fromKm(plannedRange.min || 0, distanceUnit, 2);
            const maxFormatted = fromKm(plannedRange.max || 0, distanceUnit, 2);
            return `${minFormatted}-${maxFormatted}`;
          } else {
            const minFormatted = fromMeters(
              plannedRange.min || 0,
              distanceUnit,
              0
            );
            const maxFormatted = fromMeters(
              plannedRange.max || 0,
              distanceUnit,
              0
            );
            return `${minFormatted}-${maxFormatted}`;
          }
        }
        return `${plannedRange.min || 0}-${plannedRange.max || 0}`;
      }

      // PRIORIDAD 2: Valor planificado de la rutina
      if (plannedValue) {
        return formatFieldValue(plannedValue);
      }

      // PRIORIDAD 3: Si NO hay valores planificados pero hay prev value, usarlo como placeholder
      if (prevValue) {
        return formatFieldValue(prevValue);
      }

      // Fallback
      return "0";
    };

    const formatPrevSet = () => {
      if (!prevSet) return "-";
      const primary = formatMeasurementValue(
        prevSet.actual_primary_value,
        null,
        prevSet.measurement_template,
        "primary"
      );
      if (hasSecondaryField && prevSet.actual_secondary_value !== null) {
        const secondary = formatMeasurementValue(
          prevSet.actual_secondary_value,
          null,
          prevSet.measurement_template,
          "secondary"
        );
        return `${primary}×${secondary}`;
      }
      return primary;
    };

    const isNextSet = nextSetIndicator?.isNextSet(
      exerciseInBlock.tempId,
      set.order_index
    );

    // Helper para calcular el tiempo total del tempo
    const getTempoTotal = (tempo: string | undefined) => {
      const segments = tempo?.split("-").map((s) => parseInt(s, 10)) || [];
      if (segments.length === 0) return 0;
      return segments.reduce((total, num) => total + num, 0);
    };

    return (
      <>
        <Animated.View
          entering={FadeInRight.delay(index * 50).duration(300)}
          style={[
            styles.container,
            {
              backgroundColor:
                isCompleted && isCurrentPR
                  ? isDarkMode
                    ? "rgba(251, 191, 36, 0.12)"
                    : "rgba(251, 191, 36, 0.08)"
                  : isCompleted
                  ? isDarkMode
                    ? `${blockColors.primary}15`
                    : `${blockColors.primary}0A`
                  : isDarkMode
                  ? "rgba(255,255,255,0.02)"
                  : "rgba(0,0,0,0.01)",
            },
          ]}
        >
          {/* Next Set Indicator */}
          {isNextSet && (
            <View
              style={[
                styles.nextSetIndicator,
                { backgroundColor: blockColors.primary },
              ]}
            >
              <ChevronRight size={10} color="#fff" strokeWidth={3} />
            </View>
          )}

          {/* Set Type Badge */}
          <View style={styles.setColumn}>
            <Animated.View style={typeAnimatedStyle}>
              <Pressable
                onPress={handleSetTypePress}
                style={({ pressed }) => [
                  styles.setTypeBadge,
                  {
                    backgroundColor: isSpecialSet
                      ? setTypeColor
                      : isDarkMode
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(0,0,0,0.06)",
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <Typography
                  variant="caption"
                  weight="bold"
                  style={{
                    color: isSpecialSet ? "#FFFFFF" : colors.text,
                    fontSize: 10,
                  }}
                >
                  {setTypeLabel || setNumber.toString()}
                </Typography>
              </Pressable>
            </Animated.View>
          </View>

          {/* Previous Set Column */}
          <View style={styles.prevColumn}>
            <Typography
              variant="caption"
              color="textMuted"
              style={{ fontSize: 11 }}
            >
              {formatPrevSet()}
            </Typography>
          </View>

          {/* Primary Input */}
          <View style={styles.inputColumn}>
            <MeasurementInput
              field={
                template?.fields[0] || {
                  id: "primary",
                  label: "",
                  type: "reps",
                  unit: "",
                }
              }
              value={set.actual_primary_value}
              onChange={(value) => {
                updateSetValue(setId, "primary", value, exerciseInBlock.tempId);
              }}
              placeholder={getPlaceholderValue("primary")}
              setNumber={setNumber}
              activeWorkout={true}
              weightUnit={weightUnit}
              distanceUnit={distanceUnit}
              disabled={isCompleted}
            />
          </View>

          {/* Secondary Input */}
          {hasSecondaryField && (
            <View style={styles.inputColumn}>
              <MeasurementInput
                field={
                  template?.fields[1] || {
                    id: "secondary",
                    label: "",
                    type: "reps",
                    unit: "",
                  }
                }
                value={set.actual_secondary_value}
                onChange={(value) => {
                  updateSetValue(
                    setId,
                    "secondary",
                    value,
                    exerciseInBlock.tempId
                  );
                }}
                placeholder={getPlaceholderValue("secondary")}
                setNumber={setNumber}
                activeWorkout={true}
                weightUnit={weightUnit}
                distanceUnit={distanceUnit}
                disabled={isCompleted}
              />
            </View>
          )}

          {/* RPE Column */}
          {session?.routine?.show_rpe && (
            <View style={styles.rpeColumn}>
              <Pressable
                onPress={handleShowRPESelector}
                disabled={isCompleted}
                style={({ pressed }) => [
                  styles.rpeButton,
                  {
                    backgroundColor: set.actual_rpe
                      ? isDarkMode
                        ? "rgba(139, 92, 246, 0.2)"
                        : "rgba(139, 92, 246, 0.1)"
                      : isDarkMode
                      ? "rgba(255,255,255,0.06)"
                      : "rgba(0,0,0,0.04)",
                    borderColor: set.actual_rpe
                      ? colors.primary[500]
                      : isDarkMode
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(0,0,0,0.08)",
                    opacity: pressed || isCompleted ? 0.7 : 1,
                  },
                ]}
              >
                <Typography
                  variant="caption"
                  weight={set.actual_rpe ? "bold" : "medium"}
                  style={{
                    color: set.actual_rpe
                      ? colors.primary[500]
                      : colors.textMuted,
                    fontSize: 12,
                  }}
                >
                  {set.actual_rpe ? set.actual_rpe.toString() : "-"}
                </Typography>
              </Pressable>
            </View>
          )}

          {/* Check/Complete Column */}
          <View style={styles.checkColumn}>
            <Animated.View style={checkAnimatedStyle}>
              <Pressable
                onPress={isCompleted ? handleUncomplete : handleCompleteSet}
                style={({ pressed }) => [
                  styles.checkButton,
                  {
                    backgroundColor: isCompleted
                      ? isCurrentPR
                        ? "#FBBF24"
                        : blockColors.primary
                      : isDarkMode
                      ? "rgba(255,255,255,0.08)"
                      : "rgba(0,0,0,0.05)",
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                {isCompleted && isCurrentPR ? (
                  <Trophy size={16} color="#FFFFFF" />
                ) : (
                  <Check
                    size={16}
                    color={isCompleted ? "#FFFFFF" : colors.textMuted}
                    strokeWidth={2.5}
                  />
                )}
              </Pressable>
            </Animated.View>
          </View>
        </Animated.View>

        {/* Tempo Badge (cuando hay tempo configurado) */}
        {set.planned_tempo && (
          <Pressable
            onPress={handleTempoPress}
            style={({ pressed }) => [
              styles.tempoBadge,
              {
                backgroundColor: isDarkMode
                  ? "rgba(139, 92, 246, 0.1)"
                  : "rgba(139, 92, 246, 0.08)",
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <Timer size={14} color={colors.primary[500]} />
            <Typography
              variant="caption"
              weight="medium"
              style={{
                color: colors.text,
                fontSize: 12,
                fontFamily: "monospace",
                letterSpacing: 0.5,
              }}
            >
              {set.planned_tempo}
            </Typography>
            <Typography
              variant="caption"
              style={{
                color: colors.textMuted,
                fontSize: 11,
              }}
            >
              ({getTempoTotal(set.planned_tempo)}s)
            </Typography>
          </Pressable>
        )}
      </>
    );
  }
);

ActiveSetRowV2.displayName = "ActiveSetRowV2";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 2,
    borderRadius: 8,
    position: "relative",
  },
  nextSetIndicator: {
    position: "absolute",
    left: -6,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  setColumn: {
    width: 38,
    alignItems: "center",
  },
  setTypeBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  prevColumn: {
    width: 55,
    alignItems: "center",
  },
  inputColumn: {
    flex: 1,
    paddingHorizontal: 4,
  },
  rpeColumn: {
    width: 44,
    alignItems: "center",
  },
  rpeButton: {
    minWidth: 34,
    minHeight: 30,
    borderRadius: 7,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  checkColumn: {
    width: 40,
    alignItems: "center",
  },
  checkButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  tempoBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginLeft: 40,
    marginTop: 2,
    marginBottom: 4,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
});
