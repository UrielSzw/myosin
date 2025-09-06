import { IToogleSheet } from "@/features/routine-form/hooks/use-form-routine-sheets";
import {
  useMainActions,
  useRoutineFormState,
  useSetActions,
} from "@/features/routine-form/hooks/use-routine-form-store";
import { useBlockStyles } from "@/shared/hooks/use-block-styles";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { IRepsType } from "@/shared/types/workout";
import { Typography } from "@/shared/ui/typography";
import React, { useCallback } from "react";
import { TextInput, TouchableOpacity, View } from "react-native";

type Props = {
  setId: string;
  exerciseInBlockId: string;
  onToggleSheet: (sheet?: IToogleSheet) => void;
};

export const SetsItem = React.memo<Props>(
  ({ setId, exerciseInBlockId, onToggleSheet }) => {
    const { sets } = useRoutineFormState();
    const { getSetTypeColor, getSetTypeLabel } = useBlockStyles();
    const { colors } = useColorScheme();
    const { updateSet } = useSetActions();
    const { setCurrentState } = useMainActions();

    const set = sets[setId];
    const repsType: IRepsType = set?.reps_type || "reps";

    const handleSetType = useCallback(() => {
      setCurrentState({
        currentSetId: set.tempId,
        currentExerciseInBlockId: exerciseInBlockId,
        currentSetType: set.set_type,
      });

      onToggleSheet("setType");
    }, [
      exerciseInBlockId,
      onToggleSheet,
      set.tempId,
      set.set_type,
      setCurrentState,
    ]);

    const handleWeightChange = useCallback(
      (value: string) => {
        // Permitir valores vacíos y números válidos
        const weight = value === "" ? null : Number(value);

        updateSet(set.tempId, { weight });
      },
      [set.tempId, updateSet]
    );

    const handleRepsChange = useCallback(
      (value: string) => {
        // Permitir valores vacíos y números válidos
        const reps = value === "" ? null : Number(value);

        updateSet(set.tempId, { reps });
      },
      [set.tempId, updateSet]
    );

    const handleRepsMinChange = useCallback(
      (value: string) => {
        const min = value === "" ? null : Number(value);

        updateSet(set.tempId, {
          reps_range: { min, max: set.reps_range?.max || null },
        });
      },
      [set.reps_range?.max, set.tempId, updateSet]
    );

    const handleRepsMaxChange = useCallback(
      (value: string) => {
        const max = value === "" ? null : Number(value);

        updateSet(set.tempId, {
          reps_range: { min: set.reps_range?.min || null, max },
        });
      },
      [set.reps_range?.min, set.tempId, updateSet]
    );

    if (!set) return null;

    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 6,
          backgroundColor: "transparent",
          borderRadius: 4,
          marginBottom: 4,
        }}
      >
        {/* Set Number */}
        <View style={{ width: 40, alignItems: "center" }}>
          <TouchableOpacity
            onPress={handleSetType}
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
          </TouchableOpacity>
        </View>

        {/* Weight Input */}
        <View style={{ flex: 1, paddingHorizontal: 8 }}>
          <TextInput
            value={`${set.weight || ""}`}
            onChangeText={handleWeightChange}
            placeholder="0"
            keyboardType="numeric"
            style={{
              backgroundColor: colors.background,
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 4,
              paddingHorizontal: 8,
              paddingVertical: 6,
              textAlign: "center",
              color: colors.text,
              fontSize: 14,
            }}
          />
        </View>

        {/* Reps Input */}
        <View style={{ flex: 1, paddingHorizontal: 8 }}>
          {repsType === "range" ? (
            // Rango: Dos inputs lado a lado
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
            >
              <TextInput
                value={`${set.reps_range?.min || ""}`}
                onChangeText={handleRepsMinChange}
                placeholder="0"
                keyboardType="numeric"
                style={{
                  flex: 1,
                  backgroundColor: colors.background,
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 4,
                  paddingHorizontal: 6,
                  paddingVertical: 6,
                  textAlign: "center",
                  color: colors.text,
                  fontSize: 12,
                }}
              />
              <Typography
                variant="caption"
                color="textMuted"
                style={{ fontSize: 10 }}
              >
                -
              </Typography>
              <TextInput
                value={`${set.reps_range?.max || ""}`}
                onChangeText={handleRepsMaxChange}
                placeholder="0"
                keyboardType="numeric"
                style={{
                  flex: 1,
                  backgroundColor: colors.background,
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 4,
                  paddingHorizontal: 6,
                  paddingVertical: 6,
                  textAlign: "center",
                  color: colors.text,
                  fontSize: 12,
                }}
              />
            </View>
          ) : (
            // Input normal para reps, time, distance
            <TextInput
              value={`${set.reps || ""}`}
              onChangeText={handleRepsChange}
              placeholder="0"
              keyboardType="numeric"
              style={{
                backgroundColor: colors.background,
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 4,
                paddingHorizontal: 8,
                paddingVertical: 6,
                textAlign: "center",
                color: colors.text,
                fontSize: 14,
              }}
            />
          )}
        </View>
      </View>
    );
  }
);

SetsItem.displayName = "SetsItem";
