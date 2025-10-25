import { MainMetric } from "@/shared/db/schema";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Button } from "@/shared/ui/button";
import { EnhancedInput } from "@/shared/ui/enhanced-input";
import { Typography } from "@/shared/ui/typography";
import { Settings, Trash2, X } from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  View,
} from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  selectedMetric: MainMetric;
  onSaveTarget: (target: number | null) => Promise<void>;
  onDeleteMetric: () => Promise<void>;
};

export const TargetEditorModal: React.FC<Props> = ({
  visible,
  onClose,
  selectedMetric,
  onSaveTarget,
  onDeleteMetric,
}) => {
  const { colors, isDarkMode } = useColorScheme();
  const [targetValue, setTargetValue] = useState<string>(
    selectedMetric.default_target?.toString() || ""
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveTarget = async () => {
    setIsLoading(true);
    try {
      const target = targetValue.trim() === "" ? null : parseFloat(targetValue);

      // Validación básica
      if (target !== null && (isNaN(target) || target < 0)) {
        return;
      }

      await onSaveTarget(target);
      onClose();
    } catch (error) {
      console.error("Error saving target:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteMetric = async () => {
    Alert.alert(
      "Eliminar Métrica",
      `¿Estás seguro de que quieres eliminar "${selectedMetric.name}"? Esta acción se puede deshacer desde el selector de métricas.`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            setIsLoading(true);
            try {
              await onDeleteMetric();
              onClose();
            } catch (error) {
              console.error("Error deleting metric:", error);
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  const resetForm = () => {
    setTargetValue(selectedMetric.default_target?.toString() || "");
  };

  return (
    <>
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="formSheet"
        onRequestClose={onClose}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={{ flex: 1, backgroundColor: colors.background }}>
            {/* Header */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: 20,
                paddingVertical: 16,
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
              }}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
              >
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    backgroundColor: isDarkMode
                      ? colors.gray[800]
                      : colors.gray[100],
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Settings size={16} color={colors.primary[600]} />
                </View>
                <Typography variant="h6" weight="semibold">
                  Configurar Métrica
                </Typography>
              </View>
              <Button variant="ghost" size="sm" onPress={onClose}>
                <X size={20} color={colors.text} />
              </Button>
            </View>

            {/* Content */}
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{ padding: 20 }}
              showsVerticalScrollIndicator={false}
            >
              {/* Metric Info */}
              <View
                style={{
                  padding: 16,
                  backgroundColor: colors.surface,
                  borderRadius: 12,
                  marginBottom: 24,
                }}
              >
                <Typography
                  variant="body2"
                  color="textMuted"
                  style={{ marginBottom: 4 }}
                >
                  Métrica
                </Typography>
                <Typography variant="h6" weight="medium">
                  {selectedMetric.name}
                </Typography>
              </View>

              {/* Target Editor */}
              <View style={{ marginBottom: 32 }}>
                <Typography
                  variant="h6"
                  weight="medium"
                  style={{ marginBottom: 16 }}
                >
                  Objetivo Diario
                </Typography>

                <EnhancedInput
                  value={targetValue}
                  onChangeText={setTargetValue}
                  placeholder="Ej: 8000"
                  keyboardType="numeric"
                  label="Valor objetivo"
                  helpText={`Unidad: ${selectedMetric.unit}. Deja vacío para sin objetivo`}
                />
              </View>

              {/* Actions */}
              <View style={{ gap: 12 }}>
                <Button
                  variant="primary"
                  onPress={handleSaveTarget}
                  loading={isLoading}
                  disabled={isLoading}
                >
                  Guardar Cambios
                </Button>

                <Button
                  variant="outline"
                  onPress={resetForm}
                  disabled={isLoading}
                >
                  Restablecer
                </Button>

                <Button
                  variant="ghost"
                  onPress={handleDeleteMetric}
                  disabled={isLoading}
                  icon={<Trash2 size={16} color={colors.error[500]} />}
                  style={{
                    marginTop: 16,
                    borderColor: colors.error[500],
                  }}
                >
                  <Typography style={{ color: colors.error[500] }}>
                    Eliminar Métrica
                  </Typography>
                </Button>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
};
