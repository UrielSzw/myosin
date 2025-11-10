import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useAuth } from "@/shared/providers/auth-provider";
import { Typography } from "@/shared/ui/typography";
import * as Icons from "lucide-react-native";
import { Plus, RotateCcw, X } from "lucide-react-native";
import React, { useState } from "react";
import { Modal, ScrollView, TouchableOpacity, View } from "react-native";
import {
  useAddMetricFromTemplate,
  useAvailableTemplates,
  useDeletedMetrics,
  useRestoreMetric,
} from "../../hooks/use-tracker-data";

type Props = {
  visible: boolean;
  onClose: () => void;
};

export const MetricSelectorModal: React.FC<Props> = ({ visible, onClose }) => {
  const { colors } = useColorScheme();
  const { user } = useAuth();
  const [showDeleted, setShowDeleted] = useState(false);

  // Obtener templates disponibles y métricas eliminadas
  const { data: availableTemplates = [], isLoading } = useAvailableTemplates(
    user?.id || ""
  );
  const { data: deletedMetrics = [] } = useDeletedMetrics(user?.id || "");
  const addMetricMutation = useAddMetricFromTemplate();
  const restoreMetricMutation = useRestoreMetric();

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
    if (!user) return;

    try {
      await addMetricMutation.mutateAsync({
        templateSlug,
        userId: user.id,
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

          {/* Deleted Metrics Section */}
          {deletedMetrics.length > 0 && (
            <View style={{ marginTop: 32 }}>
              <TouchableOpacity
                onPress={() => setShowDeleted(!showDeleted)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 16,
                }}
              >
                <Typography variant="h6" weight="semibold">
                  Métricas Eliminadas ({deletedMetrics.length})
                </Typography>
                <View
                  style={{
                    transform: [{ rotate: showDeleted ? "90deg" : "0deg" }],
                  }}
                >
                  <Icons.ChevronRight size={20} color={colors.textMuted} />
                </View>
              </TouchableOpacity>

              {showDeleted && (
                <View style={{ gap: 12 }}>
                  {deletedMetrics.map((metric) => {
                    const IconComponent = (Icons as any)[metric.icon];

                    return (
                      <TouchableOpacity
                        key={metric.id}
                        onPress={async () => {
                          try {
                            await restoreMetricMutation.mutateAsync(metric.id);
                          } catch (error) {
                            console.error("Error restoring metric:", error);
                          }
                        }}
                        disabled={restoreMetricMutation.isPending}
                        style={{
                          backgroundColor: colors.surface,
                          borderRadius: 12,
                          padding: 16,
                          borderWidth: 1,
                          borderColor: colors.border,
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 12,
                          opacity: restoreMetricMutation.isPending ? 0.6 : 0.8,
                        }}
                        activeOpacity={0.7}
                      >
                        <View
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                            backgroundColor: metric.color + "20",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {IconComponent && (
                            <IconComponent size={20} color={metric.color} />
                          )}
                        </View>

                        <View style={{ flex: 1 }}>
                          <Typography
                            variant="body1"
                            weight="medium"
                            style={{ marginBottom: 2, opacity: 0.7 }}
                          >
                            {metric.name}
                          </Typography>
                          <Typography variant="caption" color="textMuted">
                            {metric.default_target
                              ? `Meta: ${metric.default_target} ${metric.unit}`
                              : `Unidad: ${metric.unit}`}
                          </Typography>
                        </View>

                        <View
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 16,
                            backgroundColor: colors.primary[100],
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <RotateCcw size={16} color={colors.primary[600]} />
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>
          )}

          {/* Create Custom Metric Button */}
          <View style={{ marginTop: 32, marginBottom: 32 }}>
            {/* <Typography
              variant="h6"
              weight="semibold"
              style={{ marginBottom: 16 }}
            >
              Métrica Personalizada
            </Typography> */}

            {/* <Button
              variant="outline"
              fullWidth
              onPress={() => {
                onClose();
                router.push("/metric/create");
              }}
              icon={<Plus size={20} color={colors.primary[500]} />}
            >
              Crear Métrica Personalizada
            </Button> */}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};
