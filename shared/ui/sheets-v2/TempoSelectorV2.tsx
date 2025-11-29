import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { tempoSelectorTranslations } from "@/shared/translations/tempo-selector";
import { Typography } from "@/shared/ui/typography";
import { BlurView } from "expo-blur";
import {
  ArrowDown,
  ArrowUp,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Clock,
  Pause,
  Square,
  Trash2,
  X,
} from "lucide-react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface TempoPhase {
  name: { es: string; en: string };
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

type Props = {
  visible: boolean;
  selectedTempo?: string | null;
  onSelect: (tempo: string | null) => void;
  onClose: () => void;
};

const TEMPO_PHASES: TempoPhase[] = [
  {
    name: { es: "Excéntrica", en: "Eccentric" },
    description: "eccentric",
    color: "#22C55E",
    icon: "ArrowDown",
  },
  {
    name: { es: "Pausa Inferior", en: "Bottom Pause" },
    description: "pause1",
    color: "#F59E0B",
    icon: "Pause",
  },
  {
    name: { es: "Concéntrica", en: "Concentric" },
    description: "concentric",
    color: "#EF4444",
    icon: "ArrowUp",
  },
  {
    name: { es: "Pausa Superior", en: "Top Pause" },
    description: "pause2",
    color: "#F59E0B",
    icon: "Square",
  },
];

const PRESET_TEMPOS = [
  { value: "2-0-2-0", label: "standard" },
  { value: "3-1-2-1", label: "strength" },
  { value: "4-2-1-0", label: "eccentric" },
  { value: "1-0-3-1", label: "explosive" },
  { value: "5-3-2-2", label: "hypertrophy" },
  { value: "2-2-2-2", label: "metabolic" },
];

export const TempoSelectorV2 = ({
  visible,
  selectedTempo,
  onSelect,
  onClose,
}: Props) => {
  const { colors, isDarkMode } = useColorScheme();
  const prefs = useUserPreferences();
  const lang = (prefs?.language ?? "es") as "es" | "en";
  const t = tempoSelectorTranslations;

  const [isCustomMode, setIsCustomMode] = useState(false);
  const [localTempo, setLocalTempo] = useState<TempoValues>({
    eccentric: 2,
    pause1: 0,
    concentric: 2,
    pause2: 0,
  });

  // Animations
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;
  const optionsAnim = useRef(
    PRESET_TEMPOS.map(() => new Animated.Value(0))
  ).current;

  // Parse tempo string to values
  const parseTempoValues = useCallback((tempo: string = "2-0-2-0") => {
    const values = tempo.split("-").map(Number);
    return {
      eccentric: values[0] || 2,
      pause1: values[1] || 0,
      concentric: values[2] || 2,
      pause2: values[3] || 0,
    };
  }, []);

  // Sync local state when visible or selectedTempo changes
  useEffect(() => {
    if (visible && selectedTempo) {
      setLocalTempo(parseTempoValues(selectedTempo));
    }
  }, [visible, selectedTempo, parseTempoValues]);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 65,
          friction: 11,
          useNativeDriver: true,
        }),
      ]).start(() => {
        Animated.stagger(
          30,
          optionsAnim.map((anim) =>
            Animated.spring(anim, {
              toValue: 1,
              tension: 100,
              friction: 8,
              useNativeDriver: true,
            })
          )
        ).start();
      });
    } else {
      optionsAnim.forEach((anim) => anim.setValue(0));
      Animated.parallel([
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: SCREEN_HEIGHT,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, backdropAnim, slideAnim, optionsAnim]);

  const formatTempo = useCallback((values: TempoValues) => {
    return `${values.eccentric}-${values.pause1}-${values.concentric}-${values.pause2}`;
  }, []);

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

  const handlePresetSelect = (tempo: string) => {
    onSelect(tempo);
    onClose();
  };

  const handleCustomTempoChange = (phase: keyof TempoValues, delta: number) => {
    setLocalTempo((prev) => {
      const newValue = Math.max(0, Math.min(9, prev[phase] + delta));
      return { ...prev, [phase]: newValue };
    });
  };

  const handleApplyCustom = () => {
    onSelect(formatTempo(localTempo));
    onClose();
  };

  const handleClear = () => {
    onSelect(null);
    onClose();
  };

  const currentTempoString = formatTempo(localTempo);
  const matchingPreset = PRESET_TEMPOS.find(
    (preset) => preset.value === selectedTempo
  );
  const hasSelectedTempo = !!selectedTempo;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      {/* Backdrop */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: "rgba(0,0,0,0.6)",
            opacity: backdropAnim,
          },
        ]}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      {/* Sheet */}
      <Animated.View
        style={[
          styles.sheet,
          {
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View
          style={[
            styles.sheetContent,
            {
              backgroundColor: isDarkMode
                ? "rgba(20, 20, 25, 0.95)"
                : "rgba(255, 255, 255, 0.98)",
            },
          ]}
        >
          {Platform.OS === "ios" && (
            <BlurView
              intensity={isDarkMode ? 40 : 60}
              tint={isDarkMode ? "dark" : "light"}
              style={StyleSheet.absoluteFill}
            />
          )}

          {/* Handle */}
          <View style={styles.handleContainer}>
            <View
              style={[
                styles.handle,
                {
                  backgroundColor: isDarkMode
                    ? "rgba(255,255,255,0.2)"
                    : "rgba(0,0,0,0.15)",
                },
              ]}
            />
          </View>

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerInfo}>
              <View
                style={[
                  styles.headerIcon,
                  { backgroundColor: `${colors.primary[500]}20` },
                ]}
              >
                <Clock size={22} color={colors.primary[500]} />
              </View>
              <View style={styles.headerText}>
                <Typography
                  variant="h4"
                  weight="bold"
                  style={{ color: colors.text }}
                >
                  {t.selectTempo[lang]}
                </Typography>
                <Typography
                  variant="caption"
                  color="textMuted"
                  style={{ marginTop: 4 }}
                >
                  {lang === "es"
                    ? "Configura el ritmo de ejecución"
                    : "Configure execution tempo"}
                </Typography>
              </View>
            </View>
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [
                styles.closeButton,
                {
                  backgroundColor: isDarkMode
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.05)",
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <X size={20} color={colors.textMuted} />
            </Pressable>
          </View>

          {/* Current Tempo Display */}
          <View style={styles.currentTempoContainer}>
            <View
              style={[
                styles.currentTempoCard,
                {
                  backgroundColor: hasSelectedTempo
                    ? `${colors.primary[500]}15`
                    : isDarkMode
                    ? "rgba(255,255,255,0.04)"
                    : "rgba(0,0,0,0.02)",
                  borderColor: hasSelectedTempo
                    ? colors.primary[500]
                    : isDarkMode
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(0,0,0,0.06)",
                },
              ]}
            >
              {hasSelectedTempo ? (
                <>
                  {matchingPreset && (
                    <Typography
                      variant="caption"
                      weight="semibold"
                      style={{ color: colors.primary[500], marginBottom: 4 }}
                    >
                      🎯{" "}
                      {
                        t.presets[
                          matchingPreset.label as keyof typeof t.presets
                        ].label[lang]
                      }
                    </Typography>
                  )}
                  <Typography
                    variant="h2"
                    weight="bold"
                    style={{
                      color: colors.primary[500],
                      fontFamily: "monospace",
                      letterSpacing: 2,
                    }}
                  >
                    {selectedTempo}
                  </Typography>
                </>
              ) : (
                <>
                  <Typography
                    variant="body2"
                    weight="medium"
                    style={{ color: colors.textMuted, marginBottom: 4 }}
                  >
                    {lang === "es" ? "Sin tempo asignado" : "No tempo assigned"}
                  </Typography>
                  <Typography
                    variant="h3"
                    weight="bold"
                    style={{ color: colors.border, letterSpacing: 4 }}
                  >
                    - - - -
                  </Typography>
                </>
              )}
              <Typography
                variant="caption"
                color="textMuted"
                style={{ marginTop: 6 }}
              >
                {lang === "es"
                  ? "Excéntrica - Pausa - Concéntrica - Pausa"
                  : "Eccentric - Pause - Concentric - Pause"}
              </Typography>
            </View>
          </View>

          {/* Mode Toggle */}
          <View style={styles.modeToggleContainer}>
            <View
              style={[
                styles.modeToggle,
                {
                  backgroundColor: isDarkMode
                    ? "rgba(255,255,255,0.04)"
                    : "rgba(0,0,0,0.02)",
                },
              ]}
            >
              <Pressable
                onPress={() => setIsCustomMode(false)}
                style={({ pressed }) => [
                  styles.modeButton,
                  {
                    backgroundColor: !isCustomMode
                      ? colors.primary[500]
                      : "transparent",
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <Typography
                  variant="body2"
                  weight="semibold"
                  style={{ color: !isCustomMode ? "#fff" : colors.textMuted }}
                >
                  Presets
                </Typography>
              </Pressable>

              <Pressable
                onPress={() => setIsCustomMode(true)}
                style={({ pressed }) => [
                  styles.modeButton,
                  {
                    backgroundColor: isCustomMode
                      ? colors.primary[500]
                      : "transparent",
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <Typography
                  variant="body2"
                  weight="semibold"
                  style={{ color: isCustomMode ? "#fff" : colors.textMuted }}
                >
                  {t.custom[lang]}
                </Typography>
              </Pressable>
            </View>
          </View>

          {/* Content */}
          <ScrollView
            style={styles.contentScroll}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            {!isCustomMode ? (
              // Presets List
              <View style={styles.presetsList}>
                {PRESET_TEMPOS.map((preset, index) => {
                  const isSelected = selectedTempo === preset.value;
                  const tempoValues = parseTempoValues(preset.value);

                  const animatedStyle = {
                    opacity: optionsAnim[index] || new Animated.Value(1),
                    transform: [
                      {
                        translateY: (
                          optionsAnim[index] || new Animated.Value(1)
                        ).interpolate({
                          inputRange: [0, 1],
                          outputRange: [20, 0],
                        }),
                      },
                      {
                        scale: (
                          optionsAnim[index] || new Animated.Value(1)
                        ).interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.95, 1],
                        }),
                      },
                    ],
                  };

                  return (
                    <Animated.View key={preset.value} style={animatedStyle}>
                      <Pressable
                        onPress={() => handlePresetSelect(preset.value)}
                        style={({ pressed }) => [
                          styles.presetCard,
                          {
                            backgroundColor: isSelected
                              ? `${colors.primary[500]}15`
                              : isDarkMode
                              ? "rgba(255,255,255,0.04)"
                              : "rgba(0,0,0,0.02)",
                            borderColor: isSelected
                              ? colors.primary[500]
                              : isDarkMode
                              ? "rgba(255,255,255,0.08)"
                              : "rgba(0,0,0,0.06)",
                            opacity: pressed ? 0.8 : 1,
                            transform: [{ scale: pressed ? 0.98 : 1 }],
                          },
                        ]}
                      >
                        {/* Tempo Badge */}
                        <View
                          style={[
                            styles.tempoBadge,
                            {
                              backgroundColor: isSelected
                                ? colors.primary[500]
                                : isDarkMode
                                ? "rgba(255,255,255,0.08)"
                                : "rgba(0,0,0,0.05)",
                            },
                          ]}
                        >
                          <Typography
                            variant="body2"
                            weight="bold"
                            style={{
                              color: isSelected ? "#fff" : colors.text,
                              fontFamily: "monospace",
                              fontSize: 13,
                            }}
                          >
                            {preset.value}
                          </Typography>
                        </View>

                        {/* Info */}
                        <View style={styles.presetInfo}>
                          <Typography
                            variant="body1"
                            weight={isSelected ? "semibold" : "medium"}
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

                          {/* Phase indicators */}
                          <View style={styles.phaseIndicators}>
                            {TEMPO_PHASES.map((phase, phaseIndex) => {
                              const phaseValue =
                                Object.values(tempoValues)[phaseIndex];
                              if (phaseValue === 0) return null;

                              return (
                                <View
                                  key={phaseIndex}
                                  style={[
                                    styles.phaseChip,
                                    { backgroundColor: `${phase.color}20` },
                                  ]}
                                >
                                  {renderPhaseIcon(phase.icon, 10, phase.color)}
                                  <Typography
                                    variant="caption"
                                    style={{
                                      color: phase.color,
                                      fontSize: 10,
                                      fontWeight: "600",
                                      marginLeft: 3,
                                    }}
                                  >
                                    {phaseValue}s
                                  </Typography>
                                </View>
                              );
                            })}
                          </View>
                        </View>

                        {/* Check or Arrow */}
                        {isSelected ? (
                          <View
                            style={[
                              styles.checkIcon,
                              { backgroundColor: colors.primary[500] },
                            ]}
                          >
                            <Check size={14} color="#fff" strokeWidth={3} />
                          </View>
                        ) : (
                          <View
                            style={[
                              styles.arrowContainer,
                              {
                                backgroundColor: isDarkMode
                                  ? "rgba(255,255,255,0.05)"
                                  : "rgba(0,0,0,0.03)",
                              },
                            ]}
                          >
                            <ChevronRight size={16} color={colors.textMuted} />
                          </View>
                        )}
                      </Pressable>
                    </Animated.View>
                  );
                })}
              </View>
            ) : (
              // Custom Mode
              <View style={styles.customContainer}>
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
                      key={phaseKey}
                      style={[
                        styles.customPhaseCard,
                        {
                          backgroundColor: isDarkMode
                            ? "rgba(255,255,255,0.04)"
                            : "rgba(0,0,0,0.02)",
                          borderColor: isDarkMode
                            ? "rgba(255,255,255,0.08)"
                            : "rgba(0,0,0,0.06)",
                        },
                      ]}
                    >
                      <View style={styles.customPhaseHeader}>
                        <View
                          style={[
                            styles.customPhaseIcon,
                            { backgroundColor: `${phase.color}20` },
                          ]}
                        >
                          {renderPhaseIcon(phase.icon, 18, phase.color)}
                        </View>
                        <View style={styles.customPhaseInfo}>
                          <Typography
                            variant="body1"
                            weight="semibold"
                            style={{ color: phase.color }}
                          >
                            {phase.name[lang]}
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

                      <View style={styles.customControls}>
                        <Pressable
                          onPress={() => handleCustomTempoChange(phaseKey, -1)}
                          disabled={value <= 0}
                          style={({ pressed }) => [
                            styles.customControlBtn,
                            {
                              backgroundColor:
                                value > 0
                                  ? phase.color
                                  : isDarkMode
                                  ? "rgba(255,255,255,0.1)"
                                  : "rgba(0,0,0,0.08)",
                              opacity: value > 0 ? (pressed ? 0.8 : 1) : 0.5,
                            },
                          ]}
                        >
                          <ChevronDown
                            size={22}
                            color={value > 0 ? "#fff" : colors.textMuted}
                          />
                        </Pressable>

                        <View
                          style={[
                            styles.customValueDisplay,
                            {
                              backgroundColor: isDarkMode
                                ? "rgba(255,255,255,0.08)"
                                : "rgba(0,0,0,0.05)",
                            },
                          ]}
                        >
                          <Typography
                            variant="h3"
                            weight="bold"
                            style={{
                              color: colors.text,
                              fontFamily: "monospace",
                            }}
                          >
                            {value}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="textMuted"
                            style={{ fontSize: 10 }}
                          >
                            {lang === "es" ? "seg" : "sec"}
                          </Typography>
                        </View>

                        <Pressable
                          onPress={() => handleCustomTempoChange(phaseKey, 1)}
                          disabled={value >= 9}
                          style={({ pressed }) => [
                            styles.customControlBtn,
                            {
                              backgroundColor:
                                value < 9
                                  ? phase.color
                                  : isDarkMode
                                  ? "rgba(255,255,255,0.1)"
                                  : "rgba(0,0,0,0.08)",
                              opacity: value < 9 ? (pressed ? 0.8 : 1) : 0.5,
                            },
                          ]}
                        >
                          <ChevronUp
                            size={22}
                            color={value < 9 ? "#fff" : colors.textMuted}
                          />
                        </Pressable>
                      </View>
                    </View>
                  );
                })}

                {/* Custom Tempo Preview */}
                <View
                  style={[
                    styles.customPreview,
                    {
                      backgroundColor: `${colors.primary[500]}15`,
                      borderColor: colors.primary[500],
                    },
                  ]}
                >
                  <Typography
                    variant="caption"
                    weight="medium"
                    style={{ color: colors.primary[500], marginBottom: 4 }}
                  >
                    {t.custom[lang]}
                  </Typography>
                  <Typography
                    variant="h3"
                    weight="bold"
                    style={{
                      color: colors.primary[500],
                      fontFamily: "monospace",
                      letterSpacing: 2,
                    }}
                  >
                    {currentTempoString}
                  </Typography>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.actionsContainer}>
            {/* Delete Button */}
            <Pressable
              onPress={handleClear}
              disabled={!hasSelectedTempo}
              style={({ pressed }) => [
                styles.actionButton,
                styles.deleteButton,
                {
                  backgroundColor: hasSelectedTempo
                    ? isDarkMode
                      ? "rgba(239, 68, 68, 0.15)"
                      : "#fee2e2"
                    : isDarkMode
                    ? "rgba(255,255,255,0.04)"
                    : "rgba(0,0,0,0.02)",
                  borderColor: hasSelectedTempo
                    ? isDarkMode
                      ? "rgba(239, 68, 68, 0.3)"
                      : "#fecaca"
                    : isDarkMode
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(0,0,0,0.06)",
                  opacity: hasSelectedTempo ? (pressed ? 0.8 : 1) : 0.5,
                },
              ]}
            >
              <Trash2
                size={18}
                color={hasSelectedTempo ? "#ef4444" : colors.textMuted}
              />
              <Typography
                variant="body2"
                weight="semibold"
                style={{
                  color: hasSelectedTempo ? "#ef4444" : colors.textMuted,
                  marginLeft: 8,
                }}
              >
                {t.delete[lang]}
              </Typography>
            </Pressable>

            {/* Apply Button (only in custom mode) */}
            {isCustomMode && (
              <Pressable
                onPress={handleApplyCustom}
                style={({ pressed }) => [
                  styles.actionButton,
                  styles.applyButton,
                  {
                    backgroundColor: colors.primary[500],
                    opacity: pressed ? 0.9 : 1,
                  },
                ]}
              >
                <Typography
                  variant="body1"
                  weight="semibold"
                  style={{ color: "#fff" }}
                >
                  {t.save[lang]}
                </Typography>
              </Pressable>
            )}
          </View>

          <View style={{ height: 20 }} />
        </View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: "90%",
  },
  sheetContent: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: "hidden",
  },
  handleContainer: {
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 8,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  headerInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 12,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    flex: 1,
    marginLeft: 14,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  currentTempoContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  currentTempoCard: {
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderWidth: 1,
  },
  modeToggleContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  modeToggle: {
    flexDirection: "row",
    borderRadius: 14,
    padding: 4,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  contentScroll: {
    flex: 1,
    maxHeight: 320,
    paddingHorizontal: 16,
  },
  presetsList: {
    gap: 10,
  },
  presetCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  tempoBadge: {
    width: 72,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  presetInfo: {
    flex: 1,
    marginLeft: 14,
  },
  phaseIndicators: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  phaseChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  checkIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  arrowContainer: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  customContainer: {
    gap: 12,
  },
  customPhaseCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  customPhaseHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  customPhaseIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  customPhaseInfo: {
    flex: 1,
    marginLeft: 12,
  },
  customControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  customControlBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  customValueDisplay: {
    minWidth: 70,
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  customPreview: {
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 4,
  },
  actionsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  deleteButton: {
    flex: 1,
  },
  applyButton: {
    flex: 1,
    borderWidth: 0,
  },
});
