import {
  MacroTargetWithCalories,
  calculateCalories,
} from "@/shared/db/schema/macros";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useAuth } from "@/shared/providers/auth-provider";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { Beef, Droplets, Flame, Target, Wheat, X } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import {
  useSetMacroTargets,
  useUpdateMacroTargets,
} from "../../hooks/use-macro-data";

type MacroSetupModalProps = {
  visible: boolean;
  onClose: () => void;
  lang: "es" | "en";
  existingTarget?: MacroTargetWithCalories;
};

const translations = {
  title: { es: "Objetivos de Macros", en: "Macro Targets" },
  subtitle: {
    es: "Establece tus objetivos diarios",
    en: "Set your daily targets",
  },
  protein: { es: "Proteína (g)", en: "Protein (g)" },
  carbs: { es: "Carbohidratos (g)", en: "Carbs (g)" },
  fats: { es: "Grasas (g)", en: "Fats (g)" },
  calories: { es: "Calorías totales", en: "Total calories" },
  save: { es: "Guardar", en: "Save" },
  cancel: { es: "Cancelar", en: "Cancel" },
  calculated: { es: "calculadas", en: "calculated" },
  presets: { es: "Presets rápidos", en: "Quick presets" },
  cutting: { es: "Cutting", en: "Cutting" },
  maintenance: { es: "Mantenimiento", en: "Maintenance" },
  bulking: { es: "Volumen", en: "Bulking" },
};

// Common macro presets
const PRESETS = {
  cutting: { protein: 180, carbs: 150, fats: 50 }, // ~1,770 cal
  maintenance: { protein: 160, carbs: 250, fats: 70 }, // ~2,270 cal
  bulking: { protein: 180, carbs: 350, fats: 90 }, // ~2,930 cal
};

export const MacroSetupModal: React.FC<MacroSetupModalProps> = ({
  visible,
  onClose,
  lang,
  existingTarget,
}) => {
  const { colors } = useColorScheme();
  const { user } = useAuth();
  const userId = user?.id || "";

  // Form state
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fats, setFats] = useState("");

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

  const applyPreset = (preset: keyof typeof PRESETS) => {
    const values = PRESETS[preset];
    setProtein(values.protein.toString());
    setCarbs(values.carbs.toString());
    setFats(values.fats.toString());
  };

  const handleClose = () => {
    setProtein("");
    setCarbs("");
    setFats("");
    onClose();
  };

  const handleSubmit = async () => {
    if (proteinNum <= 0 || carbsNum <= 0 || fatsNum <= 0) {
      return;
    }

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
      label: translations.protein[lang],
      value: protein,
      setValue: setProtein,
      color: "#EF4444",
      icon: <Beef size={20} color="#EF4444" />,
    },
    {
      key: "carbs",
      label: translations.carbs[lang],
      value: carbs,
      setValue: setCarbs,
      color: "#F59E0B",
      icon: <Wheat size={20} color="#F59E0B" />,
    },
    {
      key: "fats",
      label: translations.fats[lang],
      value: fats,
      setValue: setFats,
      color: "#3B82F6",
      icon: <Droplets size={20} color="#3B82F6" />,
    },
  ];

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
          style={{ flex: 1 }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.5)",
              justifyContent: "flex-end",
            }}
          >
            <View
              style={{
                backgroundColor: colors.background,
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                maxHeight: "90%",
              }}
            >
              <ScrollView
                contentContainerStyle={{
                  padding: 20,
                  paddingBottom: 40,
                }}
                keyboardShouldPersistTaps="handled"
              >
                {/* Header */}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <Target size={24} color={colors.primary[500]} />
                    <Typography variant="h5" weight="bold">
                      {translations.title[lang]}
                    </Typography>
                  </View>
                  <TouchableOpacity onPress={handleClose}>
                    <X size={24} color={colors.textMuted} />
                  </TouchableOpacity>
                </View>

                <Typography
                  variant="body2"
                  color="textMuted"
                  style={{ marginBottom: 20 }}
                >
                  {translations.subtitle[lang]}
                </Typography>

                {/* Quick presets */}
                <View style={{ marginBottom: 20 }}>
                  <Typography
                    variant="body2"
                    weight="medium"
                    style={{ marginBottom: 12 }}
                  >
                    {translations.presets[lang]}
                  </Typography>
                  <View style={{ flexDirection: "row", gap: 8 }}>
                    {[
                      { key: "cutting", label: translations.cutting[lang] },
                      {
                        key: "maintenance",
                        label: translations.maintenance[lang],
                      },
                      { key: "bulking", label: translations.bulking[lang] },
                    ].map((preset) => (
                      <TouchableOpacity
                        key={preset.key}
                        onPress={() =>
                          applyPreset(preset.key as keyof typeof PRESETS)
                        }
                        style={{
                          flex: 1,
                          backgroundColor: colors.surface,
                          paddingVertical: 10,
                          paddingHorizontal: 12,
                          borderRadius: 8,
                          alignItems: "center",
                          borderWidth: 1,
                          borderColor: colors.border,
                        }}
                        activeOpacity={0.7}
                      >
                        <Typography variant="caption" weight="medium">
                          {preset.label}
                        </Typography>
                        <Typography variant="caption" color="textMuted">
                          {calculateCalories(
                            PRESETS[preset.key as keyof typeof PRESETS].protein,
                            PRESETS[preset.key as keyof typeof PRESETS].carbs,
                            PRESETS[preset.key as keyof typeof PRESETS].fats
                          )}{" "}
                          cal
                        </Typography>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Macro inputs */}
                <View style={{ gap: 16 }}>
                  {macroInputs.map((input) => (
                    <View key={input.key}>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 8,
                          marginBottom: 8,
                        }}
                      >
                        {input.icon}
                        <Typography variant="body2" weight="medium">
                          {input.label}
                        </Typography>
                      </View>
                      <TextInput
                        value={input.value}
                        onChangeText={input.setValue}
                        keyboardType="numeric"
                        placeholder="0"
                        placeholderTextColor={colors.textMuted}
                        style={{
                          backgroundColor: colors.surface,
                          borderRadius: 12,
                          padding: 16,
                          fontSize: 18,
                          fontWeight: "600",
                          color: colors.text,
                          borderWidth: 1,
                          borderColor: input.value
                            ? input.color
                            : colors.border,
                        }}
                      />
                    </View>
                  ))}
                </View>

                {/* Calories preview */}
                <View
                  style={{
                    backgroundColor: "#8B5CF6" + "15",
                    borderRadius: 12,
                    padding: 16,
                    marginTop: 20,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <Flame size={20} color="#8B5CF6" />
                    <Typography variant="body1" weight="medium">
                      {translations.calories[lang]}
                    </Typography>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "baseline",
                      gap: 4,
                    }}
                  >
                    <Typography
                      variant="h4"
                      weight="bold"
                      style={{ color: "#8B5CF6" }}
                    >
                      {caloriesPreview}
                    </Typography>
                    <Typography variant="caption" color="textMuted">
                      {translations.calculated[lang]}
                    </Typography>
                  </View>
                </View>

                {/* Actions */}
                <View style={{ flexDirection: "row", gap: 12, marginTop: 24 }}>
                  <Button
                    variant="outline"
                    size="lg"
                    onPress={handleClose}
                    style={{ flex: 1 }}
                  >
                    {translations.cancel[lang]}
                  </Button>
                  <Button
                    variant="primary"
                    size="lg"
                    onPress={handleSubmit}
                    loading={isPending}
                    disabled={
                      proteinNum <= 0 ||
                      carbsNum <= 0 ||
                      fatsNum <= 0 ||
                      isPending
                    }
                    style={{ flex: 1 }}
                  >
                    {translations.save[lang]}
                  </Button>
                </View>
              </ScrollView>
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
