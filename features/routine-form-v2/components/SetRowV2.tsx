import { IToogleSheet } from "@/features/routine-form/hooks/use-form-routine-sheets";
import {
  useMainActions,
  useRoutineFormState,
  useSetActions,
} from "@/features/routine-form/hooks/use-routine-form-store";
import { useBlockStyles } from "@/shared/hooks/use-block-styles";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { MeasurementTemplate } from "@/shared/types/measurement";
import { MeasurementInput } from "@/shared/ui/measurement-input";
import { Typography } from "@/shared/ui/typography";
import { Timer } from "lucide-react-native";
import React, { useCallback } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  FadeInRight,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

type Props = {
  setId: string;
  exerciseInBlockId: string;
  template: MeasurementTemplate;
  showRpe: boolean;
  showTempo: boolean;
  onToggleSheet: (sheet?: IToogleSheet) => void;
  index: number;
};

export const SetRowV2 = React.memo<Props>(
  ({
    setId,
    exerciseInBlockId,
    template,
    showRpe,
    showTempo,
    onToggleSheet,
    index,
  }) => {
    const { sets } = useRoutineFormState();
    const { colors, isDarkMode } = useColorScheme();
    const { getSetTypeColor, getSetTypeLabel } = useBlockStyles();
    const { updateSet } = useSetActions();
    const { setCurrentState } = useMainActions();
    const prefs = useUserPreferences();
    const weightUnit = prefs?.weight_unit ?? "kg";
    const distanceUnit = prefs?.distance_unit ?? "metric";

    const set = sets[setId];

    // Animation values
    const typeScale = useSharedValue(1);
    const rpeScale = useSharedValue(1);
    const tempoScale = useSharedValue(1);

    const typeAnimatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: typeScale.value }],
    }));

    const rpeAnimatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: rpeScale.value }],
    }));

    const tempoAnimatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: tempoScale.value }],
    }));

    const handleSetType = useCallback(() => {
      typeScale.value = withSpring(0.9, { damping: 15 }, () => {
        typeScale.value = withSpring(1);
      });
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
      typeScale,
    ]);

    const handlePrimaryValueChange = useCallback(
      (value: number | null, range?: { min: number; max: number } | null) => {
        updateSet(set.tempId, {
          primary_value: value,
          primary_range: range,
        });
      },
      [set.tempId, updateSet]
    );

    const handleSecondaryValueChange = useCallback(
      (value: number | null, range?: { min: number; max: number } | null) => {
        updateSet(set.tempId, {
          secondary_value: value,
          secondary_range: range,
        });
      },
      [set.tempId, updateSet]
    );

    const handleShowRPESelector = useCallback(() => {
      rpeScale.value = withSpring(0.9, { damping: 15 }, () => {
        rpeScale.value = withSpring(1);
      });
      setCurrentState({ currentSetId: set.tempId });
      onToggleSheet("rpeSelector");
    }, [onToggleSheet, set.tempId, setCurrentState, rpeScale]);

    const handleShowTempoSelector = useCallback(() => {
      tempoScale.value = withSpring(0.9, { damping: 15 }, () => {
        tempoScale.value = withSpring(1);
      });
      setCurrentState({
        currentSetId: set.tempId,
        currentSetTempo: set.tempo,
      });
      onToggleSheet("tempoSelector");
    }, [onToggleSheet, set.tempId, set.tempo, setCurrentState, tempoScale]);

    if (!set) return null;

    const setNumber = set.order_index + 1;
    const setTypeLabel = getSetTypeLabel(set.set_type);
    const isSpecialSet = set.set_type !== "normal";
    const setTypeColor = getSetTypeColor(set.set_type);

    return (
      <Animated.View
        entering={FadeInRight.delay(index * 50).duration(300)}
        style={[
          styles.container,
          {
            backgroundColor: isDarkMode
              ? "rgba(255,255,255,0.02)"
              : "rgba(0,0,0,0.01)",
          },
        ]}
      >
        {/* Set Type Badge */}
        <View style={styles.setColumn}>
          <Animated.View style={typeAnimatedStyle}>
            <Pressable
              onPress={handleSetType}
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

        {/* Measurement Inputs */}
        {template.fields.length === 1 ? (
          <View style={{ width: "50%", paddingHorizontal: 6 }}>
            <MeasurementInput
              field={template.fields[0]}
              value={
                template.fields[0].id === "primary"
                  ? set.primary_value
                  : set.secondary_value
              }
              range={
                template.fields[0].id === "primary"
                  ? set.primary_range
                  : set.secondary_range
              }
              onChange={
                template.fields[0].id === "primary"
                  ? handlePrimaryValueChange
                  : handleSecondaryValueChange
              }
              setNumber={setNumber}
              weightUnit={weightUnit}
              distanceUnit={distanceUnit}
            />
          </View>
        ) : (
          template.fields.map((field) => (
            <View key={field.id} style={{ flex: 1, paddingHorizontal: 6 }}>
              <MeasurementInput
                field={field}
                value={
                  field.id === "primary"
                    ? set.primary_value
                    : set.secondary_value
                }
                range={
                  field.id === "primary"
                    ? set.primary_range
                    : set.secondary_range
                }
                onChange={
                  field.id === "primary"
                    ? handlePrimaryValueChange
                    : handleSecondaryValueChange
                }
                setNumber={setNumber}
                weightUnit={weightUnit}
                distanceUnit={distanceUnit}
              />
            </View>
          ))
        )}

        {/* RPE Button */}
        {showRpe && (
          <View style={styles.rpeColumn}>
            <Animated.View style={rpeAnimatedStyle}>
              <Pressable
                onPress={handleShowRPESelector}
                style={({ pressed }) => [
                  styles.rpeButton,
                  {
                    backgroundColor: set.rpe
                      ? isDarkMode
                        ? "rgba(139, 92, 246, 0.2)"
                        : "rgba(139, 92, 246, 0.1)"
                      : isDarkMode
                      ? "rgba(255,255,255,0.06)"
                      : "rgba(0,0,0,0.04)",
                    borderColor: set.rpe
                      ? colors.primary[500]
                      : isDarkMode
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(0,0,0,0.08)",
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
              >
                <Typography
                  variant="caption"
                  weight={set.rpe ? "bold" : "medium"}
                  style={{
                    color: set.rpe ? colors.primary[500] : colors.textMuted,
                    fontSize: 12,
                  }}
                >
                  {set.rpe ? set.rpe.toString() : "-"}
                </Typography>
              </Pressable>
            </Animated.View>
          </View>
        )}

        {/* Tempo Button */}
        {showTempo && (
          <View style={styles.tempoColumn}>
            <Animated.View style={tempoAnimatedStyle}>
              <Pressable
                onPress={handleShowTempoSelector}
                style={({ pressed }) => [
                  styles.tempoButton,
                  {
                    backgroundColor: set.tempo
                      ? isDarkMode
                        ? "rgba(59, 130, 246, 0.2)"
                        : "rgba(59, 130, 246, 0.1)"
                      : isDarkMode
                      ? "rgba(255,255,255,0.06)"
                      : "rgba(0,0,0,0.04)",
                    borderColor: set.tempo
                      ? "#3B82F6"
                      : isDarkMode
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(0,0,0,0.08)",
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
              >
                <Timer
                  size={14}
                  color={set.tempo ? "#3B82F6" : colors.textMuted}
                />
              </Pressable>
            </Animated.View>
          </View>
        )}
      </Animated.View>
    );
  }
);

SetRowV2.displayName = "SetRowV2";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 2,
    borderRadius: 8,
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
  rpeColumn: {
    width: 44,
    alignItems: "center",
  },
  tempoColumn: {
    width: 36,
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
  tempoButton: {
    width: 30,
    height: 30,
    borderRadius: 7,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
