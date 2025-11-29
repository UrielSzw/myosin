import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { tempoSelectorTranslations } from "@/shared/translations/tempo-selector";
import { Typography } from "@/shared/ui/typography";
import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { BlurView } from "expo-blur";
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronUp,
  Clock,
  Pause,
  Square,
  X,
} from "lucide-react-native";
import React, { forwardRef, useCallback, useEffect, useState } from "react";
import { Platform, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

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
    description: "eccentric", // translation key
    color: "#22C55E", // green-500 - from TempoMetronome
    icon: "ArrowDown",
  },
  {
    name: "Pausa Inferior",
    description: "pause1", // translation key
    color: "#F59E0B", // amber-500 - from TempoMetronome (same for both pauses)
    icon: "Pause",
  },
  {
    name: "Concéntrica",
    description: "concentric", // translation key
    color: "#EF4444", // red-500 - from TempoMetronome
    icon: "ArrowUp",
  },
  {
    name: "Pausa Superior",
    description: "pause2", // translation key
    color: "#F59E0B", // amber-500 - from TempoMetronome (same as bottom pause)
    icon: "Square",
  },
];

const PRESET_TEMPOS = [
  {
    value: "2-0-2-0",
    label: "standard",
    description: "standard",
  },
  {
    value: "3-1-2-1",
    label: "strength",
    description: "strength",
  },
  {
    value: "4-2-1-0",
    label: "eccentric",
    description: "eccentric",
  },
  { value: "1-0-3-1", label: "explosive", description: "explosive" },
  {
    value: "5-3-2-2",
    label: "hypertrophy",
    description: "hypertrophy",
  },
  {
    value: "2-2-2-2",
    label: "metabolic",
    description: "metabolic",
  },
];

export const TempoSelector = forwardRef<BottomSheetModal, Props>(
  ({ selectedTempo, onSelect, onDismiss }, ref) => {
    const { colors, colorScheme } = useColorScheme();
    const isDark = colorScheme === "dark";
    const prefs = useUserPreferences();
    const lang = prefs?.language ?? "es";
    const t = tempoSelectorTranslations;

    // V2 Glassmorphism colors
    const sheetBg = isDark
      ? "rgba(20, 20, 25, 0.98)"
      : "rgba(255, 255, 255, 0.98)";
    const cardBg = isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.03)";

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
          backgroundColor: sheetBg,
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
        }}
        handleIndicatorStyle={{
          backgroundColor: isDark
            ? "rgba(255, 255, 255, 0.3)"
            : "rgba(0, 0, 0, 0.2)",
          width: 40,
          height: 4,
        }}
      >
        <BottomSheetScrollView
          style={{
            flex: 1,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Premium Header with Blur */}
          <BlurView
            intensity={Platform.OS === "ios" ? 60 : 0}
            tint={isDark ? "dark" : "light"}
            style={{
              paddingTop: 8,
              paddingBottom: 20,
              paddingHorizontal: 20,
              backgroundColor:
                Platform.OS === "android" ? sheetBg : "transparent",
            }}
          >
            {/* Close Button */}
            <TouchableOpacity
              onPress={handleDismiss}
              style={{
                position: "absolute",
                top: 8,
                right: 16,
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: cardBg,
                alignItems: "center",
                justifyContent: "center",
                zIndex: 10,
              }}
              activeOpacity={0.7}
            >
              <X size={18} color={colors.textMuted} />
            </TouchableOpacity>

            {/* Icon Badge */}
            <Animated.View
              entering={FadeInDown.duration(400).springify()}
              style={{
                alignSelf: "center",
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: colors.primary[500] + "20",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 12,
              }}
            >
              <Clock size={28} color={colors.primary[500]} />
            </Animated.View>

            <Typography
              variant="h3"
              weight="bold"
              style={{
                textAlign: "center",
                marginBottom: 4,
                color: colors.text,
              }}
            >
              {t.selectTempo[lang]}
            </Typography>

            <Typography
              variant="body2"
              color="textMuted"
              style={{ textAlign: "center" }}
            >
              {lang === "es"
                ? "Configura el ritmo de ejecución del ejercicio"
                : "Configure exercise execution tempo"}
            </Typography>

            {/* Current Tempo Display */}
            <Animated.View
              entering={FadeInDown.duration(400).delay(100).springify()}
              style={{
                backgroundColor: displayState.isEmpty
                  ? cardBg
                  : colors.primary[500] + "15",
                paddingHorizontal: 20,
                paddingVertical: 16,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: displayState.isEmpty
                  ? isDark
                    ? "rgba(255, 255, 255, 0.08)"
                    : "rgba(0, 0, 0, 0.06)"
                  : colors.primary[500] + "30",
                alignItems: "center",
                marginTop: 16,
              }}
            >
              {displayState.isEmpty ? (
                <>
                  <Typography
                    variant="body1"
                    weight="semibold"
                    style={{
                      color: colors.textMuted,
                      marginBottom: 4,
                    }}
                  >
                    {lang === "es" ? "Sin tempo asignado" : "No tempo assigned"}
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
                <>
                  <Typography
                    variant="body2"
                    weight="semibold"
                    style={{
                      color: colors.primary[500],
                      marginBottom: 4,
                    }}
                  >
                    {t.custom[lang]}
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
                  ? t.selectTempoForExercise[lang]
                  : lang === "es"
                  ? "Excéntrica - Pausa - Concéntrica - Pausa"
                  : "Eccentric - Pause - Concentric - Pause"}
              </Typography>
            </Animated.View>
          </BlurView>

          {/* Mode Toggle */}
          <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
            <View
              style={{
                flexDirection: "row",
                backgroundColor: cardBg,
                borderRadius: 14,
                padding: 4,
              }}
            >
              <TouchableOpacity
                onPress={() => setIsCustomMode(false)}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  borderRadius: 10,
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
                  borderRadius: 10,
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
                  {t.custom[lang]}
                </Typography>
              </TouchableOpacity>
            </View>
          </View>

          {/* Content */}
          <View style={{ paddingHorizontal: 20 }}>
            {!isCustomMode ? (
              <View style={{ gap: 10 }}>
                {PRESET_TEMPOS.map((preset, index) => {
                  // Verificar si este preset está seleccionado
                  const isSelected =
                    selectedTempo === preset.value ||
                    (!selectedTempo && currentTempoString === preset.value);
                  const tempoValues = parseTempoValues(preset.value);
                  console.log("Preset Tempo:", currentTempoString);
                  return (
                    <Animated.View
                      key={preset.value}
                      entering={FadeInDown.duration(300)
                        .delay(index * 40)
                        .springify()}
                    >
                      <TouchableOpacity
                        onPress={() => handlePresetSelect(preset.value)}
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          paddingVertical: 14,
                          paddingHorizontal: 16,
                          borderRadius: 16,
                          backgroundColor: isSelected
                            ? colors.primary[500] + "15"
                            : cardBg,
                          borderWidth: isSelected ? 1.5 : 1,
                          borderColor: isSelected
                            ? colors.primary[500] + "50"
                            : isDark
                            ? "rgba(255, 255, 255, 0.08)"
                            : "rgba(0, 0, 0, 0.06)",
                        }}
                        activeOpacity={0.7}
                      >
                        {/* Tempo Display */}
                        <View
                          style={{
                            width: 76,
                            height: 56,
                            borderRadius: 12,
                            backgroundColor: isSelected
                              ? colors.primary[500]
                              : isDark
                              ? "rgba(255, 255, 255, 0.08)"
                              : "rgba(0, 0, 0, 0.05)",
                            alignItems: "center",
                            justifyContent: "center",
                            marginRight: 14,
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
                              color: isSelected
                                ? colors.primary[500]
                                : colors.text,
                              marginBottom: 4,
                            }}
                          >
                            {
                              t.presets[preset.label as keyof typeof t.presets]
                                .label[lang]
                            }
                          </Typography>
                          <Typography
                            variant="body2"
                            color="textMuted"
                            style={{ marginBottom: 6, fontSize: 12 }}
                          >
                            {
                              t.presets[preset.label as keyof typeof t.presets]
                                .description[lang]
                            }
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
                    </Animated.View>
                  );
                })}
              </View>
            ) : (
              <View style={{ gap: 14 }}>
                {TEMPO_PHASES.map((phase, index) => {
                  const phaseKey = [
                    "eccentric",
                    "pause1",
                    "concentric",
                    "pause2",
                  ][index] as keyof TempoValues;
                  const value = localTempo[phaseKey];

                  return (
                    <Animated.View
                      key={String(phaseKey)}
                      entering={FadeInDown.duration(300)
                        .delay(index * 50)
                        .springify()}
                      style={{
                        backgroundColor: cardBg,
                        borderWidth: 1,
                        borderColor: isDark
                          ? "rgba(255, 255, 255, 0.08)"
                          : "rgba(0, 0, 0, 0.06)",
                        borderRadius: 16,
                        padding: 18,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginBottom: 14,
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
                            {
                              t.phases[
                                phase.description as keyof typeof t.phases
                              ][lang]
                            }
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
                            width: 46,
                            height: 46,
                            borderRadius: 23,
                            backgroundColor:
                              value > 0
                                ? phase.color
                                : isDark
                                ? "rgba(255, 255, 255, 0.1)"
                                : "rgba(0, 0, 0, 0.08)",
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
                            backgroundColor: isDark
                              ? "rgba(255, 255, 255, 0.08)"
                              : "rgba(0, 0, 0, 0.05)",
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
                            {lang === "es" ? "segundos" : "seconds"}
                          </Typography>
                        </View>

                        <TouchableOpacity
                          onPress={() => handleCustomTempoChange(phaseKey, 1)}
                          disabled={value >= 9}
                          style={{
                            width: 46,
                            height: 46,
                            borderRadius: 23,
                            backgroundColor:
                              value < 9
                                ? phase.color
                                : isDark
                                ? "rgba(255, 255, 255, 0.1)"
                                : "rgba(0, 0, 0, 0.08)",
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
                    </Animated.View>
                  );
                })}
              </View>
            )}
          </View>

          {/* Action Buttons */}
          <View
            style={{
              flexDirection: "row",
              gap: 12,
              paddingTop: 28,
              paddingHorizontal: 20,
              marginTop: 8,
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
                borderRadius: 14,
                backgroundColor: displayState.isEmpty
                  ? cardBg
                  : isDark
                  ? "rgba(239, 68, 68, 0.15)"
                  : "#fee2e2",
                borderWidth: 1,
                borderColor: displayState.isEmpty
                  ? isDark
                    ? "rgba(255, 255, 255, 0.08)"
                    : "rgba(0, 0, 0, 0.06)"
                  : isDark
                  ? "rgba(239, 68, 68, 0.3)"
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
                  color: displayState.isEmpty ? colors.textMuted : "#ef4444",
                }}
              >
                {t.delete[lang]}
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
                borderRadius: 14,
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
                {t.save[lang]}
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
