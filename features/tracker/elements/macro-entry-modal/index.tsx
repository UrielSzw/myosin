import { calculateCalories } from "@/shared/db/schema/macros";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useAuth } from "@/shared/providers/auth-provider";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { Beef, Droplets, Flame, Wheat, X } from "lucide-react-native";
import React, { useState } from "react";
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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAddMacroEntry } from "../../hooks/use-macro-data";

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

export const MacroEntryModal: React.FC<MacroEntryModalProps> = ({
  visible,
  onClose,
  selectedDate,
  lang,
}) => {
  const { colors } = useColorScheme();
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
      return; // Don't submit empty entry
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
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
              {/* Header - Fixed */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: 20,
                  paddingBottom: 16,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.border,
                }}
              >
                <Typography variant="h5" weight="bold">
                  {translations.title[lang]}
                </Typography>
                <TouchableOpacity onPress={handleClose}>
                  <X size={24} color={colors.textMuted} />
                </TouchableOpacity>
              </View>

              {/* Scrollable Content */}
              <ScrollView
                style={{ flexGrow: 0 }}
                contentContainerStyle={{
                  padding: 20,
                  paddingBottom: insets.bottom + 20,
                }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
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

                {/* Label input */}
                <View style={{ marginTop: 16 }}>
                  <Typography
                    variant="body2"
                    weight="medium"
                    style={{ marginBottom: 8 }}
                  >
                    {translations.label[lang]}
                  </Typography>
                  <TextInput
                    value={label}
                    onChangeText={setLabel}
                    placeholder={translations.labelPlaceholder[lang]}
                    placeholderTextColor={colors.textMuted}
                    style={{
                      backgroundColor: colors.surface,
                      borderRadius: 12,
                      padding: 16,
                      fontSize: 16,
                      color: colors.text,
                      borderWidth: 1,
                      borderColor: colors.border,
                    }}
                  />
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
                    loading={addEntry.isPending}
                    disabled={
                      (proteinNum === 0 && carbsNum === 0 && fatsNum === 0) ||
                      addEntry.isPending
                    }
                    style={{ flex: 1 }}
                  >
                    {translations.add[lang]}
                  </Button>
                </View>
              </ScrollView>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
};
