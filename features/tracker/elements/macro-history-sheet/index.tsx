import { calculateCalories } from "@/shared/db/schema/macros";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useAuth } from "@/shared/providers/auth-provider";
import { Typography } from "@/shared/ui/typography";
import {
  Beef,
  Clock,
  Droplets,
  Flame,
  Trash2,
  Wheat,
  X,
} from "lucide-react-native";
import React from "react";
import { Modal, ScrollView, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  useDeleteMacroEntry,
  useMacroDayData,
} from "../../hooks/use-macro-data";

type MacroHistorySheetProps = {
  visible: boolean;
  onClose: () => void;
  selectedDate: string;
  lang: "es" | "en";
};

const translations = {
  title: { es: "Historial del día", en: "Today's history" },
  noEntries: { es: "Sin registros", en: "No entries" },
  noEntriesDesc: {
    es: "Aún no has registrado macros hoy",
    en: "You haven't logged any macros today",
  },
  total: { es: "Total", en: "Total" },
  cal: { es: "cal", en: "cal" },
};

const macroColors = {
  protein: "#EF4444",
  carbs: "#F59E0B",
  fats: "#3B82F6",
  calories: "#8B5CF6",
};

export const MacroHistorySheet: React.FC<MacroHistorySheetProps> = ({
  visible,
  onClose,
  selectedDate,
  lang,
}) => {
  const { colors } = useColorScheme();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const userId = user?.id || "";

  const { data: dayData } = useMacroDayData(selectedDate, userId);
  const deleteEntry = useDeleteMacroEntry();

  const entries = dayData?.entries || [];
  const aggregate = dayData?.aggregate;

  const handleDelete = async (entryId: string) => {
    try {
      await deleteEntry.mutateAsync({ entryId, userId });
    } catch (error) {
      console.error("Error deleting macro entry:", error);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString(lang === "es" ? "es-ES" : "en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
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
            maxHeight: "80%",
          }}
        >
          {/* Header */}
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
            <TouchableOpacity onPress={onClose}>
              <X size={24} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView
            style={{ flexGrow: 0 }}
            contentContainerStyle={{
              padding: 20,
              paddingBottom: insets.bottom + 20,
            }}
            showsVerticalScrollIndicator={false}
          >
            {entries.length === 0 ? (
              <View
                style={{
                  alignItems: "center",
                  paddingVertical: 40,
                  gap: 12,
                }}
              >
                <Flame size={48} color={colors.textMuted} />
                <Typography variant="body1" weight="medium" color="textMuted">
                  {translations.noEntries[lang]}
                </Typography>
                <Typography variant="body2" color="textMuted" align="center">
                  {translations.noEntriesDesc[lang]}
                </Typography>
              </View>
            ) : (
              <View style={{ gap: 12 }}>
                {entries.map((entry) => {
                  const calories = calculateCalories(
                    entry.protein,
                    entry.carbs,
                    entry.fats
                  );

                  return (
                    <View
                      key={entry.id}
                      style={{
                        backgroundColor: colors.surface,
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor: colors.border,
                        padding: 16,
                      }}
                    >
                      {/* Entry header */}
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          marginBottom: 12,
                        }}
                      >
                        <View style={{ flex: 1 }}>
                          {entry.label && (
                            <Typography
                              variant="body1"
                              weight="semibold"
                              style={{ marginBottom: 4 }}
                            >
                              {entry.label}
                            </Typography>
                          )}
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              gap: 6,
                            }}
                          >
                            <Clock size={12} color={colors.textMuted} />
                            <Typography variant="caption" color="textMuted">
                              {formatTime(entry.recorded_at)}
                            </Typography>
                          </View>
                        </View>

                        {/* Delete button */}
                        <TouchableOpacity
                          onPress={() => handleDelete(entry.id)}
                          disabled={deleteEntry.isPending}
                          style={{
                            padding: 8,
                            borderRadius: 8,
                            backgroundColor: colors.error[50],
                            opacity: deleteEntry.isPending ? 0.5 : 1,
                          }}
                          activeOpacity={0.7}
                        >
                          <Trash2 size={16} color={colors.error[500]} />
                        </TouchableOpacity>
                      </View>

                      {/* Macro values */}
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          gap: 8,
                        }}
                      >
                        <MacroValue
                          icon={<Beef size={14} color={macroColors.protein} />}
                          value={entry.protein}
                          unit="g"
                          color={macroColors.protein}
                        />
                        <MacroValue
                          icon={<Wheat size={14} color={macroColors.carbs} />}
                          value={entry.carbs}
                          unit="g"
                          color={macroColors.carbs}
                        />
                        <MacroValue
                          icon={<Droplets size={14} color={macroColors.fats} />}
                          value={entry.fats}
                          unit="g"
                          color={macroColors.fats}
                        />
                        <MacroValue
                          icon={
                            <Flame size={14} color={macroColors.calories} />
                          }
                          value={calories}
                          unit=""
                          color={macroColors.calories}
                          isBold
                        />
                      </View>

                      {/* Notes */}
                      {entry.notes && (
                        <Typography
                          variant="caption"
                          color="textMuted"
                          style={{ marginTop: 8 }}
                        >
                          {entry.notes}
                        </Typography>
                      )}
                    </View>
                  );
                })}

                {/* Total summary */}
                {aggregate && entries.length > 1 && (
                  <View
                    style={{
                      backgroundColor: macroColors.calories + "15",
                      borderRadius: 12,
                      padding: 16,
                      marginTop: 8,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="body1" weight="semibold">
                        {translations.total[lang]}
                      </Typography>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "baseline",
                          gap: 4,
                        }}
                      >
                        <Typography
                          variant="h5"
                          weight="bold"
                          style={{ color: macroColors.calories }}
                        >
                          {Math.round(aggregate.total_calories)}
                        </Typography>
                        <Typography variant="caption" color="textMuted">
                          {translations.cal[lang]}
                        </Typography>
                      </View>
                    </View>

                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-around",
                        marginTop: 12,
                      }}
                    >
                      <MacroTotal
                        label="P"
                        value={aggregate.total_protein}
                        color={macroColors.protein}
                      />
                      <MacroTotal
                        label="C"
                        value={aggregate.total_carbs}
                        color={macroColors.carbs}
                      />
                      <MacroTotal
                        label="F"
                        value={aggregate.total_fats}
                        color={macroColors.fats}
                      />
                    </View>
                  </View>
                )}
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

// Helper components
type MacroValueProps = {
  icon: React.ReactNode;
  value: number;
  unit: string;
  color: string;
  isBold?: boolean;
};

const MacroValue: React.FC<MacroValueProps> = ({
  icon,
  value,
  unit,
  color,
  isBold,
}) => {
  const { colors } = useColorScheme();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        backgroundColor: color + "10",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
      }}
    >
      {icon}
      <Typography
        variant="caption"
        weight={isBold ? "bold" : "medium"}
        style={{ color }}
      >
        {Math.round(value)}
        {unit}
      </Typography>
    </View>
  );
};

type MacroTotalProps = {
  label: string;
  value: number;
  color: string;
};

const MacroTotal: React.FC<MacroTotalProps> = ({ label, value, color }) => (
  <View style={{ alignItems: "center" }}>
    <Typography variant="caption" color="textMuted">
      {label}
    </Typography>
    <Typography variant="body2" weight="semibold" style={{ color }}>
      {Math.round(value)}g
    </Typography>
  </View>
);
