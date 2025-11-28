import { PREDEFINED_QUICK_ACTION_TEMPLATES } from "@/features/tracker/constants/templates";
import {
  useAddEntry,
  useAddEntryFromQuickAction,
} from "@/features/tracker/hooks/use-tracker-data";
import { formatValue } from "@/features/tracker/utils/helpers";
import { TrackerMetricWithQuickActions } from "@/shared/db/schema/tracker";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useHaptic } from "@/shared/services/haptic-service";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { useAuth } from "@/shared/providers/auth-provider";
import {
  getQuickActionLabel,
  trackerTranslations,
} from "@/shared/translations/tracker";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { fromKg } from "@/shared/utils/weight-conversion";
import * as Icons from "lucide-react-native";
import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";

type Props = {
  selectedMetric: TrackerMetricWithQuickActions;
  selectedDate: string;
  onCloseModal: () => void;
  lang: "es" | "en";
};

export const QuickActions: React.FC<Props> = ({
  selectedMetric,
  onCloseModal,
  selectedDate,
  lang,
}) => {
  const [quickActionCounts, setQuickActionCounts] = useState<{
    [index: number]: number;
  }>({});

  const addQuickActionMutation = useAddEntryFromQuickAction();
  const addEntryMutation = useAddEntry();
  const { colors } = useColorScheme();
  const haptic = useHaptic();
  const { user } = useAuth();
  const prefs = useUserPreferences();
  const weightUnit = prefs?.weight_unit ?? "kg";
  const t = trackerTranslations;

  const isWeightMetric = selectedMetric.slug === "weight";
  const displayUnit = isWeightMetric ? weightUnit : selectedMetric.unit;

  const getQuickActions = () => {
    if (!selectedMetric) return [];

    if (selectedMetric.quick_actions && selectedMetric.quick_actions.length) {
      return selectedMetric.quick_actions;
    }

    return PREDEFINED_QUICK_ACTION_TEMPLATES[selectedMetric.slug || ""] || [];
  };

  const quickActions = getQuickActions();

  const handleQuickActionIncrement = (actionIndex: number) => {
    haptic.light();
    setQuickActionCounts((prev) => ({
      ...prev,
      [actionIndex]: (prev[actionIndex] || 0) + 1,
    }));
  };

  const handleQuickActionDecrement = (actionIndex: number) => {
    haptic.light();
    setQuickActionCounts((prev) => ({
      ...prev,
      [actionIndex]: Math.max(0, (prev[actionIndex] || 0) - 1),
    }));
  };

  const handleConfirmQuickActions = async () => {
    if (!selectedMetric) return;

    try {
      for (const [indexStr, count] of Object.entries(quickActionCounts)) {
        const actionIndex = parseInt(indexStr);
        const action = quickActions?.[actionIndex];

        if (action && count > 0) {
          // Add each count as a separate entry
          for (let i = 0; i < count; i++) {
            // Verificar si es un quick action real (UUID) o un template (slug)
            const isRealQuickAction = action.id && action.id.includes("-"); // UUIDs tienen guiones

            if (isRealQuickAction) {
              // Quick action real de la DB
              if (!user?.id) {
                throw new Error("Usuario no autenticado");
              }

              await addQuickActionMutation.mutateAsync({
                quickActionId: action.id,
                userId: user.id,
                notes: `Quick: ${getQuickActionLabel(action, lang)}`,
                recordedAt: selectedDate,
                slug: selectedMetric.slug,
              });
            } else {
              // Template - crear entry directo con addEntryMutation
              if (!user?.id) {
                throw new Error("Usuario no autenticado");
              }

              await addEntryMutation.mutateAsync({
                metricId: selectedMetric.id,
                value: action.value,
                userId: user.id,
                notes: `Quick: ${getQuickActionLabel(action, lang)}`,
                recordedAt: selectedDate,
                displayValue:
                  (action as any).display_value || `${action.value}`,
              });
            }
          }
        }
      }

      setQuickActionCounts({});
      haptic.success();
      onCloseModal();
    } catch (error: any) {
      console.error("Error adding quick actions:", error);

      // Mejor manejo de errores
      if (error.message?.includes("foreign key constraint")) {
        alert(
          "Error: La métrica no está sincronizada con el servidor. Es posible que la función RPC no se haya ejecutado en Supabase."
        );
      } else {
        alert(
          `Error al agregar entradas: ${error.message || "Error desconocido"}`
        );
      }
    }
  };

  const getTotalQuickActionValue = () => {
    if (!selectedMetric) return 0;

    return Object.entries(quickActionCounts).reduce(
      (total, [indexStr, count]) => {
        const actionIndex = parseInt(indexStr);
        const action = quickActions?.[actionIndex];
        return total + (action ? action.value * count : 0);
      },
      0
    );
  };

  const hasQuickActionSelections = () => {
    return Object.values(quickActionCounts).some((count) => count > 0);
  };

  if (!quickActions || quickActions.length === 0) return null;

  return (
    <View style={{ marginBottom: 32 }}>
      <Typography variant="h6" weight="semibold" style={{ marginBottom: 16 }}>
        {t.quickActions.title[lang]}
      </Typography>
      <View style={{ flexDirection: "column", gap: 8 }}>
        {quickActions.map((action, index) => {
          const ActionIcon = action.icon ? (Icons as any)[action.icon] : null;
          const count = quickActionCounts[index] || 0;

          return (
            <View
              key={index}
              style={{
                backgroundColor:
                  count > 0 ? selectedMetric.color + "10" : colors.surface,
                borderRadius: 12,
                padding: 16,
                borderWidth: 1,
                borderColor: count > 0 ? selectedMetric.color : colors.border,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                {/* Action Info */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                    flex: 1,
                  }}
                >
                  {ActionIcon && (
                    <ActionIcon size={20} color={selectedMetric.color} />
                  )}
                  <View style={{ flex: 1 }}>
                    <Typography
                      variant="body2"
                      weight="medium"
                      style={{ marginBottom: 2 }}
                    >
                      {getQuickActionLabel(action, lang)}
                    </Typography>
                    <Typography variant="caption" color="textMuted">
                      +
                      {formatValue(
                        isWeightMetric
                          ? fromKg(action.value, weightUnit, 1)
                          : action.value
                      )}{" "}
                      {displayUnit}
                      {count > 0 &&
                        ` × ${count} = +${formatValue(
                          isWeightMetric
                            ? fromKg(action.value * count, weightUnit, 1)
                            : action.value * count
                        )} ${displayUnit}`}
                    </Typography>
                  </View>
                </View>

                {/* Counter Controls */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => handleQuickActionDecrement(index)}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      backgroundColor:
                        count > 0 ? colors.gray[400] : colors.gray[100],
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    activeOpacity={0.7}
                    disabled={count === 0}
                  >
                    <Typography
                      variant="body2"
                      weight="bold"
                      style={{
                        color: count > 0 ? colors.text : colors.textMuted,
                        fontSize: 18,
                      }}
                    >
                      −
                    </Typography>
                  </TouchableOpacity>

                  <View
                    style={{
                      minWidth: 24,
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="body1"
                      weight="bold"
                      style={{
                        color:
                          count > 0 ? selectedMetric.color : colors.textMuted,
                      }}
                    >
                      {count}
                    </Typography>
                  </View>

                  <TouchableOpacity
                    onPress={() => handleQuickActionIncrement(index)}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      backgroundColor: selectedMetric.color + "20",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    activeOpacity={0.7}
                  >
                    <Typography
                      variant="body2"
                      weight="bold"
                      style={{
                        color: selectedMetric.color,
                        fontSize: 18,
                      }}
                    >
                      +
                    </Typography>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        })}

        {/* Confirm Quick Actions Button */}
        {hasQuickActionSelections() && (
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onPress={handleConfirmQuickActions}
            style={{ marginTop: 8 }}
            icon={<Icons.Plus size={20} color="#ffffff" />}
          >
            {t.quickActions.addSelection[lang]} (+
            {formatValue(
              isWeightMetric
                ? fromKg(getTotalQuickActionValue(), weightUnit, 1)
                : getTotalQuickActionValue()
            )}{" "}
            {displayUnit})
          </Button>
        )}
      </View>
    </View>
  );
};
