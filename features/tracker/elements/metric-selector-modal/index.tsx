import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import * as Icons from "lucide-react-native";
import { Plus, X } from "lucide-react-native";
import React from "react";
import { Modal, ScrollView, TouchableOpacity, View } from "react-native";
import {
  useAddMetricFromTemplate,
  useAvailableTemplates,
} from "../../hooks/use-tracker-data";

// Métricas predefinidas (temporalmente aquí hasta implementar custom metrics)
const PREDEFINED_METRICS = [
  {
    id: "protein",
    slug: "protein",
    name: "Proteína",
    type: "counter" as const,
    unit: "g",
    canonical_unit: "g",
    conversion_factor: 1,
    default_target: 150,
    color: "#10B981",
    icon: "Beef",
  },
  {
    id: "water",
    slug: "water",
    name: "Agua",
    type: "counter" as const,
    unit: "L",
    canonical_unit: "ml",
    conversion_factor: 1000,
    default_target: 2.5,
    color: "#3B82F6",
    icon: "Droplets",
  },
  {
    id: "weight",
    slug: "weight",
    name: "Peso",
    type: "value" as const,
    unit: "kg",
    canonical_unit: "kg",
    conversion_factor: 1,
    default_target: null,
    color: "#EF4444",
    icon: "Scale",
  },
  {
    id: "sleep",
    slug: "sleep",
    name: "Sueño",
    type: "value" as const,
    unit: "horas",
    canonical_unit: "min",
    conversion_factor: 60,
    default_target: 8,
    color: "#6366F1",
    icon: "Moon",
  },
];

type Props = {
  visible: boolean;
  onClose: () => void;
};

export const MetricSelectorModal: React.FC<Props> = ({ visible, onClose }) => {
  const { colors } = useColorScheme();
  const userId = "default-user"; // TODO: obtener del contexto de usuario

  // Obtener templates disponibles
  const { data: availableTemplates = [], isLoading } =
    useAvailableTemplates(userId);
  const addMetricMutation = useAddMetricFromTemplate();

  if (isLoading) {
    return (
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={onClose}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: colors.background,
          }}
        >
          <Typography>Cargando métricas...</Typography>
        </View>
      </Modal>
    );
  }

  const handleAddMetric = async (templateSlug: string) => {
    try {
      await addMetricMutation.mutateAsync({
        templateSlug,
        userId,
      });
      onClose(); // Cerrar modal después de agregar
    } catch (error) {
      console.error("Error adding metric from template:", error);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
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
          <Typography variant="h6" weight="semibold">
            Agregar Métricas
          </Typography>
          <TouchableOpacity onPress={onClose} style={{ padding: 8 }}>
            <X size={24} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        <ScrollView style={{ flex: 1, padding: 20 }}>
          {/* Available Metrics */}
          <Typography
            variant="h6"
            weight="semibold"
            style={{ marginBottom: 16 }}
          >
            Métricas Disponibles
          </Typography>

          <View style={{ gap: 12 }}>
            {availableTemplates.map((template) => {
              const IconComponent = (Icons as any)[template.icon];

              return (
                <TouchableOpacity
                  key={template.slug}
                  onPress={() => handleAddMetric(template.slug)}
                  disabled={addMetricMutation.isPending}
                  style={{
                    backgroundColor: colors.surface,
                    borderRadius: 12,
                    padding: 16,
                    borderWidth: 1,
                    borderColor: colors.border,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                    opacity: addMetricMutation.isPending ? 0.6 : 1,
                  }}
                  activeOpacity={0.7}
                >
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: template.color + "20",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {IconComponent && (
                      <IconComponent size={20} color={template.color} />
                    )}
                  </View>

                  <View style={{ flex: 1 }}>
                    <Typography
                      variant="body1"
                      weight="medium"
                      style={{ marginBottom: 2 }}
                    >
                      {template.name}
                    </Typography>
                    <Typography variant="caption" color="textMuted">
                      {template.default_target
                        ? `Meta: ${template.default_target} ${template.unit}`
                        : `Unidad: ${template.unit}`}
                    </Typography>
                  </View>

                  <View
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      borderWidth: 2,
                      borderColor: colors.border,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Plus size={16} color={colors.textMuted} />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {availableTemplates.length === 0 && (
            <View
              style={{
                alignItems: "center",
                paddingVertical: 40,
                backgroundColor: colors.gray[50],
                borderRadius: 12,
                marginTop: 16,
              }}
            >
              <Typography variant="body2" color="textMuted" align="center">
                No hay templates disponibles para agregar
              </Typography>
            </View>
          )}

          {/* Create Custom Metric Button */}
          <View style={{ marginTop: 32, marginBottom: 32 }}>
            <Typography
              variant="h6"
              weight="semibold"
              style={{ marginBottom: 16 }}
            >
              Métrica Personalizada
            </Typography>

            <Button
              variant="outline"
              fullWidth
              onPress={() => {
                // TODO: Abrir creador de métrica personalizada
                console.log("Create custom metric");
              }}
              icon={<Plus size={20} color={colors.primary[500]} />}
            >
              Crear Métrica Personalizada
            </Button>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};
