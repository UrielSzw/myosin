import {
  ActiveWorkoutExercise,
  useActiveMainActions,
  useActiveSetActions,
  useActiveWorkout,
} from "@/features/active-workout/hooks/use-active-workout-store";
import { useBlockStyles } from "@/shared/hooks/use-block-styles";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { IBlockType, RPEValue } from "@/shared/types/workout";
import { Typography } from "@/shared/ui/typography";
import { Check, Timer } from "lucide-react-native";
import React, { useCallback, useState } from "react";
import { TextInput, TouchableOpacity, View } from "react-native";
import { IActiveToggleSheet } from "../../../hooks/use-active-workout-sheets";

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
  const { getSetTypeColor, getSetTypeLabel, getBlockColors } = useBlockStyles();
  const { completeSet, uncompleteSet } = useActiveSetActions();
  const { setCurrentState } = useActiveMainActions();
  const { sets, exercisePreviousSets } = useActiveWorkout();

  const [setData, setSetData] = useState({
    weight: "",
    reps: "",
  });

  const blockColors = getBlockColors(blockType);
  const set = sets[setId];

  // Get previous set data for this exercise and set order
  const exercisePrevSets =
    exercisePreviousSets[exerciseInBlock.exercise_id] || [];
  const prevSet = exercisePrevSets.find(
    (prevData) => prevData.order_index === set.order_index
  );

  const handleSetPress = (completed: boolean, setId: string) => {
    if (completed) {
      uncompleteSet(setId);
    } else {
      const userWeightInput = setData.weight ? Number(setData.weight) : null;
      const userRepsInput = setData.reps ? Number(setData.reps) : null;
      const userRpeInput = set.actual_rpe || null;

      const shouldStartTimer = completeSet(
        exerciseInBlock.tempId,
        setId,
        blockId,
        {
          actualWeight: userWeightInput || set.planned_weight || 0,
          actualReps:
            userRepsInput || set?.reps_range?.min || set.planned_reps || 0,
          actualRpe: userRpeInput || set.planned_rpe || 0,
        }
      );

      if (shouldStartTimer) {
        onToggleSheet("restTimer");
      }
    }
  };

  const getRepsPlaceholder = () => {
    if (set.reps_type === "range") {
      return `${set.reps_range?.min || 0}-${set.reps_range?.max || 0}`;
    }

    return set.planned_reps?.toString();
  };

  const handleSetType = useCallback(() => {
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
  ]);

  const renderWeight = setData.weight || set.actual_weight || "";
  const renderReps = setData.reps || set.actual_reps || "";

  const isSetCompleted = !!set.completed_at;

  const handleTempoTotal = (tempo: string | undefined) => {
    const segments = tempo?.split("-").map((s) => parseInt(s, 10)) || [];
    if (segments.length === 0) return 0;
    return segments.reduce((total, num) => total + num, 0);
  };

  const handleOpenRpeSelector = () => {
    onToggleSheet("rpeSelector");
    setCurrentState({
      currentSetId: set.tempId,
      currentRpeValue: (set.actual_rpe as RPEValue) || null,
    });
  };

  const handleSeeTempo = () => {
    onToggleSheet("tempoMetronome");
    setCurrentState({
      currentTempo: set.planned_tempo || null,
    });
  };

  return (
    <View
      key={set.tempId}
      style={{
        backgroundColor: isSetCompleted ? blockColors.light : "transparent",
        borderRadius: 8,
        marginBottom: set?.planned_tempo ? 2 : 0,
      }}
    >
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
              ? `${prevSet.actual_weight}kg x ${prevSet.actual_reps}`
              : "-"}
          </Typography>
        </View>

        {/* Weight Input */}
        <View style={{ flex: 0.9, paddingHorizontal: 8 }}>
          <TextInput
            value={renderWeight?.toString()}
            onChangeText={(value) =>
              setSetData((prev) => ({ ...prev, weight: value }))
            }
            placeholder={set.planned_weight?.toString() || "0"}
            keyboardType="numeric"
            placeholderTextColor={colors.textMuted}
            style={{
              backgroundColor: "transparent",
              borderWidth: 0,
              paddingHorizontal: 8,
              paddingVertical: 6,
              textAlign: "center",
              color: colors.text,
              fontSize: 18,
            }}
          />
        </View>

        {/* Reps Input */}
        <View style={{ flex: 0.9, paddingHorizontal: 8 }}>
          <TextInput
            value={renderReps?.toString()}
            onChangeText={(value) =>
              setSetData((prev) => ({ ...prev, reps: value }))
            }
            placeholder={getRepsPlaceholder() || "0"}
            keyboardType="numeric"
            placeholderTextColor={colors.textMuted}
            style={{
              backgroundColor: "transparent",
              borderWidth: 0,
              paddingHorizontal: 8,
              paddingVertical: 6,
              textAlign: "center",
              color: colors.text,
              fontSize: 18,
            }}
          />
        </View>

        {/* RPE Input */}
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
              isSetCompleted
                ? "Marcar serie como incompleta"
                : "Completar serie"
            }
            accessibilityHint={
              isSetCompleted
                ? "Toca para desmarcar esta serie"
                : "Toca para marcar esta serie como completada"
            }
            accessibilityState={{ checked: isSetCompleted }}
          >
            {/* Visual element mantiene el mismo tamaño */}
            <View
              style={{
                width: 32,
                height: 32,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 8,
                backgroundColor: isSetCompleted
                  ? blockColors.primary
                  : colors.background,
                borderWidth: isSetCompleted ? 0 : 2,
                borderColor: isSetCompleted ? "transparent" : colors.border,
                shadowColor: isSetCompleted
                  ? blockColors.primary
                  : "transparent",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: isSetCompleted ? 3 : 0,
              }}
            >
              <Check
                size={16}
                color={isSetCompleted ? "#ffffff" : colors.textMuted}
                strokeWidth={isSetCompleted ? 2.5 : 2}
              />
            </View>
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
