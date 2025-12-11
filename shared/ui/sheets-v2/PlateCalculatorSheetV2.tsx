import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { sharedUiTranslations as t } from "@/shared/translations/shared-ui";
import { toSupportedLanguage } from "@/shared/types/language";
import { Typography } from "@/shared/ui/typography";
import { fromKg, toKg, WeightUnit } from "@/shared/utils/weight-conversion";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BlurView } from "expo-blur";
import { Check, Disc, Plus, X } from "lucide-react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

// Storage keys
const STORAGE_KEY_BAR = "plate_calculator_bar_weight";
const STORAGE_KEY_PLATES = "plate_calculator_available_plates";
const STORAGE_KEY_CUSTOM_BAR = "plate_calculator_custom_bar_weight";
const STORAGE_KEY_CUSTOM_PLATES = "plate_calculator_custom_plates";

// Bar types with weights in kg
const BAR_TYPES = [
  { id: "standard", weight: 20, labelKey: "standardBar" as const },
  { id: "women", weight: 15, labelKey: "womenBar" as const },
  { id: "short", weight: 10, labelKey: "shortBar" as const },
  { id: "ez", weight: 7, labelKey: "ezBar" as const },
  { id: "none", weight: 0, labelKey: "noBarWeight" as const },
  { id: "custom", weight: -1, labelKey: "customBar" as const }, // -1 means use customBarWeight state
] as const;

// Available plate weights in kg
const ALL_PLATES = [25, 20, 15, 10, 5, 2.5, 1.25] as const;

// Soft/muted plate colors (pastel Olympic inspired)
const PLATE_COLORS: Record<number, string> = {
  25: "#D98880", // Muted red/coral
  20: "#7FB3D5", // Soft blue
  15: "#F7DC6F", // Soft yellow
  10: "#82C9A5", // Sage green
  5: "#E8E8E8", // Light gray (instead of pure white)
  2.5: "#D98880", // Muted red (small)
  1.25: "#F7DC6F", // Soft yellow (small)
};

type Props = {
  visible: boolean;
  currentWeight: number | null; // in kg (storage unit)
  weightUnit: WeightUnit;
  onApply: (weightKg: number) => void;
  onClose: () => void;
};

/**
 * Calculate plates needed for each side of the bar
 */
function calculatePlates(
  totalWeightKg: number,
  barWeightKg: number,
  availablePlates: number[]
): { plates: number[]; isPossible: boolean } {
  const weightPerSide = (totalWeightKg - barWeightKg) / 2;

  if (weightPerSide < 0) {
    return { plates: [], isPossible: false };
  }

  if (weightPerSide === 0) {
    return { plates: [], isPossible: true };
  }

  const sortedPlates = [...availablePlates].sort((a, b) => b - a);
  const result: number[] = [];
  let remaining = weightPerSide;

  for (const plate of sortedPlates) {
    while (remaining >= plate - 0.001) {
      result.push(plate);
      remaining -= plate;
    }
  }

  const isPossible = Math.abs(remaining) < 0.01;
  return { plates: result, isPossible };
}

export const PlateCalculatorSheetV2 = ({
  visible,
  currentWeight,
  weightUnit,
  onApply,
  onClose,
}: Props) => {
  const { colors, isDarkMode } = useColorScheme();
  const prefs = useUserPreferences();
  const lang = toSupportedLanguage(prefs?.language);

  // State
  const [inputText, setInputText] = useState("");
  const [selectedBarId, setSelectedBarId] = useState("standard");
  const [availablePlates, setAvailablePlates] = useState<number[]>([
    25, 20, 15, 10, 5, 2.5, 1.25,
  ]);
  const [customBarWeight, setCustomBarWeight] = useState<number>(0);
  const [customBarText, setCustomBarText] = useState("");
  const [customPlates, setCustomPlates] = useState<number[]>([]);
  const [customPlateText, setCustomPlateText] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  // Get bar weight
  const selectedBar = BAR_TYPES.find((b) => b.id === selectedBarId);
  const barWeightKg =
    selectedBarId === "custom" ? customBarWeight : selectedBar?.weight ?? 20;

  // Combine standard and custom plates
  const allAvailablePlates = [
    ...new Set([...availablePlates, ...customPlates]),
  ].sort((a, b) => b - a);

  // Parse input to kg
  const inputWeightKg = inputText
    ? toKg(parseFloat(inputText.replace(",", ".")), weightUnit)
    : currentWeight ?? 0;

  // Calculate plates
  const { plates, isPossible } = calculatePlates(
    inputWeightKg,
    barWeightKg,
    allAvailablePlates
  );

  // Load saved preferences
  useEffect(() => {
    const loadPrefs = async () => {
      try {
        const [savedBar, savedPlates, savedCustomBar, savedCustomPlates] =
          await Promise.all([
            AsyncStorage.getItem(STORAGE_KEY_BAR),
            AsyncStorage.getItem(STORAGE_KEY_PLATES),
            AsyncStorage.getItem(STORAGE_KEY_CUSTOM_BAR),
            AsyncStorage.getItem(STORAGE_KEY_CUSTOM_PLATES),
          ]);

        if (savedBar) setSelectedBarId(savedBar);
        if (savedPlates) setAvailablePlates(JSON.parse(savedPlates));
        if (savedCustomBar) {
          const weight = parseFloat(savedCustomBar);
          setCustomBarWeight(weight);
          setCustomBarText(weight > 0 ? weight.toString() : "");
        }
        if (savedCustomPlates) setCustomPlates(JSON.parse(savedCustomPlates));
      } catch (e) {
        console.warn("Error loading plate calculator prefs:", e);
      }
      setIsLoaded(true);
    };
    loadPrefs();
  }, []);

  // Save preferences when changed
  const saveBarType = useCallback(async (barId: string) => {
    setSelectedBarId(barId);
    try {
      await AsyncStorage.setItem(STORAGE_KEY_BAR, barId);
    } catch (e) {
      console.warn("Error saving bar type:", e);
    }
  }, []);

  const saveCustomBarWeight = useCallback(async (weight: number) => {
    setCustomBarWeight(weight);
    try {
      await AsyncStorage.setItem(STORAGE_KEY_CUSTOM_BAR, weight.toString());
    } catch (e) {
      console.warn("Error saving custom bar weight:", e);
    }
  }, []);

  const addCustomPlate = useCallback(
    async (plateWeight: number) => {
      if (plateWeight <= 0) return;
      const newCustomPlates = [...customPlates, plateWeight].sort(
        (a, b) => b - a
      );
      setCustomPlates(newCustomPlates);
      try {
        await AsyncStorage.setItem(
          STORAGE_KEY_CUSTOM_PLATES,
          JSON.stringify(newCustomPlates)
        );
      } catch (e) {
        console.warn("Error saving custom plates:", e);
      }
    },
    [customPlates]
  );

  const removeCustomPlate = useCallback(
    async (plateWeight: number) => {
      const newCustomPlates = customPlates.filter((p) => p !== plateWeight);
      setCustomPlates(newCustomPlates);
      try {
        await AsyncStorage.setItem(
          STORAGE_KEY_CUSTOM_PLATES,
          JSON.stringify(newCustomPlates)
        );
      } catch (e) {
        console.warn("Error saving custom plates:", e);
      }
    },
    [customPlates]
  );

  const togglePlate = useCallback(
    async (plate: number) => {
      const newPlates = availablePlates.includes(plate)
        ? availablePlates.filter((p) => p !== plate)
        : [...availablePlates, plate].sort((a, b) => b - a);

      setAvailablePlates(newPlates);
      try {
        await AsyncStorage.setItem(
          STORAGE_KEY_PLATES,
          JSON.stringify(newPlates)
        );
      } catch (e) {
        console.warn("Error saving available plates:", e);
      }
    },
    [availablePlates]
  );

  // Initialize input text when opening
  useEffect(() => {
    if (visible && currentWeight) {
      const displayWeight = fromKg(currentWeight, weightUnit, 1);
      setInputText(displayWeight > 0 ? displayWeight.toString() : "");
    }
  }, [visible, currentWeight, weightUnit]);

  // Animations
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

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
      ]).start();
    } else {
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
  }, [visible, slideAnim, backdropAnim]);

  const handleApply = useCallback(() => {
    if (inputWeightKg > 0) {
      onApply(inputWeightKg);
    }
    onClose();
  }, [inputWeightKg, onApply, onClose]);

  // Format plates for display
  const formatPlatesText = (platesArr: number[]): string => {
    if (platesArr.length === 0) return "-";

    const grouped: { weight: number; count: number }[] = [];
    for (const plate of platesArr) {
      const last = grouped[grouped.length - 1];
      if (last && last.weight === plate) {
        last.count++;
      } else {
        grouped.push({ weight: plate, count: 1 });
      }
    }

    return grouped
      .map((g) => (g.count > 1 ? `${g.count}×${g.weight}` : `${g.weight}`))
      .join(" + ");
  };

  if (!isLoaded) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
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
                <Disc size={22} color={colors.primary[500]} />
              </View>
              <View style={styles.headerText}>
                <Typography
                  variant="h4"
                  weight="bold"
                  style={{ color: colors.text }}
                >
                  {t.plateCalculator[lang]}
                </Typography>
                <Typography
                  variant="caption"
                  color="textMuted"
                  style={{ marginTop: 4 }}
                >
                  {t.totalWeightLabel[lang]}
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

          <ScrollView
            showsVerticalScrollIndicator={false}
            bounces={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Weight Input */}
            <View style={styles.selectorContainer}>
              <View
                style={[
                  styles.weightInputContainer,
                  {
                    backgroundColor: isDarkMode
                      ? "rgba(255,255,255,0.04)"
                      : "rgba(0,0,0,0.02)",
                    borderColor: `${colors.primary[500]}30`,
                  },
                ]}
              >
                <TextInput
                  style={[
                    styles.weightInput,
                    {
                      color: colors.primary[500],
                    },
                  ]}
                  value={inputText}
                  onChangeText={setInputText}
                  keyboardType="decimal-pad"
                  placeholder="0"
                  placeholderTextColor={colors.textMuted}
                />
                <Typography variant="h4" weight="medium" color="textMuted">
                  {weightUnit}
                </Typography>
              </View>
            </View>

            {/* Bar Visualization */}
            <View style={styles.visualizationContainer}>
              <View style={styles.barbellContainer}>
                {/* Left plates */}
                <View style={styles.platesStack}>
                  {[...plates].reverse().map((plate, index) => (
                    <View
                      key={`left-${index}`}
                      style={[
                        styles.plateVisual,
                        {
                          backgroundColor: PLATE_COLORS[plate] || "#888",
                          height: Math.max(24, 32 + plate * 1.2),
                          width: plate >= 10 ? 10 : 7,
                          borderColor:
                            plate === 5
                              ? isDarkMode
                                ? "rgba(255,255,255,0.3)"
                                : "rgba(0,0,0,0.2)"
                              : "transparent",
                          borderWidth: plate === 5 ? 1 : 0,
                        },
                      ]}
                    />
                  ))}
                </View>

                {/* Bar */}
                <View
                  style={[
                    styles.barVisual,
                    {
                      backgroundColor: isDarkMode ? "#555" : "#999",
                    },
                  ]}
                />

                {/* Right plates */}
                <View style={styles.platesStack}>
                  {plates.map((plate, index) => (
                    <View
                      key={`right-${index}`}
                      style={[
                        styles.plateVisual,
                        {
                          backgroundColor: PLATE_COLORS[plate] || "#888",
                          height: Math.max(24, 32 + plate * 1.2),
                          width: plate >= 10 ? 10 : 7,
                          borderColor:
                            plate === 5
                              ? isDarkMode
                                ? "rgba(255,255,255,0.3)"
                                : "rgba(0,0,0,0.2)"
                              : "transparent",
                          borderWidth: plate === 5 ? 1 : 0,
                        },
                      ]}
                    />
                  ))}
                </View>
              </View>

              {/* Each side text */}
              <View style={styles.eachSideContainer}>
                <Typography variant="caption" color="textMuted">
                  {t.eachSide[lang]}:{" "}
                </Typography>
                <Typography
                  variant="caption"
                  weight="bold"
                  style={{ color: colors.text }}
                >
                  {isPossible ? formatPlatesText(plates) : "-"}
                </Typography>
                {isPossible && plates.length > 0 && (
                  <Typography variant="caption" color="textMuted">
                    {" "}
                    {weightUnit}
                  </Typography>
                )}
              </View>

              {!isPossible && inputWeightKg > barWeightKg && (
                <Typography
                  variant="caption"
                  style={{
                    color: "#EF4444",
                    textAlign: "center",
                    marginTop: 8,
                  }}
                >
                  {t.impossibleWeight[lang]}
                </Typography>
              )}
            </View>

            {/* Bar Type Selector */}
            <View style={styles.optionsContainer}>
              <Typography
                variant="caption"
                weight="medium"
                color="textMuted"
                style={{ marginBottom: 12, marginLeft: 4 }}
              >
                {t.barType[lang]}
              </Typography>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.optionsScroll}
              >
                {BAR_TYPES.map((bar) => {
                  const isSelected = selectedBarId === bar.id;
                  const isCustom = bar.id === "custom";
                  const displayLabel =
                    isCustom && customBarWeight > 0
                      ? `${t[bar.labelKey][lang]} (${customBarWeight}kg)`
                      : t[bar.labelKey][lang];
                  return (
                    <Pressable
                      key={bar.id}
                      onPress={() => saveBarType(bar.id)}
                      style={({ pressed }) => [
                        styles.optionChip,
                        {
                          backgroundColor: isSelected
                            ? colors.primary[500]
                            : isDarkMode
                            ? "rgba(255,255,255,0.06)"
                            : "rgba(0,0,0,0.04)",
                          borderColor: isSelected
                            ? colors.primary[500]
                            : isDarkMode
                            ? "rgba(255,255,255,0.1)"
                            : "rgba(0,0,0,0.08)",
                          opacity: pressed ? 0.8 : 1,
                        },
                      ]}
                    >
                      <Typography
                        variant="caption"
                        weight="semibold"
                        style={{
                          color: isSelected ? "#fff" : colors.text,
                        }}
                      >
                        {displayLabel}
                      </Typography>
                    </Pressable>
                  );
                })}
              </ScrollView>

              {/* Custom bar weight input */}
              {selectedBarId === "custom" && (
                <View style={[styles.customInputRow, { marginTop: 12 }]}>
                  <TextInput
                    style={[
                      styles.customInput,
                      {
                        color: colors.text,
                        backgroundColor: isDarkMode
                          ? "rgba(255,255,255,0.06)"
                          : "rgba(0,0,0,0.04)",
                        borderColor: isDarkMode
                          ? "rgba(255,255,255,0.1)"
                          : "rgba(0,0,0,0.08)",
                      },
                    ]}
                    value={customBarText}
                    onChangeText={(text) => {
                      setCustomBarText(text);
                      const weight = parseFloat(text.replace(",", "."));
                      if (!isNaN(weight) && weight >= 0) {
                        saveCustomBarWeight(weight);
                      }
                    }}
                    keyboardType="decimal-pad"
                    placeholder="0"
                    placeholderTextColor={colors.textMuted}
                  />
                  <Typography
                    variant="caption"
                    color="textMuted"
                    style={{ marginLeft: 8 }}
                  >
                    kg
                  </Typography>
                </View>
              )}
            </View>

            {/* Available Plates */}
            <View style={styles.optionsContainer}>
              <Typography
                variant="caption"
                weight="medium"
                color="textMuted"
                style={{ marginBottom: 12, marginLeft: 4 }}
              >
                {t.availablePlates[lang]}
              </Typography>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.optionsScroll}
              >
                {ALL_PLATES.map((plate) => {
                  const isSelected = availablePlates.includes(plate);
                  const plateColor = PLATE_COLORS[plate];
                  const isWhitePlate = plate === 5;

                  return (
                    <Pressable
                      key={plate}
                      onPress={() => togglePlate(plate)}
                      style={({ pressed }) => [
                        styles.plateChip,
                        {
                          backgroundColor: isSelected
                            ? plateColor
                            : isDarkMode
                            ? "rgba(255,255,255,0.06)"
                            : "rgba(0,0,0,0.04)",
                          borderColor: isSelected
                            ? isWhitePlate
                              ? isDarkMode
                                ? "rgba(255,255,255,0.3)"
                                : "rgba(0,0,0,0.2)"
                              : plateColor
                            : isDarkMode
                            ? "rgba(255,255,255,0.1)"
                            : "rgba(0,0,0,0.08)",
                          opacity: pressed ? 0.8 : 1,
                        },
                      ]}
                    >
                      {isSelected && (
                        <Check
                          size={12}
                          color={isWhitePlate ? "#333" : "#fff"}
                          strokeWidth={3}
                        />
                      )}
                      <Typography
                        variant="caption"
                        weight="bold"
                        style={{
                          color: isSelected
                            ? isWhitePlate
                              ? "#333"
                              : "#fff"
                            : colors.text,
                        }}
                      >
                        {plate}
                      </Typography>
                    </Pressable>
                  );
                })}
              </ScrollView>

              {/* Custom plates */}
              {customPlates.length > 0 && (
                <View style={[styles.customPlatesRow, { marginTop: 12 }]}>
                  {customPlates.map((plate) => (
                    <Pressable
                      key={`custom-${plate}`}
                      onPress={() => removeCustomPlate(plate)}
                      style={({ pressed }) => [
                        styles.customPlateChip,
                        {
                          backgroundColor: colors.primary[500],
                          opacity: pressed ? 0.8 : 1,
                        },
                      ]}
                    >
                      <Typography
                        variant="caption"
                        weight="bold"
                        style={{ color: "#fff" }}
                      >
                        {plate}
                      </Typography>
                      <X
                        size={12}
                        color="#fff"
                        strokeWidth={3}
                        style={{ marginLeft: 4 }}
                      />
                    </Pressable>
                  ))}
                </View>
              )}

              {/* Add custom plate */}
              <View style={[styles.customInputRow, { marginTop: 12 }]}>
                <TextInput
                  style={[
                    styles.customInput,
                    {
                      color: colors.text,
                      backgroundColor: isDarkMode
                        ? "rgba(255,255,255,0.06)"
                        : "rgba(0,0,0,0.04)",
                      borderColor: isDarkMode
                        ? "rgba(255,255,255,0.1)"
                        : "rgba(0,0,0,0.08)",
                    },
                  ]}
                  value={customPlateText}
                  onChangeText={setCustomPlateText}
                  keyboardType="decimal-pad"
                  placeholder={t.addCustomPlate[lang]}
                  placeholderTextColor={colors.textMuted}
                />
                <Typography
                  variant="caption"
                  color="textMuted"
                  style={{ marginLeft: 8, marginRight: 8 }}
                >
                  kg
                </Typography>
                <Pressable
                  onPress={() => {
                    const weight = parseFloat(
                      customPlateText.replace(",", ".")
                    );
                    if (!isNaN(weight) && weight > 0) {
                      addCustomPlate(weight);
                      setCustomPlateText("");
                    }
                  }}
                  style={({ pressed }) => [
                    styles.addPlateButton,
                    {
                      backgroundColor: colors.primary[500],
                      opacity: pressed ? 0.8 : 1,
                    },
                  ]}
                >
                  <Plus size={18} color="#fff" strokeWidth={3} />
                </Pressable>
              </View>
            </View>

            <View style={{ height: 16 }} />
          </ScrollView>

          {/* Apply Button */}
          <View style={styles.applyContainer}>
            <Pressable
              onPress={handleApply}
              disabled={!isPossible || inputWeightKg <= 0}
              style={({ pressed }) => [
                styles.applyButton,
                {
                  backgroundColor:
                    isPossible && inputWeightKg > 0
                      ? colors.primary[500]
                      : isDarkMode
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(0,0,0,0.1)",
                  opacity: pressed ? 0.9 : 1,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                },
              ]}
            >
              <Typography
                variant="body1"
                weight="semibold"
                style={{
                  color:
                    isPossible && inputWeightKg > 0 ? "#fff" : colors.textMuted,
                }}
              >
                {t.applyWeight[lang]}
              </Typography>
            </Pressable>
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
  },
  sheetContent: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: "hidden",
    maxHeight: SCREEN_HEIGHT * 0.85,
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
    paddingBottom: 20,
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
  selectorContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  weightInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    borderWidth: 2,
    padding: 16,
    gap: 8,
  },
  weightInput: {
    fontSize: 36,
    fontWeight: "700",
    textAlign: "center",
    minWidth: 100,
    paddingVertical: 0,
  },
  visualizationContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  barbellContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    gap: 2,
    minHeight: 80,
  },
  platesStack: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  plateVisual: {
    borderRadius: 2,
  },
  barVisual: {
    width: 80,
    height: 10,
    borderRadius: 5,
  },
  eachSideContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  optionsContainer: {
    paddingLeft: 20,
    marginBottom: 20,
  },
  optionsScroll: {
    paddingRight: 20,
    gap: 8,
  },
  optionChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
  },
  plateChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    minWidth: 48,
    justifyContent: "center",
  },
  applyContainer: {
    paddingHorizontal: 20,
  },
  applyButton: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  customInputRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 20,
  },
  customInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
  },
  customPlatesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingRight: 20,
    gap: 8,
  },
  customPlateChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
  },
  addPlateButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
});
