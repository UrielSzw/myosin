import {
  MacroTargetWithCalories,
  calculateCalories,
} from "@/shared/db/schema/macros";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useAuth } from "@/shared/providers/auth-provider";
import { macrosTranslations as t } from "@/shared/translations/macros";
import type { SupportedLanguage } from "@/shared/types/language";
import { Typography } from "@/shared/ui/typography";
import { BlurView } from "expo-blur";
import { Beef, Droplets, Flame, Target, Wheat, X } from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Animated, {
  FadeInDown,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  useSetMacroTargets,
  useUpdateMacroTargets,
} from "../hooks/use-macro-data";

type MacroSetupModalProps = {
  visible: boolean;
  onClose: () => void;
  lang: SupportedLanguage;
  existingTarget?: MacroTargetWithCalories;
};

const MACRO_COLORS = {
  protein: "#EF4444",
  carbs: "#F59E0B",
  fats: "#3B82F6",
  calories: "#8B5CF6",
};

const PRESETS = {
  cutting: { protein: 180, carbs: 150, fats: 50 },
  maintenance: { protein: 160, carbs: 250, fats: 70 },
  bulking: { protein: 180, carbs: 350, fats: 90 },
};

export const MacroSetupModalV2: React.FC<MacroSetupModalProps> = ({
  visible,
  onClose,
  lang,
  existingTarget,
}) => {
  const { colors, isDarkMode } = useColorScheme();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const userId = user?.id || "";

  // Form state
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fats, setFats] = useState("");

  // Animation values for preset pulse effect
  const proteinPulse = useSharedValue(1);
  const carbsPulse = useSharedValue(1);
  const fatsPulse = useSharedValue(1);
  const caloriesPulse = useSharedValue(1);

  // Mutations
  const setTargets = useSetMacroTargets();
  const updateTargets = useUpdateMacroTargets();

  // Initialize with existing values
  useEffect(() => {
    if (visible && existingTarget) {
      setProtein(existingTarget.protein_target.toString());
      setCarbs(existingTarget.carbs_target.toString());
      setFats(existingTarget.fats_target.toString());
    } else if (!visible) {
      setProtein("");
      setCarbs("");
      setFats("");
    }
  }, [visible, existingTarget]);

  // Calculate calories preview
  const proteinNum = parseFloat(protein) || 0;
  const carbsNum = parseFloat(carbs) || 0;
  const fatsNum = parseFloat(fats) || 0;
  const caloriesPreview = calculateCalories(proteinNum, carbsNum, fatsNum);

  const triggerPulse = useCallback((pulseValue: SharedValue<number>) => {
    pulseValue.value = withSequence(
      withTiming(1.03, { duration: 100 }),
      withTiming(0.98, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
  }, []);

  const applyPreset = (preset: keyof typeof PRESETS) => {
    const values = PRESETS[preset];
    setProtein(values.protein.toString());
    setCarbs(values.carbs.toString());
    setFats(values.fats.toString());

    // Trigger staggered pulse animations
    triggerPulse(proteinPulse);
    setTimeout(() => triggerPulse(carbsPulse), 50);
    setTimeout(() => triggerPulse(fatsPulse), 100);

    // Calories gets a more dramatic bounce after all inputs animate
    setTimeout(() => {
      caloriesPulse.value = withSequence(
        withTiming(1.08, { duration: 120 }),
        withTiming(0.95, { duration: 100 }),
        withTiming(1.02, { duration: 80 }),
        withTiming(1, { duration: 80 })
      );
    }, 200);
  };

  // Animated styles for each input
  const proteinAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: proteinPulse.value }],
  }));
  const carbsAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: carbsPulse.value }],
  }));
  const fatsAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: fatsPulse.value }],
  }));
  const caloriesAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: caloriesPulse.value }],
  }));

  const handleClose = () => {
    setProtein("");
    setCarbs("");
    setFats("");
    onClose();
  };

  const handleSubmit = async () => {
    if (proteinNum <= 0 || carbsNum <= 0 || fatsNum <= 0) return;

    try {
      if (existingTarget) {
        await updateTargets.mutateAsync({
          targetId: existingTarget.id,
          protein: proteinNum,
          carbs: carbsNum,
          fats: fatsNum,
          userId,
        });
      } else {
        await setTargets.mutateAsync({
          protein: proteinNum,
          carbs: carbsNum,
          fats: fatsNum,
          userId,
        });
      }
      handleClose();
    } catch (error) {
      console.error("Failed to save macro targets:", error);
    }
  };

  const isPending = setTargets.isPending || updateTargets.isPending;

  const macroInputs = [
    {
      key: "protein",
      label: t.proteinG[lang],
      value: protein,
      setValue: setProtein,
      color: MACRO_COLORS.protein,
      icon: <Beef size={20} color={MACRO_COLORS.protein} />,
      animatedStyle: proteinAnimatedStyle,
    },
    {
      key: "carbs",
      label: t.carbsG[lang],
      value: carbs,
      setValue: setCarbs,
      color: MACRO_COLORS.carbs,
      icon: <Wheat size={20} color={MACRO_COLORS.carbs} />,
      animatedStyle: carbsAnimatedStyle,
    },
    {
      key: "fats",
      label: t.fatsG[lang],
      value: fats,
      setValue: setFats,
      color: MACRO_COLORS.fats,
      icon: <Droplets size={20} color={MACRO_COLORS.fats} />,
      animatedStyle: fatsAnimatedStyle,
    },
  ];

  const presetOptions = [
    { key: "cutting", label: t.cutting[lang] },
    { key: "maintenance", label: t.maintenance[lang] },
    { key: "bulking", label: t.bulking[lang] },
  ];

  // Check if current values match a preset
  const activePreset = Object.entries(PRESETS).find(
    ([_, values]) =>
      proteinNum === values.protein &&
      carbsNum === values.carbs &&
      fatsNum === values.fats
  )?.[0] as keyof typeof PRESETS | undefined;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <View style={styles.overlay}>
            <View
              style={[
                styles.sheet,
                {
                  backgroundColor: isDarkMode
                    ? "rgba(20,20,25,0.98)"
                    : "rgba(255,255,255,0.98)",
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

              <ScrollView
                contentContainerStyle={[
                  styles.content,
                  { paddingBottom: insets.bottom + 20 },
                ]}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                {/* Header */}
                <View style={styles.header}>
                  <View style={styles.headerLeft}>
                    <View
                      style={[
                        styles.headerIcon,
                        { backgroundColor: `${colors.primary[500]}15` },
                      ]}
                    >
                      <Target size={22} color={colors.primary[500]} />
                    </View>
                    <View>
                      <Typography
                        variant="h5"
                        weight="bold"
                        style={{ color: colors.text }}
                      >
                        {t.setupTitle[lang]}
                      </Typography>
                      <Typography variant="caption" color="textMuted">
                        {t.setupSubtitle[lang]}
                      </Typography>
                    </View>
                  </View>
                  <Pressable
                    onPress={handleClose}
                    style={({ pressed }) => [
                      styles.closeButton,
                      {
                        backgroundColor: isDarkMode
                          ? "rgba(255,255,255,0.08)"
                          : "rgba(0,0,0,0.05)",
                        opacity: pressed ? 0.7 : 1,
                      },
                    ]}
                  >
                    <X size={20} color={colors.textMuted} />
                  </Pressable>
                </View>

                {/* Quick presets */}
                <Animated.View entering={FadeInDown.duration(300).delay(50)}>
                  <Typography
                    variant="body2"
                    weight="medium"
                    style={{ color: colors.text, marginBottom: 12 }}
                  >
                    {t.presets[lang]}
                  </Typography>
                  <View style={styles.presetsRow}>
                    {presetOptions.map((preset) => {
                      const isActive = activePreset === preset.key;
                      return (
                        <Pressable
                          key={preset.key}
                          onPress={() =>
                            applyPreset(preset.key as keyof typeof PRESETS)
                          }
                          style={({ pressed }) => [
                            styles.presetButton,
                            {
                              backgroundColor: isActive
                                ? `${colors.primary[500]}10`
                                : isDarkMode
                                ? "rgba(255,255,255,0.05)"
                                : "rgba(0,0,0,0.03)",
                              borderColor: isActive
                                ? `${colors.primary[500]}40`
                                : isDarkMode
                                ? "rgba(255,255,255,0.1)"
                                : "rgba(0,0,0,0.08)",
                              opacity: pressed ? 0.7 : 1,
                            },
                          ]}
                        >
                          <Typography
                            variant="caption"
                            weight="semibold"
                            style={{
                              color: isActive
                                ? colors.primary[500]
                                : colors.text,
                            }}
                          >
                            {preset.label}
                          </Typography>
                          <Typography
                            variant="caption"
                            style={{
                              color: isActive
                                ? colors.primary[400]
                                : colors.textMuted,
                            }}
                          >
                            {calculateCalories(
                              PRESETS[preset.key as keyof typeof PRESETS]
                                .protein,
                              PRESETS[preset.key as keyof typeof PRESETS].carbs,
                              PRESETS[preset.key as keyof typeof PRESETS].fats
                            )}{" "}
                            cal
                          </Typography>
                        </Pressable>
                      );
                    })}
                  </View>
                </Animated.View>

                {/* Macro inputs */}
                <View style={styles.inputsContainer}>
                  {macroInputs.map((input, index) => (
                    <Animated.View
                      key={input.key}
                      entering={FadeInDown.duration(300).delay(
                        100 + index * 50
                      )}
                      style={input.animatedStyle}
                    >
                      <View style={styles.inputGroup}>
                        <View style={styles.inputLabel}>
                          <View
                            style={[
                              styles.inputIcon,
                              { backgroundColor: `${input.color}15` },
                            ]}
                          >
                            {input.icon}
                          </View>
                          <Typography
                            variant="body2"
                            weight="medium"
                            style={{ color: colors.text }}
                          >
                            {input.label}
                          </Typography>
                        </View>
                        <Animated.View>
                          <TextInput
                            value={input.value}
                            onChangeText={input.setValue}
                            keyboardType="numeric"
                            placeholder="0"
                            placeholderTextColor={colors.textMuted}
                            style={[
                              styles.input,
                              {
                                backgroundColor: isDarkMode
                                  ? "rgba(255,255,255,0.05)"
                                  : "rgba(0,0,0,0.03)",
                                borderColor: input.value
                                  ? input.color
                                  : isDarkMode
                                  ? "rgba(255,255,255,0.1)"
                                  : "rgba(0,0,0,0.08)",
                                color: colors.text,
                              },
                            ]}
                          />
                        </Animated.View>
                      </View>
                    </Animated.View>
                  ))}
                </View>

                {/* Calories preview */}
                <Animated.View entering={FadeInDown.duration(300).delay(250)}>
                  <View
                    style={[
                      styles.caloriesPreview,
                      { backgroundColor: `${MACRO_COLORS.calories}12` },
                    ]}
                  >
                    <View style={styles.caloriesLeft}>
                      <View
                        style={[
                          styles.caloriesIcon,
                          { backgroundColor: `${MACRO_COLORS.calories}20` },
                        ]}
                      >
                        <Flame size={18} color={MACRO_COLORS.calories} />
                      </View>
                      <Typography
                        variant="body1"
                        weight="medium"
                        style={{ color: colors.text }}
                      >
                        {t.totalCalories[lang]}
                      </Typography>
                    </View>
                    <View style={styles.caloriesRight}>
                      <Animated.View style={caloriesAnimatedStyle}>
                        <Typography
                          variant="h4"
                          weight="bold"
                          style={{ color: MACRO_COLORS.calories }}
                        >
                          {caloriesPreview}
                        </Typography>
                      </Animated.View>
                      <Typography variant="caption" color="textMuted">
                        {t.calculated[lang]}
                      </Typography>
                    </View>
                  </View>
                </Animated.View>

                {/* Actions */}
                <Animated.View
                  entering={FadeInDown.duration(300).delay(300)}
                  style={styles.actions}
                >
                  <Pressable
                    onPress={handleClose}
                    style={({ pressed }) => [
                      styles.cancelButton,
                      {
                        backgroundColor: isDarkMode
                          ? "rgba(255,255,255,0.06)"
                          : "rgba(0,0,0,0.04)",
                        borderColor: isDarkMode
                          ? "rgba(255,255,255,0.1)"
                          : "rgba(0,0,0,0.08)",
                        opacity: pressed ? 0.7 : 1,
                      },
                    ]}
                  >
                    <Typography
                      variant="body1"
                      weight="semibold"
                      style={{ color: colors.text }}
                    >
                      {t.cancel[lang]}
                    </Typography>
                  </Pressable>

                  <Pressable
                    onPress={handleSubmit}
                    disabled={
                      proteinNum <= 0 ||
                      carbsNum <= 0 ||
                      fatsNum <= 0 ||
                      isPending
                    }
                    style={({ pressed }) => [
                      styles.submitButton,
                      {
                        backgroundColor: colors.primary[500],
                        opacity:
                          proteinNum <= 0 ||
                          carbsNum <= 0 ||
                          fatsNum <= 0 ||
                          isPending
                            ? 0.5
                            : pressed
                            ? 0.8
                            : 1,
                      },
                    ]}
                  >
                    <Typography
                      variant="body1"
                      weight="semibold"
                      style={{ color: "#fff" }}
                    >
                      {isPending ? "..." : t.save[lang]}
                    </Typography>
                  </Pressable>
                </Animated.View>
              </ScrollView>
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "90%",
    overflow: "hidden",
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  presetsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 24,
  },
  presetButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
  },
  inputsContainer: {
    gap: 16,
    marginBottom: 20,
  },
  inputGroup: {
    gap: 0,
  },
  inputLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  inputIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    borderRadius: 14,
    padding: 16,
    fontSize: 18,
    fontWeight: "600",
    borderWidth: 1,
  },
  caloriesPreview: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  caloriesLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  caloriesIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  caloriesRight: {
    alignItems: "flex-end",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 1,
  },
  submitButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
});
