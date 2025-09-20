import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Typography } from "@/shared/ui/typography";
import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronUp,
  Pause,
  Square,
} from "lucide-react-native";
import React, { forwardRef, useCallback, useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";

interface TempoPhase {
  name: string;
  description: string;
  color: string;
  icon: "ArrowDown" | "Pause" | "ArrowUp" | "Square";
}

type TempoValues = {
  eccentric: number;
  pause1: number;
  concentric: number;
  pause2: number;
};

interface Props {
  selectedTempo?: string;
  onSelect: (tempo: string | null) => void;
  onDismiss?: () => void;
}

const TEMPO_PHASES: TempoPhase[] = [
  {
    name: "Excéntrica",
    description: "Fase de descenso",
    color: "#22C55E", // green-500 - from TempoMetronome
    icon: "ArrowDown",
  },
  {
    name: "Pausa Inferior",
    description: "Pausa en el fondo",
    color: "#F59E0B", // amber-500 - from TempoMetronome (same for both pauses)
    icon: "Pause",
  },
  {
    name: "Concéntrica",
    description: "Fase de subida",
    color: "#EF4444", // red-500 - from TempoMetronome
    icon: "ArrowUp",
  },
  {
    name: "Pausa Superior",
    description: "Pausa arriba",
    color: "#F59E0B", // amber-500 - from TempoMetronome (same as bottom pause)
    icon: "Square",
  },
];

const PRESET_TEMPOS = [
  {
    value: "2-0-2-0",
    label: "Estándar",
    description: "Tempo controlado básico",
  },
  {
    value: "3-1-2-1",
    label: "Fuerza",
    description: "Enfoque en fuerza máxima",
  },
  {
    value: "4-2-1-0",
    label: "Excéntrico",
    description: "Énfasis en fase negativa",
  },
  { value: "1-0-3-1", label: "Explosivo", description: "Potencia y velocidad" },
  {
    value: "5-3-2-2",
    label: "Hipertrofia",
    description: "Tiempo bajo tensión",
  },
  {
    value: "2-2-2-2",
    label: "Metabólico",
    description: "Stress metabólico alto",
  },
];

export const TempoSelector = forwardRef<BottomSheetModal, Props>(
  ({ selectedTempo, onSelect, onDismiss }, ref) => {
    const { colors } = useColorScheme();

    // Helper function to render phase icons
    const renderPhaseIcon = (
      iconName: TempoPhase["icon"],
      size: number = 16,
      color: string = "#000"
    ) => {
      switch (iconName) {
        case "ArrowDown":
          return <ArrowDown size={size} color={color} />;
        case "Pause":
          return <Pause size={size} color={color} />;
        case "ArrowUp":
          return <ArrowUp size={size} color={color} />;
        case "Square":
          return <Square size={size} color={color} />;
        default:
          return null;
      }
    };

    // Parse selected tempo or use default
    const parseTempoValues = (tempo: string = "2-0-2-0") => {
      const values = tempo.split("-").map(Number);
      return {
        eccentric: values[0] || 2,
        pause1: values[1] || 0,
        concentric: values[2] || 2,
        pause2: values[3] || 0,
      };
    };

    // Estado local principal - fuente única de verdad
    const [localTempo, setLocalTempo] = useState<TempoValues>(() =>
      selectedTempo
        ? parseTempoValues(selectedTempo)
        : { eccentric: 2, pause1: 0, concentric: 2, pause2: 0 }
    );
    const [isCustomMode, setIsCustomMode] = useState(false);

    // Sincronizar con selectedTempo cuando cambie externamente
    useEffect(() => {
      if (selectedTempo) {
        setLocalTempo(parseTempoValues(selectedTempo));
      }
    }, [selectedTempo]);

    const formatTempo = useCallback((values: TempoValues) => {
      return `${values.eccentric}-${values.pause1}-${values.concentric}-${values.pause2}`;
    }, []);

    const handlePresetSelect = useCallback(
      (tempo: string) => {
        const tempoValues = parseTempoValues(tempo);
        setLocalTempo(tempoValues);
        setIsCustomMode(false);
        onSelect(tempo);
        // Auto-dismiss when selecting preset
        onDismiss?.();
      },
      [onSelect, onDismiss]
    );

    const handleCustomTempoChange = useCallback(
      (phase: keyof TempoValues, delta: number) => {
        setLocalTempo((prev) => {
          const newValue = Math.max(0, Math.min(9, prev[phase] + delta));
          return { ...prev, [phase]: newValue };
        });
      },
      []
    );

    const handleCustomModeToggle = useCallback(() => {
      setIsCustomMode(true);
      // Si no hay tempo seleccionado, inicializar con valores por defecto
      if (!selectedTempo) {
        setLocalTempo({ eccentric: 2, pause1: 0, concentric: 2, pause2: 0 });
      }
    }, [selectedTempo]);

    const handleClear = useCallback(() => {
      onSelect(null);
      setLocalTempo({ eccentric: 2, pause1: 0, concentric: 2, pause2: 0 });
      setIsCustomMode(false);
    }, [onSelect]);

    const handleDismiss = useCallback(() => {
      onDismiss?.();
    }, [onDismiss]);

    const currentTempoString = formatTempo(localTempo);

    // Detectar si el tempo actual coincide con algún preset
    const matchingPreset = PRESET_TEMPOS.find(
      (preset) => preset.value === (selectedTempo || currentTempoString)
    );

    // Determinar si hay tempo seleccionado
    const hasSelectedTempo =
      selectedTempo !== null &&
      selectedTempo !== undefined &&
      selectedTempo !== "";

    // Estado del display
    const displayState = {
      isEmpty: !hasSelectedTempo,
      isPreset: hasSelectedTempo && !!matchingPreset,
      isCustom: hasSelectedTempo && !matchingPreset,
      presetName: matchingPreset?.label,
      tempoValue: hasSelectedTempo ? selectedTempo : currentTempoString,
    };

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={["80%"]}
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
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={{ paddingBottom: 24 }}>
            <Typography
              variant="h3"
              weight="bold"
              style={{
                textAlign: "center",
                marginBottom: 8,
                color: colors.text,
              }}
            >
              Seleccionar Tempo
            </Typography>

            <Typography
              variant="body2"
              color="textMuted"
              style={{ textAlign: "center", marginBottom: 16 }}
            >
              Configura el ritmo de ejecución del ejercicio
            </Typography>

            {/* Current Tempo Display */}
            <View
              style={{
                backgroundColor: displayState.isEmpty
                  ? colors.border + "10"
                  : colors.border + "15",
                paddingHorizontal: 20,
                paddingVertical: 16,
                borderRadius: 16,
                borderWidth: 2,
                borderColor: displayState.isEmpty
                  ? colors.border + "40"
                  : colors.primary[500] + "30",
                alignItems: "center",
              }}
            >
              {displayState.isEmpty ? (
                // Estado vacío
                <>
                  <Typography
                    variant="body1"
                    weight="semibold"
                    style={{
                      color: colors.textMuted,
                      marginBottom: 4,
                    }}
                  >
                    Sin tempo asignado
                  </Typography>
                  <Typography
                    variant="h3"
                    weight="extrabold"
                    style={{
                      color: colors.border,
                      fontFamily: "monospace",
                      letterSpacing: 2,
                    }}
                  >
                    - - - -
                  </Typography>
                </>
              ) : displayState.isPreset ? (
                // Preset seleccionado
                <>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 4,
                    }}
                  >
                    <Typography
                      variant="body1"
                      weight="bold"
                      style={{
                        color: colors.primary[500],
                        marginRight: 6,
                      }}
                    >
                      🎯 {displayState.presetName}
                    </Typography>
                  </View>
                  <Typography
                    variant="h2"
                    weight="extrabold"
                    style={{
                      color: colors.primary[500],
                      fontFamily: "monospace",
                      letterSpacing: 2,
                    }}
                  >
                    {displayState.tempoValue}
                  </Typography>
                </>
              ) : (
                // Custom seleccionado
                <>
                  <Typography
                    variant="body2"
                    weight="semibold"
                    style={{
                      color: colors.primary[500],
                      marginBottom: 4,
                    }}
                  >
                    Personalizado
                  </Typography>
                  <Typography
                    variant="h2"
                    weight="extrabold"
                    style={{
                      color: colors.primary[500],
                      fontFamily: "monospace",
                      letterSpacing: 2,
                    }}
                  >
                    {displayState.tempoValue}
                  </Typography>
                </>
              )}

              <Typography
                variant="caption"
                color="textMuted"
                style={{ marginTop: 4 }}
              >
                {displayState.isEmpty
                  ? "Selecciona un tempo para el ejercicio"
                  : "Excéntrica - Pausa - Concéntrica - Pausa"}
              </Typography>
            </View>
          </View>

          {/* Mode Toggle */}
          <View
            style={{
              flexDirection: "row",
              backgroundColor: colors.border + "20",
              borderRadius: 12,
              padding: 4,
              marginBottom: 24,
            }}
          >
            <TouchableOpacity
              onPress={() => setIsCustomMode(false)}
              style={{
                flex: 1,
                paddingVertical: 12,
                borderRadius: 8,
                backgroundColor: !isCustomMode
                  ? colors.primary[500]
                  : "transparent",
                alignItems: "center",
              }}
              activeOpacity={0.7}
            >
              <Typography
                variant="body2"
                weight="semibold"
                style={{
                  color: !isCustomMode ? "white" : colors.textMuted,
                }}
              >
                Presets
              </Typography>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleCustomModeToggle}
              style={{
                flex: 1,
                paddingVertical: 12,
                borderRadius: 8,
                backgroundColor: isCustomMode
                  ? colors.primary[500]
                  : "transparent",
                alignItems: "center",
              }}
              activeOpacity={0.7}
            >
              <Typography
                variant="body2"
                weight="semibold"
                style={{
                  color: isCustomMode ? "white" : colors.textMuted,
                }}
              >
                Personalizado
              </Typography>
            </TouchableOpacity>
          </View>

          {/* Content */}
          {!isCustomMode ? (
            <View style={{ gap: 12 }}>
              {PRESET_TEMPOS.map((preset) => {
                // Verificar si este preset está seleccionado
                const isSelected =
                  selectedTempo === preset.value ||
                  (!selectedTempo && currentTempoString === preset.value);
                const tempoValues = parseTempoValues(preset.value);
                console.log("Preset Tempo:", currentTempoString);
                return (
                  <TouchableOpacity
                    key={preset.value}
                    onPress={() => handlePresetSelect(preset.value)}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingVertical: 16,
                      paddingHorizontal: 20,
                      borderRadius: 16,
                      backgroundColor: isSelected
                        ? colors.primary[500] + "20"
                        : colors.background,
                      borderWidth: 2,
                      borderColor: isSelected
                        ? colors.primary[500]
                        : colors.border + "30",
                      shadowColor: isSelected
                        ? colors.primary[500]
                        : "transparent",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: isSelected ? 0.1 : 0,
                      shadowRadius: 8,
                      elevation: isSelected ? 2 : 0,
                    }}
                    activeOpacity={0.7}
                  >
                    {/* Tempo Display */}
                    <View
                      style={{
                        width: 80,
                        height: 60,
                        borderRadius: 12,
                        backgroundColor: isSelected
                          ? colors.primary[500]
                          : colors.border + "30",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: 16,
                      }}
                    >
                      <Typography
                        variant="body1"
                        weight="extrabold"
                        style={{
                          color: isSelected ? "white" : colors.text,
                          fontFamily: "monospace",
                          fontSize: 14,
                        }}
                      >
                        {preset.value}
                      </Typography>
                    </View>

                    {/* Content */}
                    <View style={{ flex: 1 }}>
                      <Typography
                        variant="body1"
                        weight="bold"
                        style={{
                          color: isSelected ? colors.primary[500] : colors.text,
                          marginBottom: 4,
                        }}
                      >
                        {preset.label}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textMuted"
                        style={{ marginBottom: 8 }}
                      >
                        {preset.description}
                      </Typography>

                      {/* Phase indicators */}
                      <View style={{ flexDirection: "row", gap: 4 }}>
                        {TEMPO_PHASES.map((phase, phaseIndex) => {
                          const phaseValue =
                            Object.values(tempoValues)[phaseIndex];
                          if (phaseValue === 0) return null;

                          return (
                            <View
                              key={phaseIndex}
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                backgroundColor: phase.color + "20",
                                paddingHorizontal: 6,
                                paddingVertical: 2,
                                borderRadius: 6,
                              }}
                            >
                              {renderPhaseIcon(phase.icon, 10, phase.color)}
                              <Typography
                                variant="caption"
                                style={{
                                  color: phase.color,
                                  fontSize: 10,
                                  fontWeight: "600",
                                  marginLeft: 4,
                                }}
                              >
                                {phaseValue}s
                              </Typography>
                            </View>
                          );
                        })}
                      </View>
                    </View>

                    {/* Selection Indicator */}
                    {isSelected && (
                      <View
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: 12,
                          backgroundColor: colors.primary[500],
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Typography
                          variant="caption"
                          weight="bold"
                          style={{ color: "white", fontSize: 12 }}
                        >
                          ✓
                        </Typography>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : (
            <View style={{ gap: 16 }}>
              {TEMPO_PHASES.map((phase, index) => {
                const phaseKey = [
                  "eccentric",
                  "pause1",
                  "concentric",
                  "pause2",
                ][index] as keyof TempoValues;
                const value = localTempo[phaseKey];

                return (
                  <View
                    key={String(phaseKey)}
                    style={{
                      backgroundColor: colors.background,
                      borderWidth: 1,
                      borderColor: colors.border + "30",
                      borderRadius: 16,
                      padding: 20,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 16,
                      }}
                    >
                      <View
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 20,
                          backgroundColor: phase.color + "20",
                          alignItems: "center",
                          justifyContent: "center",
                          marginRight: 12,
                        }}
                      >
                        {renderPhaseIcon(phase.icon, 18, phase.color)}
                      </View>
                      <View style={{ flex: 1 }}>
                        <Typography
                          variant="body1"
                          weight="bold"
                          style={{ color: phase.color, marginBottom: 2 }}
                        >
                          {phase.name}
                        </Typography>
                        <Typography variant="caption" color="textMuted">
                          {phase.description}
                        </Typography>
                      </View>
                    </View>

                    {/* Value Controls */}
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 20,
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => handleCustomTempoChange(phaseKey, -1)}
                        disabled={value <= 0}
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: 24,
                          backgroundColor:
                            value > 0 ? phase.color : colors.border + "30",
                          alignItems: "center",
                          justifyContent: "center",
                          opacity: value > 0 ? 1 : 0.5,
                        }}
                        activeOpacity={0.7}
                      >
                        <ChevronDown
                          size={24}
                          color={value > 0 ? "white" : colors.textMuted}
                        />
                      </TouchableOpacity>

                      <View
                        style={{
                          minWidth: 80,
                          alignItems: "center",
                          backgroundColor: colors.border + "15",
                          paddingHorizontal: 20,
                          paddingVertical: 12,
                          borderRadius: 12,
                        }}
                      >
                        <Typography
                          variant="h2"
                          weight="extrabold"
                          style={{
                            color: colors.text,
                            fontFamily: "monospace",
                          }}
                        >
                          {value}
                        </Typography>
                        <Typography variant="caption" color="textMuted">
                          segundos
                        </Typography>
                      </View>

                      <TouchableOpacity
                        onPress={() => handleCustomTempoChange(phaseKey, 1)}
                        disabled={value >= 9}
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: 24,
                          backgroundColor:
                            value < 9 ? phase.color : colors.border + "30",
                          alignItems: "center",
                          justifyContent: "center",
                          opacity: value < 9 ? 1 : 0.5,
                        }}
                        activeOpacity={0.7}
                      >
                        <ChevronUp
                          size={24}
                          color={value < 9 ? "white" : colors.textMuted}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </View>
          )}

          {/* Action Buttons */}
          <View
            style={{
              flexDirection: "row",
              gap: 12,
              paddingTop: 32,
              marginTop: 24,
              borderTopWidth: 1,
              borderTopColor: colors.border + "30",
            }}
          >
            {/* Clear Button */}
            <TouchableOpacity
              onPress={() => {
                handleClear();
                handleDismiss();
              }}
              disabled={displayState.isEmpty}
              style={{
                flex: 1,
                paddingVertical: 16,
                borderRadius: 12,
                backgroundColor: displayState.isEmpty
                  ? colors.border + "20"
                  : "#fee2e2",
                borderWidth: 1,
                borderColor: displayState.isEmpty
                  ? colors.border + "30"
                  : "#fecaca",
                alignItems: "center",
                opacity: displayState.isEmpty ? 0.5 : 1,
              }}
              activeOpacity={0.7}
            >
              <Typography
                variant="body1"
                weight="semibold"
                style={{
                  color: displayState.isEmpty ? colors.textMuted : "#dc2626",
                }}
              >
                Eliminar
              </Typography>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                onSelect(formatTempo(localTempo));
                handleDismiss();
              }}
              style={{
                flex: 1,
                paddingVertical: 16,
                borderRadius: 12,
                backgroundColor: colors.primary[500],
                alignItems: "center",
              }}
              activeOpacity={0.7}
            >
              <Typography
                variant="body1"
                weight="bold"
                style={{ color: "white" }}
              >
                Guardar
              </Typography>
            </TouchableOpacity>
          </View>

          <View style={{ height: 100 }} />
        </BottomSheetScrollView>
      </BottomSheetModal>
    );
  }
);

TempoSelector.displayName = "TempoSelector";
