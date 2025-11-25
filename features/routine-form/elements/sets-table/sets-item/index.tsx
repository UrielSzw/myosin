import { IToogleSheet } from "@/features/routine-form/hooks/use-form-routine-sheets";
import {
  useMainActions,
  useRoutineFormState,
  useSetActions,
} from "@/features/routine-form/hooks/use-routine-form-store";
import { useBlockStyles } from "@/shared/hooks/use-block-styles";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { routineFormTranslations } from "@/shared/translations/routine-form";
import {
  getDefaultTemplate,
  getMeasurementTemplate,
} from "@/shared/types/measurement";
import { MeasurementInput } from "@/shared/ui/measurement-input";
import { Typography } from "@/shared/ui/typography";
import { Timer } from "lucide-react-native";
import React, { useCallback } from "react";
import { TouchableOpacity, View } from "react-native";

type Props = {
  setId: string;
  exerciseInBlockId: string;
  onToggleSheet: (sheet?: IToogleSheet) => void;
};

export const SetsItem = React.memo<Props>(
  ({ setId, exerciseInBlockId, onToggleSheet }) => {
    const { sets, routine } = useRoutineFormState();
    const { getSetTypeColor, getSetTypeLabel } = useBlockStyles();
    const { colors } = useColorScheme();
    const prefs = useUserPreferences();
    const lang = prefs?.language ?? "es";
    const t = routineFormTranslations;
    const { updateSet } = useSetActions();
    const { setCurrentState } = useMainActions();

    // Get user's weight unit preference
    const weightUnit = prefs?.weight_unit ?? "kg";

    const { show_rpe, show_tempo } = routine;

    const set = sets[setId];
    const template = getMeasurementTemplate(
      set.measurement_template || getDefaultTemplate(),
      weightUnit
    );

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
      setCurrentState({
        currentSetId: set.tempId,
      });

      onToggleSheet("rpeSelector");
    }, [onToggleSheet, set.tempId, setCurrentState]);

    const handleShowTempoSelector = useCallback(() => {
      setCurrentState({
        currentSetId: set.tempId,
        currentSetTempo: set.tempo,
      });

      onToggleSheet("tempoSelector");
    }, [onToggleSheet, set.tempId, set.tempo, setCurrentState]);

    if (!set) return null;

    const setNumber = set.order_index + 1;
    const setTypeLabel = getSetTypeLabel(set.set_type);
    const isSpecialSet = set.set_type !== "normal";

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
        accessible={true}
        accessibilityLabel={`Set ${setNumber}${
          isSpecialSet ? ` (${setTypeLabel})` : ""
        }`}
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
            accessibilityLabel={`Cambiar tipo de set ${setNumber}`}
            accessibilityHint={`Actualmente es ${
              setTypeLabel || "normal"
            }. Toca para cambiar el tipo de set`}
            accessibilityValue={{ text: setTypeLabel || "normal" }}
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

        {/* Dynamic Measurement Inputs */}
        {template.fields.length === 1 ? (
          // Single column: use fixed width to match header
          <View style={{ width: "50%", paddingHorizontal: 8 }}>
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
            />
          </View>
        ) : (
          // Multiple columns: use flex as before
          template.fields.map((field, index) => (
            <View key={field.id} style={{ flex: 1, paddingHorizontal: 8 }}>
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
              />
            </View>
          ))
        )}

        {/* RPE Input - Ultra Compact */}
        {show_rpe && (
          <View style={{ width: 50, alignItems: "center" }}>
            <TouchableOpacity
              style={{
                minHeight: 32,
                minWidth: 36,
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: 6,
                paddingVertical: 4,
                backgroundColor: "transparent",
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 6,
              }}
              accessible={true}
              accessibilityLabel={`RPE para set ${setNumber}`}
              accessibilityHint={t.tapToConfigureRPE[lang]}
              onPress={handleShowRPESelector}
            >
              <Typography
                variant="caption"
                style={{
                  color: colors.textMuted,
                  fontSize: 12,
                  fontWeight: "500",
                }}
              >
                {set.rpe ? set.rpe.toString() : "-"}
              </Typography>
            </TouchableOpacity>
          </View>
        )}

        {/* TEMPO Input - Ultra Compact */}
        {show_tempo && (
          <View style={{ width: 40, alignItems: "center" }}>
            <TouchableOpacity
              style={{
                minHeight: 32,
                minWidth: 32,
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: 4,
                paddingVertical: 4,
                backgroundColor: "transparent",
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 6,
              }}
              accessible={true}
              accessibilityLabel={`Tempo para set ${setNumber}`}
              accessibilityHint={t.tapToConfigureTempo[lang]}
              onPress={handleShowTempoSelector}
            >
              <Timer
                size={14}
                color={set.tempo ? colors.primary[500] : colors.textMuted}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
);

SetsItem.displayName = "SetsItem";
