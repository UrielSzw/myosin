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

        {/* Weight Input */}
        <View style={{ flex: 1, paddingHorizontal: 8 }}>
          {/* Contenedor clickeable para accesibilidad */}
          <TouchableOpacity
            activeOpacity={1}
            style={{
              // Área clickeable mínima para WCAG
              minHeight: 44,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TextInput
              value={`${set.weight || ""}`}
              onChangeText={handleWeightChange}
              placeholder="0"
              keyboardType="numeric"
              style={{
                // Input visual más compacto
                backgroundColor: "transparent",
                borderWidth: 0,
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
                paddingHorizontal: 8,
                paddingVertical: 6,
                textAlign: "center",
                color: colors.text,
                fontSize: 16,
                fontWeight: "500",
                // Ancho completo del contenedor
                width: "100%",
                minHeight: 32,
              }}
              accessible={true}
              accessibilityLabel={`Peso para set ${setNumber}`}
              accessibilityHint="Ingresa el peso en kilogramos"
              accessibilityValue={{
                text: set.weight
                  ? `${set.weight} kilogramos`
                  : "Sin peso asignado",
              }}
            />
          </TouchableOpacity>
        </View>

        {/* Reps Input */}
        <View style={{ flex: 1, paddingHorizontal: 8 }}>
          {repsType === "range" ? (
            // Rango: Dos inputs lado a lado con wrapper clickeable
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
                minHeight: 44,
                justifyContent: "center",
              }}
            >
              <TouchableOpacity
                activeOpacity={1}
                style={{
                  flex: 1,
                  minHeight: 44,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextInput
                  value={`${set.reps_range?.min || ""}`}
                  onChangeText={handleRepsMinChange}
                  placeholder="0"
                  keyboardType="numeric"
                  style={{
                    backgroundColor: "transparent",
                    borderWidth: 0,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border,
                    paddingHorizontal: 4,
                    paddingVertical: 4,
                    textAlign: "center",
                    color: colors.text,
                    fontSize: 14,
                    fontWeight: "500",
                    width: "100%",
                    minHeight: 28,
                  }}
                  accessible={true}
                  accessibilityLabel={`Repeticiones mínimas para set ${setNumber}`}
                  accessibilityHint="Ingresa el número mínimo de repeticiones"
                />
              </TouchableOpacity>

              <Typography
                variant="caption"
                color="textMuted"
                style={{ fontSize: 12, paddingHorizontal: 2 }}
              >
                -
              </Typography>

              <TouchableOpacity
                activeOpacity={1}
                style={{
                  flex: 1,
                  minHeight: 44,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextInput
                  value={`${set.reps_range?.max || ""}`}
                  onChangeText={handleRepsMaxChange}
                  placeholder="0"
                  keyboardType="numeric"
                  style={{
                    backgroundColor: "transparent",
                    borderWidth: 0,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border,
                    paddingHorizontal: 4,
                    paddingVertical: 4,
                    textAlign: "center",
                    color: colors.text,
                    fontSize: 14,
                    fontWeight: "500",
                    width: "100%",
                    minHeight: 28,
                  }}
                  accessible={true}
                  accessibilityLabel={`Repeticiones máximas para set ${setNumber}`}
                  accessibilityHint="Ingresa el número máximo de repeticiones"
                />
              </TouchableOpacity>
            </View>
          ) : (
            // Input normal para reps, time, distance
            <TouchableOpacity
              activeOpacity={1}
              style={{
                // Área clickeable mínima para WCAG
                minHeight: 44,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextInput
                value={`${set.reps || ""}`}
                onChangeText={handleRepsChange}
                placeholder="0"
                keyboardType="numeric"
                style={{
                  // Input visual más compacto
                  backgroundColor: "transparent",
                  borderWidth: 0,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.border,
                  paddingHorizontal: 8,
                  paddingVertical: 6,
                  textAlign: "center",
                  color: colors.text,
                  fontSize: 16,
                  fontWeight: "500",
                  // Ancho completo del contenedor
                  width: "100%",
                  minHeight: 32,
                }}
                accessible={true}
                accessibilityLabel={`${
                  repsType === "reps"
                    ? "Repeticiones"
                    : repsType === "time"
                    ? "Tiempo"
                    : "Distancia"
                } para set ${setNumber}`}
                accessibilityHint={`Ingresa ${
                  repsType === "reps"
                    ? "el número de repeticiones"
                    : repsType === "time"
                    ? "el tiempo en segundos"
                    : "la distancia"
                }`}
                accessibilityValue={{
                  text: set.reps
                    ? `${set.reps} ${
                        repsType === "reps"
                          ? "repeticiones"
                          : repsType === "time"
                          ? "segundos"
                          : "metros"
                      }`
                    : "Sin valor asignado",
                }}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }
);

SetsItem.displayName = "SetsItem";
