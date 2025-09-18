import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { RPEValue } from "@/shared/types/workout";
import { Typography } from "@/shared/ui/typography";
import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import React, { forwardRef, useCallback } from "react";
import { TouchableOpacity, View } from "react-native";

interface RPEOption {
  value: RPEValue;
  label: string;
  description: string;
  color: string;
}

interface Props {
  plannedRPE?: number;
  selectedRPE?: RPEValue;
  onSelect: (rpe: RPEValue | null) => void;
  onDismiss?: () => void;
  mode?: "workout" | "form";
}

const RPE_OPTIONS: RPEOption[] = [
  {
    value: 6,
    label: "6.0",
    description: "Podrías hacer 4+ reps más",
    color: "#10B981", // green-500
  },
  {
    value: 6.5,
    label: "6.5",
    description: "Podrías hacer 3-4 reps más",
    color: "#22C55E", // green-400
  },
  {
    value: 7,
    label: "7.0",
    description: "Podrías hacer 2-3 reps más",
    color: "#84CC16", // lime-400
  },
  {
    value: 7.5,
    label: "7.5",
    description: "Podrías hacer 1-2 reps más",
    color: "#EAB308", // yellow-500
  },
  {
    value: 8,
    label: "8.0",
    description: "Podrías hacer 1 rep más",
    color: "#F97316", // orange-500
  },
  {
    value: 8.5,
    label: "8.5",
    description: "Tal vez 1 rep más",
    color: "#EF4444", // red-500
  },
  {
    value: 9,
    label: "9.0",
    description: "No podrías hacer otra rep",
    color: "#DC2626", // red-600
  },
  {
    value: 9.5,
    label: "9.5",
    description: "La técnica empezó a fallar",
    color: "#B91C1C", // red-700
  },
  {
    value: 10,
    label: "10",
    description: "Máximo esfuerzo / Falla",
    color: "#7F1D1D", // red-900
  },
];

export const RPESelector = forwardRef<BottomSheetModal, Props>(
  ({ plannedRPE, selectedRPE, onSelect, onDismiss, mode = "workout" }, ref) => {
    const { colors } = useColorScheme();

    const handleSelect = useCallback(
      (rpe: RPEValue) => {
        onSelect(rpe);
      },
      [onSelect]
    );

    const handleClear = useCallback(() => {
      onSelect(null);
    }, [onSelect]);

    const handleDismiss = useCallback(() => {
      onDismiss?.();
    }, [onDismiss]);

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={["75%"]}
        onDismiss={handleDismiss}
        backgroundStyle={{
          backgroundColor: colors.background,
        }}
        handleIndicatorStyle={{
          backgroundColor: colors.border,
        }}
      >
        <BottomSheetScrollView
          style={{
            flex: 1,
            paddingHorizontal: 20,
            paddingBottom: 20,
          }}
        >
          {/* Header */}
          <View style={{ paddingBottom: 20 }}>
            <Typography
              variant="h3"
              weight="bold"
              style={{
                textAlign: "center",
                marginBottom: 8,
                color: colors.text,
              }}
            >
              {mode === "form"
                ? "Seleccionar RPE Objetivo"
                : "Escala de Esfuerzo Percibido"}
            </Typography>

            {mode === "workout" && plannedRPE && (
              <View
                style={{
                  backgroundColor: colors.border + "20",
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 12,
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="body2"
                  color="textMuted"
                  style={{ textAlign: "center" }}
                >
                  RPE Objetivo: {plannedRPE}
                </Typography>
                <Typography
                  variant="caption"
                  color="textMuted"
                  style={{ textAlign: "center", marginTop: 2 }}
                >
                  ¿Cómo se sintió realmente esta serie?
                </Typography>
              </View>
            )}

            {mode === "form" && (
              <Typography
                variant="body2"
                color="textMuted"
                style={{ textAlign: "center" }}
              >
                Configura la intensidad objetivo para este ejercicio
              </Typography>
            )}
          </View>

          {/* RPE Scale */}
          <View style={{ flex: 1 }}>
            {RPE_OPTIONS.map((option, index) => {
              const isSelected = selectedRPE === option.value;
              const isPlanned =
                mode === "workout" && plannedRPE === option.value;

              return (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => handleSelect(option.value)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 16,
                    paddingHorizontal: 20,
                    marginBottom: 8,
                    borderRadius: 16,
                    backgroundColor: isSelected
                      ? option.color + "20"
                      : isPlanned
                      ? colors.border + "15"
                      : colors.background,
                    borderWidth: isSelected ? 2 : isPlanned ? 1 : 1,
                    borderColor: isSelected
                      ? option.color
                      : isPlanned
                      ? colors.primary[500] + "40"
                      : colors.border + "30",
                    shadowColor: isSelected ? option.color : "transparent",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: isSelected ? 0.2 : 0,
                    shadowRadius: 8,
                    elevation: isSelected ? 4 : 0,
                  }}
                  activeOpacity={0.7}
                >
                  {/* RPE Number Circle */}
                  <View
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 28,
                      backgroundColor: isSelected
                        ? option.color
                        : isPlanned
                        ? colors.primary[500] + "20"
                        : colors.border + "30",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 16,
                    }}
                  >
                    <Typography
                      variant="h3"
                      weight="bold"
                      style={{
                        color: isSelected
                          ? "white"
                          : isPlanned
                          ? colors.primary[500]
                          : colors.text,
                        fontSize: 18,
                      }}
                    >
                      {option.label}
                    </Typography>
                  </View>

                  {/* Content */}
                  <View style={{ flex: 1 }}>
                    <Typography
                      variant="body1"
                      weight="semibold"
                      style={{
                        color: isSelected ? option.color : colors.text,
                        marginBottom: 4,
                      }}
                    >
                      {option.description}
                    </Typography>

                    {mode === "workout" && isPlanned && (
                      <Typography
                        variant="caption"
                        style={{
                          color: colors.primary[500] as string,
                          fontSize: 11,
                          fontWeight: "600",
                        }}
                      >
                        🎯 Intensidad planificada
                      </Typography>
                    )}
                  </View>

                  {/* Selection Indicator */}
                  {isSelected && (
                    <View
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 12,
                        backgroundColor: option.color,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography
                        variant="caption"
                        weight="bold"
                        style={{
                          color: "white",
                          fontSize: 12,
                        }}
                      >
                        ✓
                      </Typography>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Action Buttons */}
          <View
            style={{
              flexDirection: "row",
              gap: 12,
              paddingTop: 20,
              borderTopWidth: 1,
              borderTopColor: colors.border + "30",
            }}
          >
            <TouchableOpacity
              onPress={handleDismiss}
              style={{
                flex: 1,
                paddingVertical: 16,
                borderRadius: 12,
                backgroundColor: colors.border + "20",
                alignItems: "center",
              }}
              activeOpacity={0.7}
            >
              <Typography variant="body1" weight="semibold" color="textMuted">
                Cancelar
              </Typography>
            </TouchableOpacity>

            {/* Clear Button - Only in form mode */}
            {mode === "form" && (
              <TouchableOpacity
                onPress={() => {
                  handleClear();
                  handleDismiss();
                }}
                style={{
                  flex: 1,
                  paddingVertical: 16,
                  borderRadius: 12,
                  backgroundColor: "#fee2e2",
                  borderWidth: 1,
                  borderColor: "#fecaca",
                  alignItems: "center",
                }}
                activeOpacity={0.7}
              >
                <Typography
                  variant="body1"
                  weight="semibold"
                  style={{ color: "#dc2626" }}
                >
                  Limpiar
                </Typography>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={() => {
                if (selectedRPE) {
                  handleSelect(selectedRPE);
                  handleDismiss();
                }
              }}
              style={{
                flex: 2,
                paddingVertical: 16,
                borderRadius: 12,
                backgroundColor: selectedRPE
                  ? RPE_OPTIONS.find((o) => o.value === selectedRPE)?.color ||
                    colors.primary[500]
                  : colors.border + "40",
                alignItems: "center",
                opacity: selectedRPE ? 1 : 0.5,
              }}
              activeOpacity={0.7}
              disabled={!selectedRPE}
            >
              <Typography
                variant="body1"
                weight="bold"
                style={{
                  color: "white",
                }}
              >
                {selectedRPE
                  ? `Confirmar RPE ${selectedRPE}`
                  : "Seleccionar RPE"}
              </Typography>
            </TouchableOpacity>
          </View>

          <View style={{ height: 100 }} />
        </BottomSheetScrollView>
      </BottomSheetModal>
    );
  }
);

RPESelector.displayName = "RPESelector";
