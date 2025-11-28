import {
  ActiveWorkoutExercise,
  useActiveMainActions,
  useActiveSetActions,
  useActiveWorkout,
} from "@/features/active-workout/hooks/use-active-workout-store";
import { useNextSetIndicator } from "@/features/active-workout/hooks/use-next-set-indicator";
import { usePRLogic } from "@/features/active-workout/hooks/use-pr-logic";
import { useBlockStyles } from "@/shared/hooks/use-block-styles";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { useHaptic } from "@/shared/services/haptic-service";
import { activeWorkoutTranslations } from "@/shared/translations/active-workout";
import { getMeasurementTemplate } from "@/shared/types/measurement";
import { IBlockType, RPEValue } from "@/shared/types/workout";
import { MeasurementInput } from "@/shared/ui/measurement-input";
import { Typography } from "@/shared/ui/typography";
import { fromKm, fromMeters } from "@/shared/utils/distance-conversion";
import { fromKg } from "@/shared/utils/weight-conversion";
import { Check, Timer, Trophy } from "lucide-react-native";
import React, { useCallback, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import Animated from "react-native-reanimated";
import { IActiveToggleSheet } from "../../../hooks/use-active-workout-sheets";
import { usePRCelebration } from "../../../hooks/use-pr-celebration";
import { NextSetArrow } from "../../next-set-indicator";

type Props = {
  setId: string;
  blockType: IBlockType;
  blockId: string;
  exerciseInBlock: ActiveWorkoutExercise;
  onToggleSheet: (sheet?: IActiveToggleSheet) => void;
};

export const ActiveSetRow: React.FC<Props> = ({
  exerciseInBlock,
  onToggleSheet,
  blockType,
  setId,
  blockId,
}) => {
  const { colors } = useColorScheme();
  const {
    getSetTypeColor,
    getSetTypeLabel,
    getBlockColors,
    formatMeasurementValue,
  } = useBlockStyles();
  const { completeSet, uncompleteSet, autoFillFollowingSets } =
    useActiveSetActions();
  const { setCurrentState } = useActiveMainActions();
  const { sets, exercisePreviousSets, session } = useActiveWorkout();

  // Get user's unit preferences
  const prefs = useUserPreferences();
  const lang = prefs?.language ?? "es";
  const t = activeWorkoutTranslations;
  const weightUnit = prefs?.weight_unit ?? "kg";
  const distanceUnit = prefs?.distance_unit ?? "metric";
  const haptic = useHaptic();

  // Hook para indicador de próximo set (solo para superseries y circuitos)
  const nextSetIndicator = useNextSetIndicator(blockId);

  // Centralized PR logic hook
  const { validatePR } = usePRLogic(exerciseInBlock.exercise_id, setId);

  // PR Celebration hook
  const {
    triggerCelebration,
    resetCelebration,
    glowStyle,
    borderStyle,
    prColor,
    prColorLight,
  } = usePRCelebration();

  const [setData, setSetData] = useState({
    primaryValue: null as number | null,
    secondaryValue: null as number | null,
  });

  const blockColors = getBlockColors(blockType);
  const set = sets[setId];

  // Check if this set is currently marked as a PR (from store state)
  const isCurrentPR = set?.was_pr || false;

  // Get previous set data for this exercise and set order
  const exercisePrevSets =
    exercisePreviousSets[exerciseInBlock.exercise_id] || [];
  const prevSet = exercisePrevSets.find(
    (prevData) => prevData.order_index === set.order_index
  );

  const handleSetPress = (completed: boolean, setId: string) => {
    if (completed) {
      uncompleteSet(setId);
      resetCelebration();
      haptic.light(); // Light haptic for uncomplete
    } else {
      // Prioridad: 1) Input del usuario (local state), 2) Valor autocompletado del store
      const userPrimaryInput =
        setData.primaryValue ?? set.actual_primary_value ?? null;
      const userSecondaryInput =
        setData.secondaryValue ?? set.actual_secondary_value ?? null;
      const userRpeInput = set.actual_rpe || null;

      // Helper para obtener valor efectivo con auto-completion
      // Incluye prev value como fallback cuando no hay valores planificados
      const getEffectiveValue = (
        userInput: number | null,
        plannedRange: { min: number; max: number } | null,
        plannedValue: number | null,
        prevValue: number | null | undefined,
        fallback: number = 0
      ): number => {
        if (userInput !== null) return userInput;
        if (plannedRange) return plannedRange.min; // Usar min del range como default
        if (plannedValue) return plannedValue;
        if (prevValue) return prevValue; // Usar valor anterior si no hay plan
        return fallback;
      };

      const effectivePrimaryValue = getEffectiveValue(
        userPrimaryInput,
        set.planned_primary_range,
        set.planned_primary_value,
        prevSet?.actual_primary_value,
        0
      );

      const effectiveSecondaryValue = getEffectiveValue(
        userSecondaryInput,
        set.planned_secondary_range,
        set.planned_secondary_value,
        prevSet?.actual_secondary_value,
        0
      );

      // Para PR validation, soportar weight_reps y weight_reps_range templates
      const supportsPRTemplate =
        set.measurement_template === "weight_reps" ||
        set.measurement_template === "weight_reps_range";
      const prValidation = supportsPRTemplate
        ? validatePR(effectivePrimaryValue, effectiveSecondaryValue)
        : { isPR: false, estimatedOneRM: 0 };

      completeSet(exerciseInBlock.tempId, setId, blockId, {
        primaryValue: effectivePrimaryValue,
        secondaryValue: effectiveSecondaryValue,
        actualRpe: userRpeInput || set.planned_rpe || 0,
        estimated1RM: prValidation.estimatedOneRM,
        isPR: prValidation.isPR,
      });

      // Haptic feedback for completing set (PR has its own haptic in celebration)
      if (!prValidation.isPR) {
        haptic.medium();
      }

      if (prValidation.isPR) {
        triggerCelebration();
      }
    }
  };

  const handleSetType = useCallback(() => {
    haptic.light();
    onToggleSheet("setType");
    setCurrentState({
      currentSetId: set.tempId,
      currentExerciseInBlockId: exerciseInBlock.tempId,
      currentSetType: set.set_type,
    });
  }, [
    exerciseInBlock.tempId,
    onToggleSheet,
    set.tempId,
    set.set_type,
    setCurrentState,
    haptic,
  ]);

  const renderPrimaryValue =
    setData.primaryValue || set.actual_primary_value || null;
  const renderSecondaryValue =
    setData.secondaryValue || set.actual_secondary_value || null;

  // Obtener información del template para renderizado condicional
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
    const field = template.fields[fieldIndex];
    const isWeightField = field?.type === "weight";
    const isDistanceField = field?.type === "distance";

    // Helper to format value based on field type
    const formatFieldValue = (value: number): string => {
      if (isWeightField) {
        return fromKg(value, weightUnit, 1).toString();
      }
      if (isDistanceField) {
        // Check if km or meters based on field unit
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
    // Esto permite que el auto-complete use el valor anterior cuando no hay plan
    if (prevValue) {
      return formatFieldValue(prevValue);
    }

    // Fallback
    return "0";
  };

  const isSetCompleted = !!set.completed_at;

  const handleTempoTotal = (tempo: string | undefined) => {
    const segments = tempo?.split("-").map((s) => parseInt(s, 10)) || [];
    if (segments.length === 0) return 0;
    return segments.reduce((total, num) => total + num, 0);
  };

  const handleOpenRpeSelector = () => {
    haptic.light();
    onToggleSheet("rpeSelector");
    setCurrentState({
      currentSetId: set.tempId,
      currentRpeValue: (set.actual_rpe as RPEValue) || null,
    });
  };

  const handleSeeTempo = () => {
    haptic.light();
    onToggleSheet("tempoMetronome");
    setCurrentState({
      currentTempo: set.planned_tempo || null,
    });
  };

  // Calcular si este set es el próximo a completar
  const isNextSet =
    (blockType === "superset" || blockType === "circuit") &&
    nextSetIndicator?.isNextSet(exerciseInBlock.tempId, set.order_index);

  return (
    <View
      key={set.tempId}
      style={{
        backgroundColor:
          isCurrentPR && isSetCompleted
            ? prColorLight
            : isSetCompleted
            ? blockColors.light
            : "transparent",
        position: "relative",
        overflow: "hidden",
        borderRadius: isCurrentPR && isSetCompleted ? 8 : 0,
        borderColor:
          isCurrentPR && isSetCompleted ? prColor + "40" : "transparent",
      }}
    >
      {/* PR Border Accent with gradient effect */}
      {isCurrentPR && isSetCompleted && (
        <Animated.View
          style={[
            {
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: 4,
              backgroundColor: prColor,
              shadowColor: prColor,
              shadowOffset: { width: 2, height: 0 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
            },
            borderStyle,
          ]}
        />
      )}

      {/* Next Set Arrow Indicator */}
      <NextSetArrow
        blockType={
          blockType === "superset" || blockType === "circuit"
            ? blockType
            : "circuit"
        }
        isVisible={isNextSet}
      />

      {/* Main Set Row */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 8,
          paddingHorizontal: 8,
        }}
      >
        {/* Set Number */}
        <View style={{ width: 40, alignItems: "center" }}>
          <TouchableOpacity
            onPress={handleSetType}
            style={{
              // Hit area mínima de 44x44px para accesibilidad
              minWidth: 44,
              minHeight: 44,
              alignItems: "center",
              justifyContent: "center",
              // Padding invisible para expandir área clickeable
              paddingHorizontal: 8,
              paddingVertical: 8,
            }}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={`Cambiar tipo de set ${set.order_index + 1}`}
            accessibilityHint={`Actualmente es ${
              getSetTypeLabel(set.set_type) || "normal"
            }. Toca para cambiar el tipo de set`}
          >
            {/* Visual element mantiene el mismo tamaño */}
            <View
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                backgroundColor:
                  set.set_type !== "normal"
                    ? getSetTypeColor(set.set_type)
                    : colors.border,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="caption"
                weight="medium"
                style={{
                  color: set.set_type !== "normal" ? "white" : colors.text,
                  fontSize: 10,
                }}
              >
                {getSetTypeLabel(set.set_type) ||
                  (set.order_index + 1).toString()}
              </Typography>
            </View>
          </TouchableOpacity>
        </View>

        {/* Previous Set Info */}
        <View style={{ width: 80, alignItems: "center" }}>
          <Typography
            style={{ fontSize: 14 }}
            variant="caption"
            color="textMuted"
          >
            {prevSet
              ? formatMeasurementValue(
                  prevSet.actual_primary_value,
                  null,
                  prevSet.measurement_template,
                  "primary"
                ) +
                (prevSet.actual_secondary_value
                  ? ` x ${formatMeasurementValue(
                      prevSet.actual_secondary_value,
                      null,
                      prevSet.measurement_template,
                      "secondary"
                    )}`
                  : "")
              : "--"}
          </Typography>
        </View>

        {/* Primary Value Input */}
        <View style={{ flex: 1, paddingHorizontal: 8 }}>
          <MeasurementInput
            field={template?.fields[0]!}
            value={renderPrimaryValue}
            onChange={(value) => {
              setSetData((prev) => ({
                ...prev,
                primaryValue: value,
              }));
              autoFillFollowingSets(exerciseInBlock.tempId, set.order_index, {
                primaryValue: value,
              });
            }}
            placeholder={getPlaceholderValue("primary")}
            setNumber={set.order_index + 1}
            activeWorkout={true}
            weightUnit={weightUnit}
            distanceUnit={distanceUnit}
            disabled={isSetCompleted}
          />
        </View>

        {/* Secondary Value Input - Conditional */}
        {hasSecondaryField && template?.fields[1] && (
          <View style={{ flex: 1, paddingHorizontal: 8 }}>
            <MeasurementInput
              field={template.fields[1]}
              value={renderSecondaryValue}
              onChange={(value) => {
                setSetData((prev) => ({
                  ...prev,
                  secondaryValue: value,
                }));
                autoFillFollowingSets(exerciseInBlock.tempId, set.order_index, {
                  secondaryValue: value,
                });
              }}
              placeholder={getPlaceholderValue("secondary")}
              setNumber={set.order_index + 1}
              activeWorkout={true}
              weightUnit={weightUnit}
              distanceUnit={distanceUnit}
              disabled={isSetCompleted}
            />
          </View>
        )}

        {/* RPE Input */}
        {session?.routine?.show_rpe && (
          <View style={{ flex: 0.8, paddingHorizontal: 8 }}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleOpenRpeSelector}
              accessible={true}
              accessibilityRole="button"
              style={{
                minHeight: 44,
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: 8,
                paddingVertical: 8,
              }}
            >
              {/* Visual element más pequeño, similar al set type */}
              <View
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 6,
                  backgroundColor: set.actual_rpe
                    ? colors.primary[500] + "15"
                    : "transparent",
                  borderWidth: 1,
                  borderColor: set.actual_rpe
                    ? colors.primary[500] + "40"
                    : colors.border,
                  minWidth: 44,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography
                  variant="body2"
                  weight={set.actual_rpe ? "semibold" : "normal"}
                  style={{
                    color: set.actual_rpe
                      ? colors.primary[500]
                      : colors.textMuted,
                    fontSize: 14,
                    textAlign: "center",
                  }}
                >
                  {set.actual_rpe || set.planned_rpe}
                </Typography>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* Complete Button */}
        <View style={{ width: 40, alignItems: "center" }}>
          <TouchableOpacity
            onPress={() => handleSetPress(isSetCompleted, set.tempId)}
            style={{
              // Área clickeable mínima para WCAG
              minWidth: 44,
              minHeight: 44,
              alignItems: "center",
              justifyContent: "center",
              // Padding invisible para expandir área clickeable
              paddingHorizontal: 6,
              paddingVertical: 6,
            }}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={
              isSetCompleted ? t.markAsIncomplete[lang] : t.completeSet[lang]
            }
            accessibilityHint={
              isSetCompleted ? t.tapToUnmark[lang] : t.tapToMarkComplete[lang]
            }
            accessibilityState={{ checked: isSetCompleted }}
          >
            {/* Visual element mantiene el mismo tamaño */}
            <Animated.View
              style={[
                {
                  width: 32,
                  height: 32,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 8,
                  backgroundColor: isSetCompleted
                    ? isCurrentPR
                      ? prColor
                      : blockColors.primary
                    : colors.background,
                  borderWidth: isSetCompleted ? 0 : 2,
                  borderColor: isSetCompleted ? "transparent" : colors.border,
                  shadowColor: isSetCompleted
                    ? isCurrentPR
                      ? prColor
                      : blockColors.primary
                    : "transparent",
                  shadowOffset: { width: 0, height: isCurrentPR ? 3 : 2 },
                  shadowOpacity: isCurrentPR ? 0.4 : 0.2,
                  shadowRadius: isCurrentPR ? 6 : 4,
                  elevation: isSetCompleted ? (isCurrentPR ? 5 : 3) : 0,
                },
                isCurrentPR && isSetCompleted ? glowStyle : {},
              ]}
            >
              {isCurrentPR && isSetCompleted ? (
                <Trophy size={14} color="#ffffff" strokeWidth={2.5} />
              ) : (
                <Check
                  size={16}
                  color={isSetCompleted ? "#ffffff" : colors.textMuted}
                  strokeWidth={isSetCompleted ? 2.5 : 2}
                />
              )}
            </Animated.View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tempo Badge (cuando hay tempo configurado) */}
      {set.planned_tempo && (
        <View
          style={{
            paddingLeft: 48, // Alineado con el contenido después del número de set
            paddingRight: 16,
            paddingBottom: 6,
          }}
        >
          <TouchableOpacity
            onPress={handleSeeTempo}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              paddingVertical: 4,
              paddingHorizontal: 2,
            }}
            activeOpacity={0.7}
          >
            <Timer size={14} color={colors.primary[500]} />
            <Typography
              variant="caption"
              weight="medium"
              style={{
                color: colors.text,
                fontSize: 13,
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
                fontSize: 12,
              }}
            >
              ({handleTempoTotal(set.planned_tempo)}s)
            </Typography>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
