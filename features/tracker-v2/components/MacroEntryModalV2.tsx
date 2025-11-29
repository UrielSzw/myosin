import { calculateCalories } from "@/shared/db/schema/macros";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useAuth } from "@/shared/providers/auth-provider";
import { Typography } from "@/shared/ui/typography";
import { BlurView } from "expo-blur";
import { Beef, Droplets, Flame, Wheat, X } from "lucide-react-native";
import React, { useState } from "react";
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
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAddMacroEntry } from "../../tracker/hooks/use-macro-data";

type MacroEntryModalProps = {
  visible: boolean;
  onClose: () => void;
  selectedDate: string;
  lang: "es" | "en";
};

const translations = {
  title: { es: "Agregar Macros", en: "Add Macros" },
  protein: { es: "Proteína (g)", en: "Protein (g)" },
  carbs: { es: "Carbohidratos (g)", en: "Carbs (g)" },
  fats: { es: "Grasas (g)", en: "Fats (g)" },
  calories: { es: "Calorías", en: "Calories" },
  label: { es: "Nombre (opcional)", en: "Label (optional)" },
  labelPlaceholder: {
    es: "Ej: Almuerzo, Snack...",
    en: "E.g: Lunch, Snack...",
  },
  add: { es: "Agregar", en: "Add" },
  cancel: { es: "Cancelar", en: "Cancel" },
  calculated: { es: "calculadas", en: "calculated" },
};

const MACRO_COLORS = {
  protein: "#EF4444",
  carbs: "#F59E0B",
  fats: "#3B82F6",
  calories: "#8B5CF6",
};

export const MacroEntryModalV2: React.FC<MacroEntryModalProps> = ({
  visible,
  onClose,
  selectedDate,
  lang,
}) => {
  const { colors, isDarkMode } = useColorScheme();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const userId = user?.id || "";

  // Form state
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fats, setFats] = useState("");
  const [label, setLabel] = useState("");

  // Mutation
  const addEntry = useAddMacroEntry();

  // Calculate calories preview
  const proteinNum = parseFloat(protein) || 0;
  const carbsNum = parseFloat(carbs) || 0;
  const fatsNum = parseFloat(fats) || 0;
  const caloriesPreview = calculateCalories(proteinNum, carbsNum, fatsNum);

  const handleClose = () => {
    setProtein("");
    setCarbs("");
    setFats("");
    setLabel("");
    onClose();
  };

  const handleSubmit = async () => {
    if (proteinNum === 0 && carbsNum === 0 && fatsNum === 0) {
      return;
    }

    try {
      await addEntry.mutateAsync({
        protein: proteinNum,
        carbs: carbsNum,
        fats: fatsNum,
        userId,
        label: label.trim() || undefined,
        recordedAt: selectedDate,
      });
      handleClose();
    } catch (error) {
      console.error("Failed to add macro entry:", error);
    }
  };

  const macroInputs = [
    {
      key: "protein",
      label: translations.protein[lang],
      value: protein,
      setValue: setProtein,
      color: MACRO_COLORS.protein,
      icon: <Beef size={20} color={MACRO_COLORS.protein} />,
    },
    {
      key: "carbs",
      label: translations.carbs[lang],
      value: carbs,
      setValue: setCarbs,
      color: MACRO_COLORS.carbs,
      icon: <Wheat size={20} color={MACRO_COLORS.carbs} />,
    },
    {
      key: "fats",
      label: translations.fats[lang],
      value: fats,
      setValue: setFats,
      color: MACRO_COLORS.fats,
      icon: <Droplets size={20} color={MACRO_COLORS.fats} />,
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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

              {/* Header */}
              <View style={styles.header}>
                <Typography
                  variant="h5"
                  weight="bold"
                  style={{ color: colors.text }}
                >
                  {translations.title[lang]}
                </Typography>
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

              {/* Content */}
              <ScrollView
                style={styles.scrollView}
                contentContainerStyle={[
                  styles.content,
                  { paddingBottom: insets.bottom + 20 },
                ]}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                {/* Macro inputs */}
                <View style={styles.inputsContainer}>
                  {macroInputs.map((input, index) => (
                    <Animated.View
                      key={input.key}
                      entering={FadeInDown.duration(300).delay(index * 50)}
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
                      </View>
                    </Animated.View>
                  ))}
                </View>

                {/* Calories preview */}
                <Animated.View entering={FadeInDown.duration(300).delay(150)}>
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
                        {translations.calories[lang]}
                      </Typography>
                    </View>
                    <View style={styles.caloriesRight}>
                      <Typography
                        variant="h4"
                        weight="bold"
                        style={{ color: MACRO_COLORS.calories }}
                      >
                        {caloriesPreview}
                      </Typography>
                      <Typography variant="caption" color="textMuted">
                        {translations.calculated[lang]}
                      </Typography>
                    </View>
                  </View>
                </Animated.View>

                {/* Label input */}
                <Animated.View entering={FadeInDown.duration(300).delay(200)}>
                  <View style={styles.inputGroup}>
                    <Typography
                      variant="body2"
                      weight="medium"
                      style={{ color: colors.text, marginBottom: 8 }}
                    >
                      {translations.label[lang]}
                    </Typography>
                    <TextInput
                      value={label}
                      onChangeText={setLabel}
                      placeholder={translations.labelPlaceholder[lang]}
                      placeholderTextColor={colors.textMuted}
                      style={[
                        styles.input,
                        {
                          backgroundColor: isDarkMode
                            ? "rgba(255,255,255,0.05)"
                            : "rgba(0,0,0,0.03)",
                          borderColor: isDarkMode
                            ? "rgba(255,255,255,0.1)"
                            : "rgba(0,0,0,0.08)",
                          color: colors.text,
                          fontWeight: "400",
                        },
                      ]}
                    />
                  </View>
                </Animated.View>

                {/* Actions */}
                <Animated.View
                  entering={FadeInDown.duration(300).delay(250)}
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
                      {translations.cancel[lang]}
                    </Typography>
                  </Pressable>

                  <Pressable
                    onPress={handleSubmit}
                    disabled={
                      (proteinNum === 0 && carbsNum === 0 && fatsNum === 0) ||
                      addEntry.isPending
                    }
                    style={({ pressed }) => [
                      styles.submitButton,
                      {
                        backgroundColor: colors.primary[500],
                        opacity:
                          (proteinNum === 0 &&
                            carbsNum === 0 &&
                            fatsNum === 0) ||
                          addEntry.isPending
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
                      {addEntry.isPending ? "..." : translations.add[lang]}
                    </Typography>
                  </Pressable>
                </Animated.View>
              </ScrollView>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    flexGrow: 0,
  },
  content: {
    padding: 20,
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
    marginBottom: 20,
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
    marginTop: 8,
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
